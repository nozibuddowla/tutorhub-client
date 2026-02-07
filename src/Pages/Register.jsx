import React, { useContext, useState } from "react";
import MyContainer from "../components/MyContainer";
import { Link, useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthProvider";

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const pass = event.target.password.value;
    const name = event.target.username.value;
    const photoUrl = event.target.photoUrl.value;

    // console.log(email, pass);

    // validate password
    const validationError = validatePassword(pass);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }

    setPasswordError("");

    createUser(email, pass)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoUrl,
        })
          .then(() => {
            // console.log(userCredential.user);
            setUser({
              ...userCredential.user,
              displayName: name,
              photoURL: photoUrl,
            });
            toast.success("Registration successful! Welcome to Artrium!");
            event.target.reset();
            navigate("/");
          })
          .catch((error) => {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile");
          });
      })
      .catch((err) => {
        console.error("Registration error:", err);
        const errorMessage = err.message;

        if (errorMessage.includes("email-already-in-use")) {
          toast.error("This email is already registered");
        } else if (errorMessage.includes("invalid-email")) {
          toast.error("Invalid email address");
        } else if (errorMessage.includes("weak-password")) {
          toast.error("Password is too weak");
        } else {
          toast.error("Registration failed. Please try again");
        }
      });
  };

  // console.log(user);

  // Handle Google Sign in
  const handleGoogleSignUp = () => {
    signInWithGoogle()
      .then((result) => {
        setUser(result.user);
        toast.success("Successfully signed in with Google!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again");
      });
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

              {/* photo url */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold">
                    Photo <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="photoUrl"
                  placeholder="Enter your photoURL..."
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
