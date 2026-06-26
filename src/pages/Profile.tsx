import React, { useState, useRef, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";
import axios from "axios";

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function resizeImageToDataUrl(
  file: File,
  maxDim: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function persistUserToStorage(u: User) {
  try {
    localStorage.setItem("user", JSON.stringify(u));
  } catch {
    /* localStorage quota — session still works in memory */
  }
}

async function imageFileToUploadableDataUrl(file: File): Promise<string> {
  try {
    return await resizeImageToDataUrl(file, 320, 0.78);
  } catch {
    const raw = await readFileAsDataUrl(file);
    if (!raw.startsWith("data:image/")) {
      throw new Error(
        "This image format is not supported in your browser. Try JPG or PNG.",
      );
    }
    if (raw.length > 6_000_000) {
      throw new Error("Image is too large. Please choose a smaller file.");
    }
    return raw;
  }
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    contact: user.contact,
    emergency_contact: user.emergency_contact,
    avatar_url: user.avatar_url ?? "",
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      contact: user.contact,
      emergency_contact: user.emergency_contact,
      avatar_url: user.avatar_url ?? "",
    });
  }, [
    user.id,
    user.name,
    user.email,
    user.age,
    user.gender,
    user.height,
    user.weight,
    user.contact,
    user.emergency_contact,
    user.avatar_url ?? "",
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/profile/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      persistUserToStorage(response.data.user);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await imageFileToUploadableDataUrl(file);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/profile/${user.id}`,
        { ...formData, avatar_url: dataUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const nextUser = response.data.user as User;
      setUser(nextUser);
      persistUserToStorage(nextUser);
      const savedAvatar = nextUser.avatar_url ?? dataUrl;
      setFormData((prev) => ({ ...prev, avatar_url: savedAvatar }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      setError(
        status === 413
          ? "Image is too large for the server. Try a smaller image."
          : msg ||
              err.message ||
              "Failed to update photo",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/profile/${user.id}`,
        { ...formData, avatar_url: null },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser(response.data.user);
      persistUserToStorage(response.data.user);
      setFormData((prev) => ({ ...prev, avatar_url: "" }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove photo");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/profile/change-password`,
        {
          userId: user.id,
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPasswordSuccess(true);
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setPasswordSuccess(false);
        setPasswordModalOpen(false);
      }, 2000);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (err.code === "ERR_NETWORK"
          ? "Cannot reach server. Is the backend running on port 5000?"
          : null);
      setPasswordError(msg || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const displayAvatar =
    formData.avatar_url || user.avatar_url || "";

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFile}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal information and health preferences.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 text-4xl font-bold border-4 border-white shadow-lg overflow-hidden">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              
            </div>
            {displayAvatar ? (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={loading}
                className="mt-3 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors disabled:opacity-50"
              >
                Remove photo
              </button>
            ) : null}
            <h2 className="text-xl font-bold text-slate-900 mt-6">
              {user.name}
            </h2>
            <p className="text-slate-500 text-sm">Member since 2026</p>

            
          </div>

          
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Emergency Contact Info
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: user.name,
                  email: user.email,
                  age: user.age,
                  gender: user.gender,
                  height: user.height,
                  weight: user.weight,
                  contact: user.contact,
                  emergency_contact: user.emergency_contact,
                  avatar_url: user.avatar_url ?? "",
                })
              }
              className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-12 py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {passwordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !passwordLoading && setPasswordModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Change password
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your current password and choose a new one.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={passwordLoading}
                  onClick={() => setPasswordModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
                  Password updated successfully.
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={passwordFields.currentPassword}
                    onChange={(e) =>
                      setPasswordFields((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={passwordFields.newPassword}
                    onChange={(e) =>
                      setPasswordFields((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={passwordFields.confirmPassword}
                    onChange={(e) =>
                      setPasswordFields((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={passwordLoading}
                    onClick={() => setPasswordModalOpen(false)}
                    className="flex-1 py-3 font-bold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading || passwordSuccess}
                    className="flex-1 py-3 font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Update password"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-sky-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">Profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
