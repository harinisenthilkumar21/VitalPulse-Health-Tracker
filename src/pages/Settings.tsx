import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Shield,
  User as UserIcon,
  Check,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { User } from "../types";
import axios from "axios";

interface SettingsProps {
  user: User;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  user,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  const darkMode = theme === "dark";

  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onLogout();
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
  <div className="max-w-4xl mx-auto space-y-8 pb-12">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Settings
      </h1>
      <p className="text-slate-500 mt-1">
        Manage your account preferences and application settings.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      

      {/* Settings Content */}
      <div className="md:col-span-2 space-y-6">
        
        

       

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm">
          <h3 className="text-lg font-bold text-rose-600 mb-6 flex items-center gap-2">
            <AlertTriangle size={20} />
            Danger Zone
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Delete Account</p>
              <p className="text-sm text-slate-500">
                Permanently remove your account and all your data.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-200 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Profile
            </button>
          </div>
        </div>

        {/* Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
                Delete Account?
              </h3>

              <p className="text-slate-500 text-center mb-8">
                This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 shadow-md flex items-center gap-2"
          >
            {saveSuccess ? (
              <>
                <Check size={18} /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default Settings;
