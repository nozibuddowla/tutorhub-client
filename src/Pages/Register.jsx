import React, { useContext, useState } from "react";
import MyContainer from "../components/MyContainer";
import { Link, useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";

// ── Password rules ────────────────────────────────────────────────────────────
const validatePassword = (password) => {
  if (!/[A-Z]/.test(password))
    return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Must contain at least one lowercase letter";
  if (password.length < 6) return "Must be at least 6 characters";
  return "";
};

// ── Strength indicator ─────────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    password.length >= 6,
    /[0-9]/.test(password),
    password.length >= 10,
  ];
  const score = checks.filter(Boolean).length;
  const levels = [
    { label: "Very Weak", color: "bg-red-6000", w: "w-1/5" },
    { label: "Weak", color: "bg-orange-500", w: "w-2/5" },
    { label: "Fair", color: "bg-yellow-500", w: "w-3/5" },
    { label: "Strong", color: "bg-teal-500", w: "w-4/5" },
    { label: "Very Strong", color: "bg-green-500", w: "w-full" },
  ];
  const lvl = levels[Math.max(0, score - 1)];
  return (
    <div className="mt-2">
      <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${lvl.color} ${lvl.w}`}
        />
      </div>
      <p
        className={`text-xs mt-1 font-medium ${lvl.color.replace("bg-", "text-")}`}
      >
        {lvl.label}
      </p>
    </div>
  );
};

const Register = () => {
  const { setUser, createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const email = e.target.email.value;
    const pass = e.target.password.value;
    const phone = e.target.phone.value;
    const role = e.target.role.value;
    const name = e.target.username.value;
    const file = e.target.photoUrl.files[0];

    const validationError = validatePassword(pass);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }
    if (!file) {
      toast.error("Please upload a profile photo");
      return;
    }
    setPasswordError("");
    setSubmitting(true);

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", file);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const photoURL = imgRes.data.data.display_url;

      // Firebase
      const userCredential = await createUser(email, pass);
      await updateProfile(auth.currentUser, { displayName: name, photoURL });

      // MongoDB
      const userData = {
        name,
        email,
        phone,
        role,
        photoURL,
        createdAt: new Date().toISOString(),
        uid: userCredential.user.uid,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData,
      );

      if (response.data.success) {
        setUser({ ...userCredential.user, displayName: name, photoURL });
        toast.success("Registration successful! Welcome to TutorHub!");
        e.target.reset();
        setPhotoPreview(null);
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        toast.error("This email is already registered");
      else if (error.code === "auth/invalid-email")
        toast.error("Invalid email address");
      else if (error.code === "auth/weak-password")
        toast.error("Password is too weak");
      else if (error.response)
        toast.error(error.response.data.message || "Registration failed");
      else
        toast.error(error.message || "Registration failed. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);
      setUser(result.user);
      toast.success("Signed in with Google!");
      navigate("/");
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
              Create account
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Join TutorHub as a student or tutor
            </p>
          </div>

          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Your full name"
                  className={inputCls}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
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
                    placeholder="Create a strong password"
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
                <PasswordStrength password={password} />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  I am a… <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["student", "tutor"].map((r) => (
                    <label key={r} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        className="peer sr-only"
                        required
                      />
                      <div
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 border-[var(--bg-border-strong)] text-[var(--text-secondary)] text-sm font-semibold text-center
                        peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 peer-checked:text-purple-700 dark:peer-checked:text-purple-300
                        hover:border-purple-300 transition-all"
                      >
                        <span className="text-2xl">
                          {r === "student" ? "🎓" : "👨‍🏫"}
                        </span>
                        <span className="capitalize">{r}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+880 1XXX-XXXXXX"
                  className={inputCls}
                  required
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1.5">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-purple-200 shrink-0"
                    />
                  )}
                  <input
                    type="file"
                    name="photoUrl"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="flex-1 text-sm text-[var(--text-muted)]
                      file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                      file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700
                      dark:file:bg-purple-900/40 dark:file:text-purple-300
                      hover:file:bg-purple-200 dark:hover:file:bg-purple-900/60 file:transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm mt-2"
              >
                {submitting ? "Creating account…" : "Create Account"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--bg-border-strong)]" />
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  OR
                </span>
                <div className="flex-1 h-px bg-[var(--bg-border-strong)]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full py-3 bg-[var(--bg-surface)] border border-[var(--bg-border-strong)] rounded-xl flex items-center justify-center gap-3 hover:bg-[var(--bg-muted)] transition-colors font-semibold text-sm text-[var(--text-secondary)]"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>
            </form>

            <p className="text-center text-sm text-[var(--text-muted)] mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Register;
