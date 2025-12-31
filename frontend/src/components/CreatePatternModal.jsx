import { useState, useEffect } from "react";
import { X, Type, Link as LinkIcon, FileText, Hash, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { usePatternStore } from "../store/usePatternStore";

const CreatePatternModal = ({ pattern, initialOrder, onClose }) => {
  const { createPattern, updatePattern } = usePatternStore();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    link: "",
    order: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pattern) {
      setFormData({
        name: pattern.name || "",
        slug: pattern.slug || "",
        description: pattern.description || "",
        link: pattern.link || "",
        order: pattern.order || 0,
        isActive: pattern.isActive !== undefined ? pattern.isActive : true,
      });
    } else if (initialOrder !== undefined) {
      setFormData((prev) => ({ ...prev, order: initialOrder }));
    }
  }, [pattern, initialOrder]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      order: parseInt(formData.order) || 0,
    };

    let result;
    if (pattern) {
      result = await updatePattern(pattern.id, payload);
    } else {
      result = await createPattern(payload);
    }

    setIsSubmitting(false);

    if (result) {
      onClose();
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !pattern ? generateSlug(name) : prev.slug, // Only auto-generate for new patterns
    }));
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-base-200">
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-100">
          <div>
            <h3 className="text-2xl font-bold text-base-content">
              {pattern ? "Edit Pattern" : "Create New Pattern"}
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              {pattern ? "Update existing pattern details" : "Define a new learning pattern"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-control">
                <label className="label px-0">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Pattern Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Two Pointers"
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                />
              </div>

              {/* Slug */}
              <div className="form-control">
                <label className="label px-0">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Slug <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. two-pointers"
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label px-0">
                <span className="label-text font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Description <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered h-24 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Describe the pattern and when to use it..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order */}
              <div className="form-control">
                <label className="label px-0">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Order
                  </span>
                </label>
                <input
                  type="number"
                  name="order"
                  placeholder="0"
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>

              {/* External Link */}
              <div className="form-control">
                <label className="label px-0">
                  <span className="label-text font-bold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    External Resource
                  </span>
                </label>
                <input
                  type="url"
                  name="link"
                  placeholder="https://..."
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4 px-0">
                <input
                  type="checkbox"
                  name="isActive"
                  className="toggle toggle-primary"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="label-text font-bold flex items-center gap-2">
                  {formData.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      Active (Visible to users)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-base-content/40" />
                      Inactive (Hidden)
                    </>
                  )}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="modal-action mt-8">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    {pattern ? "Update Pattern" : "Create Pattern"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePatternModal;       