import { useEffect, useState } from "react";
import { useCompanySheetStore } from "../store/UseCompanySheetStore";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Building2, Search, Plus, Eye, Edit, Trash2, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

const EditSheetPage = () => {
  const { 
    isSheetsLoading, 
    companySheets, 
    createCompanySheet, 
    getCompanySheets, 
    premiumSheets, 
    getPremiumCompanySheets,
    updateCompanySheet,
    deleteCompanySheet
  } = useCompanySheetStore();

  const [activeTab, setActiveTab] = useState("view");
  const [editingSheet, setEditingSheet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPremiumCompanySheets();
    getCompanySheets();
  }, [getPremiumCompanySheets, getCompanySheets]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      color: "#3B82F6",
      isPremium: false,
      requiredPlan: "BASIC",
    },
  });

  // Auto-generate slug from name
  const watchName = watch("name");
  useEffect(() => {
    if (watchName && !editingSheet) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchName, setValue, editingSheet]);

  const onSubmit = async (data) => {
    try {
      if (editingSheet) {
        await updateCompanySheet(editingSheet.id, data);
        toast.success("Sheet updated successfully!");
        setEditingSheet(null);
      } else {
        await createCompanySheet(data);
        toast.success("Sheet created successfully!");
      }
      reset();
      setActiveTab("view");
    } catch (error) {
      toast.error("Failed to save sheet");
    }
  };

  const handleEdit = (sheet) => {
    setEditingSheet(sheet);
    setValue("name", sheet.name);
    setValue("description", sheet.description || "");
    setValue("slug", sheet.slug);
    setValue("color", sheet.color);
    setValue("isPremium", sheet.isPremium || false);
    setValue("requiredPlan", sheet.requiredPlan || "BASIC");
    setActiveTab("create");
  };

  const handleDelete = async (sheetId) => {
    if (window.confirm("Are you sure you want to delete this sheet?")) {
      try {
        await deleteCompanySheet(sheetId);
        toast.success("Sheet deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete sheet");
      }
    }
  };

  const cancelEdit = () => {
    setEditingSheet(null);
    reset();
    setActiveTab("view");
  };

  const filteredSheets = premiumSheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sheet.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="w-full p-5 mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard" className="btn btn-ghost btn-circle">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-base-content">
                  Company Sheets Manager
                </h1>
                <p className="text-base-content/70">Manage and organize company-specific problem sheets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-base-200 rounded-lg shadow-sm border border-base-300 mb-6">
          <div className="tabs tabs-boxed w-full justify-start p-2">
            <button
              onClick={() => setActiveTab("view")}
              className={`tab gap-2 ${
                activeTab === "view" ? "tab-active" : ""
              }`}
            >
              <Eye className="w-4 h-4" />
              View Sheets ({premiumSheets.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("create");
                if (editingSheet) cancelEdit();
              }}
              className={`tab gap-2 ${
                activeTab === "create" ? "tab-active" : ""
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingSheet ? "Edit Sheet" : "Create New Sheet"}
            </button>
          </div>
        </div>

        {/* View Sheets Tab */}
        {activeTab === "view" && (
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="form-control">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    <input
                      type="text"
                      placeholder="Search sheets by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100"
                    />
                  </div>
                </div>
              </div>

              {/* Sheets Grid */}
              {isSheetsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : filteredSheets.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-base-content mb-2">No sheets found</h3>
                  <p className="text-base-content/70 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first company sheet"}
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="btn btn-primary gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Sheet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="card bg-base-200 border border-base-300 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                      style={{ borderLeft: `4px solid ${sheet.color}` }}
                    >
                      <div className="card-body p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-base-content truncate">{sheet.name}</h3>
                            <p className="text-sm text-base-content/50">/{sheet.slug}</p>
                          </div>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                              <li>
                                <button onClick={() => handleEdit(sheet)} className="gap-2">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button onClick={() => handleDelete(sheet.id)} className="gap-2 text-error">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
                          {sheet.description || "No description provided"}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: sheet.color }}
                            ></span>
                            <span className="text-xs text-base-content/50">{sheet.color}</span>
                          </div>
                          <div className="flex gap-2">
                            {sheet.isPremium && (
                              <div className="badge badge-warning gap-1">
                                Premium
                              </div>
                            )}
                            <div className="badge badge-primary">
                              {sheet.requiredPlan || "BASIC"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create/Edit Sheet Tab */}
        {activeTab === "create" && (
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-8">
              {/* Header with better styling */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-4 border-b border-base-300">
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-2">
                    {editingSheet ? "Edit Company Sheet" : "Create New Company Sheet"}
                  </h2>
                  <p className="text-base-content/70">
                    {editingSheet 
                      ? "Update the company sheet information below" 
                      : "Fill out the form to create a new company problem sheet"
                    }
                  </p>
                </div>
                {editingSheet && (
                  <button
                    onClick={cancelEdit}
                    className="btn btn-outline btn-sm mt-4 sm:mt-0"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-base-content">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-base-content">Company Name</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <input
                        className={`input input-bordered bg-base-200 focus:bg-base-100 transition-colors ${
                          errors.name ? 'input-error focus:input-error' : 'focus:input-primary'
                        }`}
                        {...register("name", { 
                          required: "Company name is required",
                          minLength: {
                            value: 2,
                            message: "Company name must be at least 2 characters"
                          },
                          maxLength: {
                            value: 50,
                            message: "Company name cannot exceed 50 characters"
                          }
                        })}
                        placeholder="e.g., Google, Microsoft, Amazon"
                      />
                      {errors.name && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* URL Slug */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-base-content">URL Slug</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className={`input input-bordered bg-base-200 focus:bg-base-100 transition-colors pr-12 ${
                            errors.slug ? 'input-error focus:input-error' : 'focus:input-primary'
                          }`}
                          {...register("slug", { 
                            required: "Slug is required",
                            pattern: {
                              value: /^[a-z0-9-]+$/,
                              message: "Slug can only contain lowercase letters, numbers, and hyphens"
                            }
                          })}
                          placeholder="auto-generated from name"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <kbd className="kbd kbd-xs">/sheets/</kbd>
                        </div>
                      </div>
                      {errors.slug && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.slug.message}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Description</span>
                      <span className="label-text-alt text-base-content/70">Optional</span>
                    </label>
                    <textarea
                      rows={4}
                      className="textarea textarea-bordered bg-base-200 focus:bg-base-100 focus:textarea-primary transition-colors resize-none"
                      {...register("description", {
                        maxLength: {
                          value: 200,
                          message: "Description cannot exceed 200 characters"
                        }
                      })}
                      placeholder="Brief description of the company and its problem set focus areas..."
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/70">
                        {watch("description")?.length || 0}/200 characters
                      </span>
                    </label>
                    {errors.description && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.description.message}</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Configuration Section */}
                <div className="divider">
                  <span className="text-base-content/50">Configuration</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Theme Color */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Theme Color</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          className={`w-16 h-16 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                            errors.color ? 'border-error' : 'border-base-300 hover:border-primary'
                          }`}
                          {...register("color", { required: "Color is required" })}
                        />
                        <div>
                          <p className="text-sm font-medium text-base-content">Brand Color</p>
                          <p className="text-xs text-base-content/70">
                            Current: {watch("color")?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      {/* Color Presets */}
                      <div className="flex gap-2">
                        <span className="text-xs text-base-content/50">Presets:</span>
                        {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded-full border-2 border-base-300 hover:border-primary transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => setValue("color", color)}
                          />
                        ))}
                      </div>
                    </div>
                    {errors.color && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.color.message}</span>
                      </label>
                    )}
                  </div>

                  {/* Required Plan */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Required Plan</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <select
                      className={`select select-bordered bg-base-200 focus:bg-base-100 transition-colors ${
                        errors.requiredPlan ? 'select-error focus:select-error' : 'focus:select-primary'
                      }`}
                      {...register("requiredPlan", { required: "Plan selection is required" })}
                    >
                      <option value="">Select a plan</option>
                      <option value="BASIC">Basic Plan - $9.99/month</option>
                      <option value="PREMIUM">Premium Plan - $19.99/month</option>
                    </select>
                    {errors.requiredPlan && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.requiredPlan.message}</span>
                      </label>
                    )}
                  </div>

                  {/* Premium Features */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Premium Features</span>
                    </label>
                    <div className="card bg-base-200 p-4">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          {...register("isPremium")}
                        />
                        <div>
                          <span className="label-text font-medium">Mark as Premium</span>
                          <p className="text-xs text-base-content/70 mt-1">
                            Enable advanced features and analytics
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                {(watch("name") || watch("description")) && (
                  <>
                    <div className="divider">
                      <span className="text-base-content/50">Preview</span>
                    </div>
                    <div className="alert alert-info">
                      <svg className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <h3 className="font-bold">Sheet Preview</h3>
                        <div className="text-xs">
                          <p><strong>Name:</strong> {watch("name") || "Company Name"}</p>
                          <p><strong>Slug:</strong> /sheets/{watch("slug") || "company-slug"}</p>
                          <p><strong>Description:</strong> {watch("description") || "No description"}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-base-300 gap-4">
                  <div className="text-sm text-base-content/70">
                    {editingSheet ? "Update the sheet information" : "Create a new company sheet"}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="btn btn-ghost"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isSheetsLoading}
                      className={`btn gap-2 ${editingSheet ? 'btn-warning' : 'btn-primary'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          {editingSheet ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingSheet ? "Update Sheet" : "Create Sheet"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSheetPage;