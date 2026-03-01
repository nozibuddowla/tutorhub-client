import React, { useContext, useState } from "react";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const application =
    location.state?.application ||
    JSON.parse(sessionStorage.getItem("pendingApplication") || "{}");
  const amount = application.expectedSalary || 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { amount, currency: "bdt" },
        { withCredentials: true },
      );
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Anonymous",
              email: user?.email,
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
        await axios.post(
          `${import.meta.env.VITE_API_URL}/payments`,
          {
            amount,
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
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/applications/${application._id}/approve`,
          {},
          { withCredentials: true },
        );
        sessionStorage.removeItem("pendingApplication");
        setSucceeded(true);
        setProcessing(false);
        toast.success("Payment successful! Tutor hired.");
        setTimeout(() => navigate("/dashboard/student/applied-tutors"), 2000);
      }
    } catch {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] py-12 px-2">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            Complete Payment
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">
            Payment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Tutor</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {application.tutorName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Tuition</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {application.tuitionTitle}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--bg-border)]">
              <span className="text-lg font-bold text-[var(--text-primary)]">
                Total Amount
              </span>
              <span className="text-2xl font-black text-purple-600">
                ৳{amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Card Details
              </label>
              <div className="p-4 border border-[var(--bg-border-strong)] rounded-xl bg-[var(--bg-muted)]">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: "#a8a5c0",
                        fontFamily: "Arial, sans-serif",
                        fontSmoothing: "antialiased",
                        fontSize: "16px",
                        "::placeholder": { color: "#6b6880" },
                      },
                      invalid: { color: "#fa755a", iconColor: "#fa755a" },
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={processing || !stripe || succeeded}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                processing || !stripe || succeeded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              }`}
            >
              {processing
                ? "Processing..."
                : succeeded
                  ? "Payment Successful!"
                  : `Pay ৳${amount.toLocaleString()}`}
            </button>
          </form>
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              Test Card (Development Mode):
            </p>
            <p className="text-xs text-yellow-700 text-yellow-600 dark:text-yellow-400">
              Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3
              digits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentCheckout;
