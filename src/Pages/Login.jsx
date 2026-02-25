import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthProvider";
import MyContainer from "../components/MyContainer";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";


const Login = () => {
  const { setUser, signIn, signInWithGoogle, setRole } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const pass = event.target.password.value;
    try {
      const userCredential = await signIn(email, pass);
      const user = userCredential.user;
      setUser(user);
      const roleResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/role/${email}`,
      );
      const userRole = roleResponse.data.role || "student";
      setRole(userRole);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email },
        { withCredentials: true },
      );
      toast.success("Login successful! Welcome back!");
      event.target.reset();
      navigate(`/dashboard/${userRole}`);
    } catch (err) {
      const msg = err.message;
      if (msg.includes("user-not-found"))
        toast.error("No account found with this email");
      else if (msg.includes("wrong-password"))
        toast.error("Incorrect password");
      else if (msg.includes("invalid-credential"))
        toast.error("Invalid email or password");
      else toast.error("Login failed. Please try again");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        phone: "",
        role: "student",
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
        uid: result.user.uid,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData,
      );
      const userRole = response.data.role || "student";
      setUser(result.user);
      setRole(userRole);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email: result.user.email },
        { withCredentials: true },
      );
      toast.success("Successfully signed in with Google!");
      navigate(`/dashboard/${userRole}`);
    } catch {
      toast.error("Google sign-in failed. Please try again");
    }
  };

  const inputCls =
    "w-full px-6 py-4 rounded-full outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all";

  return (
    <div className="py-20 bg-[var(--bg-base)]">
      <MyContainer>
        <div className="max-w-150 mx-auto px-4">
          <div className="hero-content flex-col">
            <h1 className="text-4xl 2xl:text-5xl font-bold font-serif mb-10 text-[var(--text-primary)]">
              Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-6 w-full">
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">
                    Email address <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username or email address..."
                  className={inputCls}
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">
                    Password <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password..."
                    className={`${inputCls} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {show ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Remember me
                  </span>
                </label>
                <button
                  onClick={() => navigate(`/forgot-password/${email}`)}
                  type="button"
                  className="btn btn-ghost text-sm text-[var(--text-secondary)] underline underline-offset-4 decoration-dotted"
                >
                  Lost your password?
                </button>
              </div>
              <div className="w-full flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Don't have an account?
                </span>
                <Link
                  to="/signup"
                  className="text-sm text-purple-600 underline underline-offset-4 decoration-dotted"
                >
                  Register
                </Link>
              </div>
              <button
                type="submit"
                className="btn w-full py-5 bg-gradient-to-br from-[#6b46c1] to-[#9f62f2] text-white font-bold uppercase tracking-[0.2em] text-sm rounded-full transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg mt-4"
              >
                Log In
              </button>
              <div className="divider my-8 w-full text-[var(--text-muted)]">
                OR
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn w-full py-4 bg-[var(--bg-elevated)] border-2 border-[var(--bg-border-strong)] rounded-full flex items-center justify-center gap-3 hover:bg-[var(--bg-muted)] transition-all duration-300 font-semibold text-[var(--text-secondary)]"
              >
                <FcGoogle size={24} />
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Login;
