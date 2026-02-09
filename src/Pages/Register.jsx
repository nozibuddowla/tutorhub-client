import React, { useContext, useState } from "react";
import MyContainer from "../components/MyContainer";
import { Link, useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";

const Register = () => {
  const { setUser, createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [show, setShow] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasMinLength) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const pass = event.target.password.value;
    const phone = event.target.phone.value;
    const role = event.target.role.value;
    const name = event.target.username.value;
    const photoUrl = event.target.photoUrl;
    const file = photoUrl.files[0];

    // console.log(file);

    // console.log(email, pass);

    // validate password
    const validationError = validatePassword(pass);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }

    setPasswordError("");

    try {
      // Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", file);

      const imgResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // console.log("Image uploaded:", imgResponse.data);

      const photoURL = imgResponse.data.data.display_url;

      // console.log("Creating user in Firebase...");

      // Create user in Firebase
      const userCredential = await createUser(email, pass);

      // console.log("User created in Firebase:", userCredential.user);

      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // console.log("Firebase profile updated");

      // Prepare user data for MongoDB
      const userData = {
        name,
        email,
        phone,
        role,
        photoURL,
        createdAt: new Date().toISOString(),
        uid: userCredential.user.uid,
      };

      // console.log("Saving to MongoDB:", userData);

      // Save user to MongoDB
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData,
      );

      // console.log("MongoDB response:", response.data);

      if (response.data.success) {
        setUser({
          ...userCredential.user,
          displayName: name,
          photoURL: photoURL,
        });

        toast.success("Registration successful! Welcome to TutorHub!");
        event.target.reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", error.response?.data);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else if (error.response) {
        // Server responded with error
        toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request made but no response
        toast.error("Server is not responding. Please check your connection.");
      } else {
        // Other errors
        toast.error(error.message || "Registration failed. Please try again");
      }
    }
  };

  // console.log(user);

  // Handle Google Sign in
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();

      // Save Google user to MongoDB
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        phone: "", // Google doesn't provide phone
        role: "student", // Default role for Google sign-in
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
        uid: result.user.uid,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);

      setUser(result.user);
      toast.success("Successfully signed in with Google!");
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again");
    }
  };

  return (
    <div className="py-20">
      <MyContainer>
        <div className="max-w-150 mx-auto px-4">
          <div className="hero-content flex-col">
            {/* Header */}
            <h1 className="text-4xl 2xl:text-5xl font-bold font-serif mb-10">
              Register
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    User Name <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username..."
                  className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Username/Email Field */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Email address <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address..."
                  className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Password <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password..."
                    className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/3"
                  >
                    {show ? <IoEye /> : <IoEyeOff />}{" "}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm mt-2 ml-4">
                    {passwordError}
                  </p>
                )}

                <p className="text-xs mt-2 ml-4">
                  Must contain: uppercase, lowercase letter, and minimum 6
                  characters
                </p>
              </div>

              {/* Role Selection */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Role <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="role"
                  className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                  required
                >
                  <option value="">Select your role...</option>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Phone Number <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number..."
                  className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Photo */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Photo <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="file"
                  name="photoUrl"
                  accept="image/*"
                  className="w-full px-6 py-4 border shadow-2xl rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  required
                />
              </div>

              <div className="w-full flex items-center gap-2">
                <span className="text-sm transition-colors">
                  Already have an account?
                </span>
                <Link
                  to="/login"
                  className="text-sm underline underline-offset-4 decoration-dotted transition-colors"
                >
                  Log In
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn w-full py-5 bg-linear-to-br from-[#632ee3] to-[#9f62f2]  text-white font-bold uppercase tracking-[0.2em] text-sm rounded-full transition-all duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg mt-4"
              >
                Register
              </button>

              {/* Divider */}
              <div className="divider my-8 w-full">OR</div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="btn w-full py-4 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Register;
