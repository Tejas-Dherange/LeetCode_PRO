import { useState, useEffect } from "react";
import { X, Search, Plus, Link as LinkIcon, FileText, Hash } from "lucide-react";
import { usePatternStore } from "../store/usePatternStore";
import { useProblemStore } from "../store/useProblemStore";

const AddProblemToPatternModal = ({ patternId, initialOrder, onClose }) => {
  const { addProblemToPattern } = usePatternStore();
  const { problems, getAllProblems } = useProblemStore();
  
  const [selectedProblem, setSelectedProblem] = useState("");
  const [order, setOrder] = useState(initialOrder || 0);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problems.length === 0) {
      getAllProblems();
    }
  }, []);

  useEffect(() => {
    if (initialOrder !== undefined) {
      setOrder(initialOrder);
    }
  }, [initialOrder]);

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProblem) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await addProblemToPattern(patternId, {
      problemId: selectedProblem,
      order: parseInt(order) || 0,
      link: link || null,
      notes: notes || null,
    });

    setIsSubmitting(false);
    
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-base-200">
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-100">
          <div>
            <h3 className="text-2xl font-bold text-base-content">Add Problem</h3>
            <p className="text-sm text-base-content/60 mt-1">Select a problem to add to this pattern</p>
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
            {/* Search and Select Problem */}
            <div className="form-control">
              <label className="label px-0">
                <span className="label-text font-bold flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  Select Problem <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by problem title..."
                  className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="border border-base-300 rounded-lg overflow-hidden">
                <select
                  className="select select-bordered w-full h-48 focus:outline-none border-none"
                  value={selectedProblem}
                  onChange={(e) => setSelectedProblem(e.target.value)}
                  required
                  size={8}
                >
                  <option value="" disabled className="text-base-content/40 py-2">-- Select a problem from the list --</option>
                  {filteredProblems.map((problem) => (
                    <option key={problem.id} value={problem.id} className="py-2 px-2 hover:bg-base-200 cursor-pointer border-b border-base-100 last:border-none">
                      {problem.title} • {problem.difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  {filteredProblems.length} problems found
                </span>
              </label>
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
                  placeholder="0"
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt">Position in the list (optional)</span>
                </label>
              </div>

              {/* External Link */}
              <div className="form-control">
                <label className="label px-0">
                  <span className="label-text font-bold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    External Link
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/..."
                  className="input input-bordered focus:border-primary focus:ring-1 focus:ring-primary"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt">Link to LeetCode or other resource (optional)</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="form-control">
              <label className="label px-0">
                <span className="label-text font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Notes
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Add any specific notes, hints, or instructions for this problem..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
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
                disabled={isSubmitting || !selectedProblem}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Problem
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

export default AddProblemToPatternModal;        