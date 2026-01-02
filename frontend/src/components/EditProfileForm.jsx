import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User, Mail, Camera, Loader2, Check, AlertCircle, Info } from "lucide-react";

export default function EditProfileForm() {
  const { editProfile, authUser } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(authUser?.image || null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

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
        navigate("/dashboard/profile");
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-base-100/40 backdrop-blur-md rounded-2xl shadow-xl mb-6 p-6 md:p-8 border border-base-200 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="btn btn-ghost btn-sm gap-2 hover:bg-emerald-500/10 transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-base-content">Edit Profile</h1>
          </div>
          <p className="text-base-content/70 text-sm">Update your personal information and profile picture</p>
        </div>

        {/* Form */}
        <div className="bg-base-100/40 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-base-200 hover:border-emerald-500/50 transition-all duration-300">
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-emerald-500 ring-offset-base-100 ring-offset-4 shadow-2xl relative z-10 group-hover:ring-offset-8 transition-all duration-300">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full cursor-pointer transition-all duration-300 shadow-xl hover:scale-110 z-20"
                >
                  <Camera className="w-5 h-5" />
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
                <p className="text-sm text-base-content/70 font-medium">
                  Click the camera icon to upload a new profile picture
                </p>
                <p className="text-xs mt-1 text-base-content/50">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            <div className="divider divider-primary"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    Full Name
                  </span>
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
                  className={`input input-bordered w-full ${
                    errors.name ? "input-error" : "focus:input-primary"
                  } bg-base-200/50 backdrop-blur-sm transition-all`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    Email Address
                  </span>
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
                  className={`input input-bordered w-full ${
                    errors.email ? "input-error" : "focus:input-primary"
                  } bg-base-200/50 backdrop-blur-sm transition-all`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard/profile")}
                className="btn btn-outline flex-1 gap-2 hover:bg-base-200 transition-all"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                onClick={handleSubmit(onSubmit)}
                className={`btn flex-1 gap-2 shadow-lg hover:shadow-xl transition-all ${
                  isSuccess
                    ? "btn-success"
                    : "bg-emerald-600 hover:bg-emerald-500 border-none text-white"
                } ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating Profile...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    Profile Updated!
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mt-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Info className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-base-content mb-2">
                Profile Update Tips
              </h3>
              <ul className="text-sm text-base-content/70 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Use a clear, professional profile picture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Keep your contact information up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Changes may take a few minutes to reflect across the platform</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
