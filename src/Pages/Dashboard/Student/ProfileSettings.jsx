// ─── ProfileSettings.jsx ──────────────────────────────────────────────────────
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import auth from "../../../firebase/firebase.config";

const inputCls =
  "w-full mt-1 p-3 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500";

export const ProfileSettings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || "");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const newName = form.name.value;
      let photoURL = user?.photoURL;
      if (photoFile) {
        toast.info("Uploading photo...");
        const formData = new FormData();
        formData.append("image", photoFile);
        const imgResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        photoURL = imgResponse.data.data.display_url;
      }
      await updateProfile(auth.currentUser, { displayName: newName, photoURL });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        { name: newName, photoURL },
        { withCredentials: true },
      );
      setUser({ ...user, displayName: newName, photoURL });
      toast.success("Profile updated successfully!");
      setPhotoFile(null);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-elevated)] rounded-2xl p-8 max-w-4xl border border-[var(--bg-border)] shadow-sm">
      <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">
        Account Settings
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="text-center">
            <img
              src={
                photoPreview ||
                user?.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`
              }
              className="w-32 h-32 rounded-3xl object-cover ring-4 ring-purple-200 dark:ring-purple-900/50 mx-auto"
              alt="Profile"
            />
            <label
              htmlFor="photo-upload"
              className="mt-4 inline-block text-sm font-bold text-purple-600 hover:underline cursor-pointer"
            >
              Change Photo
            </label>
            <input
              id="photo-upload"
              type="file"
              name="photoUrl"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoFile && (
              <p className="text-xs text-green-600 mt-2">
                ✓ New photo selected
              </p>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                  Full Name
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
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className={`${inputCls} cursor-not-allowed opacity-60`}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
