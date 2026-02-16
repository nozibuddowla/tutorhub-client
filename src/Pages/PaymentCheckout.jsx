import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";

// Load Stripe (Replace with your Stripe Publishable Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  // Get application data from location state or sessionStorage
  const application =
    location.state?.application ||
    JSON.parse(sessionStorage.getItem("pendingApplication") || "{}");

  const amount = application.expectedSalary || 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent on server
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          amount: amount,
          currency: "bdt",
        },
        { withCredentials: true },
      );

      const clientSecret = data.clientSecret;

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Anonymous",
              email: user?.email || "anonymous@email.com",
            },
          },
        },
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Save payment to database
        await axios.post(
          `${import.meta.env.VITE_API_URL}/payments`,
          {
            amount: amount,
            transactionId: paymentIntent.id,
            status: "success",
            studentName: user?.displayName,
            studentEmail: user?.email,
            tutorName: application.tutorName,
            tutorEmail: application.tutorEmail,
            tuitionTitle: application.tuitionTitle,
            subject: application.subject,
            applicationId: application._id,
            type: "tutor_hiring",
            createdAt: new Date(),
          },
          { withCredentials: true },
        );

        // Approve the application
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/applications/${application._id}/approve`,
          {},
          { withCredentials: true },
        );

        // Clear sessionStorage
        sessionStorage.removeItem("pendingApplication");

        setSucceeded(true);
        setProcessing(false);

        toast.success("Payment successful! Tutor hired.");

        setTimeout(() => {
          navigate("/dashboard/student/applied-tutors");
        }, 2000);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-black text-gray-900">
            Complete Payment
          </h2>
          <p className="text-gray-500 mt-1">Secure payment powered by Stripe</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tutor</span>
              <span className="font-semibold">{application.tutorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tuition</span>
              <span className="font-semibold">{application.tuitionTitle}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-black text-purple-600">
                ৳{amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Details
              </label>
              <div className="p-4 border border-gray-200 rounded-xl">
                <CardElement options={cardStyle} />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || !stripe || succeeded}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                processing || !stripe || succeeded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-purple-600 to-blue-600 hover:opacity-90"
              }`}
            >
              {processing
                ? "Processing..."
                : succeeded
                  ? "Payment Successful!"
                  : `Pay ৳${amount.toLocaleString()}`}
            </button>
          </form>

          {/* Test Card Info */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              Test Card (Development Mode):
            </p>
            <p className="text-xs text-yellow-700">
              Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3
              digits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentCheckout;
