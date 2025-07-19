import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User, Mail, Camera, Loader2, Check } from "lucide-react";

export default function EditProfileForm() {
  const { editProfile, authUser } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(authUser?.image || null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Detect theme from html[data-theme] attribute
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);

      // Only append image if it was changed
      if (isImageChanged && selectedFile) {
        formData.append("image", selectedFile);
      }

      await editProfile(formData);
      
      setIsSuccess(true);
      
      // Show success state briefly before navigating
      setTimeout(() => {
        reset();
        setSelectedFile(null);
        setPreview(null);
        setIsImageChanged(false);
        navigate("/profile");
      }, 1500);
      
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile && selectedFile.type && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setIsImageChanged(true);
    } else if (!selectedFile && authUser?.image) {
      setPreview(authUser.image);
      setIsImageChanged(false);
    } else {
      setPreview(null);
      setIsImageChanged(false);
    }
  }, [selectedFile, authUser?.image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setIsImageChanged(true);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "text-white bg-gradient-to-br from-base-300 to-base-100" : "text-gray-900 bg-gradient-to-br from-gray-100 to-white"} p-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? "bg-base-100" : "bg-white"} rounded-lg shadow-sm mb-6 p-6`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center cursor-pointer transition-colors ${isDark ? "hover:text-gray-400 text-white" : "hover:text-gray-700 text-gray-700"}`}
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className={`text-2xl font-bold ${isDark ? "text-gray-400" : "text-gray-700"}`}>Edit Profile</h1>
          </div>
          <p className={isDark ? "text-gray-100" : "text-gray-700"}>Update your personal information and profile picture</p>
        </div>

        {/* Form */}
        <div className={`${isDark ? "bg-base-100 text-white" : "bg-white text-gray-900"} rounded-lg shadow-sm p-6`}>
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDark ? "border-white" : "border-gray-300"} shadow-lg`}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? "text-gray-100" : "text-gray-400"}`}>
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className={`absolute bottom-2 right-2 ${isDark ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white"} p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg`}
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              
              <div className="text-center">
                <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                  Click the camera icon to upload a new profile picture
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-400"}`}>
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className={`flex items-center text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                  <User className={`w-4 h-4 mr-2 ${isDark ? "text-gray-100" : "text-gray-700"}`} />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.name ? "border-red-300" : isDark ? "border-gray-700" : "border-gray-300"} ${isDark ? "bg-base-200 text-white" : "bg-gray-50 text-gray-900"}`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠</span>
                    {errors.name.message}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label className={`flex items-center text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  <Mail className={`w-4 h-4 mr-2 ${isDark ? "text-gray-100" : "text-gray-700"}`} />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.email ? "border-red-300" : isDark ? "border-gray-700" : "border-gray-300"} ${isDark ? "bg-base-200 text-white" : "bg-gray-50 text-gray-900"}`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠</span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className={`flex-1 px-6 py-3 border rounded-lg cursor-pointer transition-colors disabled:opacity-50 ${isDark ? "border-gray-700 text-gray-100 bg-base-200 hover:bg-base-300" : "border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200"}`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                onClick={handleSubmit(onSubmit)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isSuccess
                    ? "bg-indigo-600 text-white"
                    : isDark
                    ? "bg-green-700 hover:bg-green-800 cursor-pointer text-white disabled:opacity-50"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer text-white disabled:opacity-50"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating Profile...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
                    Profile Updated!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Update Profile
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Additional Info */}
        <div className={`${isDark ? "bg-blue-900 border-blue-800" : "bg-blue-50 border-blue-200"} border rounded-lg p-4 mt-6`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-blue-400"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isDark ? "text-blue-200" : "text-blue-800"}`}>
                Profile Update Tips
              </h3>
              <div className={`mt-2 text-sm ${isDark ? "text-blue-100" : "text-blue-700"}`}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use a clear, professional profile picture</li>
                  <li>Keep your contact information up to date</li>
                  <li>Changes may take a few minutes to reflect across the platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
