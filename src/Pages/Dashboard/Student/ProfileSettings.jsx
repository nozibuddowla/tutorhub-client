import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import auth from "../../../firebase/firebase.config";

const inputCls =
  "w-full mt-1 p-3 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm";

// ── Password strength ─────────────────────────────────────────────────────────
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
    {
      label: "Very Weak",
      color: "bg-red-500",
      text: "text-red-500",
      w: "w-1/5",
    },
    {
      label: "Weak",
      color: "bg-orange-500",
      text: "text-orange-500",
      w: "w-2/5",
    },
    {
      label: "Fair",
      color: "bg-yellow-500",
      text: "text-yellow-500",
      w: "w-3/5",
    },
    {
      label: "Strong",
      color: "bg-teal-500",
      text: "text-teal-500",
      w: "w-4/5",
    },
    {
      label: "Very Strong",
      color: "bg-green-500",
      text: "text-green-500",
      w: "w-full",
    },
  ];
  const lvl = levels[Math.max(0, score - 1)];
  return (
    <div className="mt-2">
      <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${lvl.color} ${lvl.w}`}
        />
      </div>
      <p className={`text-xs mt-1 font-medium ${lvl.text}`}>{lvl.label}</p>
    </div>
  );
};

const ProfileSettings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || "");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "password"

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ── Profile update ──────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const newName = e.target.name.value.trim();
      const newPhone = e.target.phone?.value?.trim() || "";
      let photoURL = user?.photoURL;

      if (photoFile) {
        toast.info("Uploading photo…");
        const formData = new FormData();
        formData.append("image", photoFile);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        photoURL = imgRes.data.data.display_url;
      }

      await updateProfile(auth.currentUser, { displayName: newName, photoURL });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        { name: newName, photoURL, phone: newPhone },
        { withCredentials: true },
      );
      setUser({ ...user, displayName: newName, photoURL });
      toast.success("Profile updated successfully!");
      setPhotoFile(null);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Password update ─────────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPass = e.target.newPassword.value;
    const confirmPass = e.target.confirmPassword.value;

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(newPass)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    setPasswordLoading(true);
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Update password
      await updatePassword(auth.currentUser, newPass);
      toast.success("Password updated successfully!");
      e.target.reset();
      setNewPassword("");
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const isGoogleUser = user?.providerData?.[0]?.providerId === "google.com";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                photoPreview ||
                user?.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`
              }
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-200 dark:ring-purple-900/50"
              alt="Profile"
            />
            <label
              htmlFor="photo-upload-header"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--color-primary)] rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition text-white text-sm shadow-md"
            >
              ✎
            </label>
            <input
              id="photo-upload-header"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            {photoFile && (
              <p className="text-xs text-green-600 mt-1 font-semibold">
                ✓ New photo ready — save to apply
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-2xl p-1.5 border border-[var(--bg-border)] shadow-sm">
        {[
          { key: "profile", label: "Profile Info", icon: "👤" },
          { key: "password", label: "Change Password", icon: "🔒" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-5">
            Edit Profile Information
          </h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={user?.displayName}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className={`${inputCls} cursor-not-allowed opacity-60`}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Profile Photo
                </label>
                <label
                  htmlFor="photo-upload-form"
                  className="flex items-center gap-3 mt-1 cursor-pointer px-3 py-2.5 rounded-xl border border-dashed border-[var(--bg-border-strong)] hover:border-purple-400 transition-colors bg-[var(--bg-muted)] text-sm text-[var(--text-secondary)]"
                >
                  <span>📷</span>
                  <span>{photoFile ? photoFile.name : "Choose new photo"}</span>
                </label>
                <input
                  id="photo-upload-form"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {profileLoading ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>
      )}

      {/* ── Password Tab ── */}
      {activeTab === "password" && (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-1">
            Change Password
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-5">
            You'll need your current password to set a new one.
          </p>

          {isGoogleUser ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-300">
              <p className="font-bold mb-1">⚠️ Google Account</p>
              <p>
                You signed in with Google. Password change is managed through
                your Google account settings.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    className={`${inputCls} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mt-0.5"
                  >
                    {showCurrent ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputCls} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mt-0.5"
                  >
                    {showNew ? "🙈" : "👁️"}
                  </button>
                </div>
                <PasswordStrength password={newPassword} />
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className={`${inputCls} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mt-0.5"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-[var(--bg-surface)] rounded-xl p-3 text-xs text-[var(--text-muted)] space-y-1">
                <p className="font-bold text-[var(--text-secondary)] mb-1">
                  Password requirements:
                </p>
                {[
                  ["At least 6 characters", newPassword.length >= 6],
                  ["One uppercase letter (A–Z)", /[A-Z]/.test(newPassword)],
                  ["One lowercase letter (a–z)", /[a-z]/.test(newPassword)],
                ].map(([text, met]) => (
                  <p
                    key={text}
                    className={met ? "text-green-600 dark:text-green-400" : ""}
                  >
                    {met ? "✓" : "○"} {text}
                  </p>
                ))}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {passwordLoading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
