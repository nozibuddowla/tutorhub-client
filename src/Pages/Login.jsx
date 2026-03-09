import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../Provider/AuthProvider";
import MyContainer from "../components/MyContainer";
import axios from "axios";

// ── Demo accounts ─────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@tutorhub.com",
    password: "Admin123",
    color:
      "text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    icon: "🛡️",
  },
  {
    label: "Tutor",
    email: "tutor@tutorhub.com",
    password: "Tutor123",
    color:
      "text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700",
    icon: "👨‍🏫",
  },
  {
    label: "Student",
    email: "student@tutorhub.com",
    password: "Student123",
    color:
      "text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    icon: "🎓",
  },
];

const Login = () => {
  const { setUser, signIn, signInWithGoogle, setRole } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Auto-fill demo credentials ─────────────────────────────────────────────
  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    toast.info(`Demo ${account.label} credentials filled — click Log In`, {
      autoClose: 2500,
    });
  };

  // ── Email/password login ───────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const userCredential = await signIn(email, password);
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

      toast.success("Welcome back!");
      navigate(from || `/dashboard/${userRole}`);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("user-not-found"))
        toast.error("No account found with this email");
      else if (msg.includes("wrong-password"))
        toast.error("Incorrect password");
      else if (msg.includes("invalid-credential"))
        toast.error("Invalid email or password");
      else toast.error("Login failed. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Google login ───────────────────────────────────────────────────────────
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
      toast.success("Signed in with Google!");
      navigate(from || `/dashboard/${userRole}`);
    } catch {
      toast.error("Google sign-in failed. Please try again");
    }
  };

  const inputCls =
    "w-full px-5 py-3.5 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all text-sm";

  return (
    <div className="min-h-screen py-16 bg-[var(--bg-base)]">
      <MyContainer>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg">
              T
            </div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">
              Welcome back
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Sign in to your TutorHub account
            </p>
          </div>

          {/* Demo Login Buttons */}
          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-4 mb-6">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 text-center">
              🧪 Try a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border font-semibold text-xs transition-all hover:scale-105 hover:shadow-sm ${acc.color}`}
                >
                  <span className="text-xl">{acc.icon}</span>
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center mt-2.5">
              Click a role to auto-fill credentials
            </p>
          </div>

          {/* Form */}
          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-6 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputCls} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {show ? <IoEye size={18} /> : <IoEyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate(`/forgot-password/${email}`)}
                  className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm"
              >
                {submitting ? "Signing in…" : "Log In"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[var(--bg-border-strong)]" />
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  OR
                </span>
                <div className="flex-1 h-px bg-[var(--bg-border-strong)]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 bg-[var(--bg-surface)] border border-[var(--bg-border-strong)] rounded-xl flex items-center justify-center gap-3 hover:bg-[var(--bg-muted)] transition-colors font-semibold text-sm text-[var(--text-secondary)]"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-[var(--text-muted)] mt-5">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Login;
