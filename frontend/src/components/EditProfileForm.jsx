
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";

export default function EditProfileForm() {
  const { editProfile } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    await editProfile(formData);
    reset();
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="input input-bordered w-full"
          placeholder="John Doe"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="input input-bordered w-full"
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1 font-medium">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
        />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 mt-2 rounded-full" />}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-full">
        Update Profile
      </button>
    </form>
  );
}
