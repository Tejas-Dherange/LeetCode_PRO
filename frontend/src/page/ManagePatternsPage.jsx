import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatternStore } from "../store/usePatternStore";
import useAuthStore from "../store/useAuthStore";
import { Plus, Edit, Trash2, Eye, Loader, ArrowLeft, CheckCircle, XCircle, Search, BookOpen } from "lucide-react";
import CreatePatternModal from "../components/CreatePatternModal";
import { motion } from "framer-motion";

const ManagePatternsPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { patterns, isLoading, getAllPatterns, deletePattern, updatePattern } =
    usePatternStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPattern, setEditingPattern] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authUser?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    getAllPatterns();
  }, [authUser]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pattern?")) {
      await deletePattern(id);
    }
  };

  const handleToggleActive = async (pattern) => {
    await updatePattern(pattern.id, { isActive: !pattern.isActive });
  };

  const filteredPatterns = patterns.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextOrder = patterns.length > 0 
    ? Math.max(...patterns.map(p => p.order || 0)) + 1 
    : 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-300">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden font-sans text-base-content selection:bg-primary/20">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-secondary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="btn btn-ghost btn-sm gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Manage Patterns
            </h1>
            <p className="text-base-content/70 mt-1">
              Create, edit, and organize learning patterns
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input 
                type="text" 
                placeholder="Search patterns..." 
                className="input input-bordered w-full pl-10 bg-base-100/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Pattern</span>
            </button>
          </div>
        </motion.div>

        {/* Patterns Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100/40 backdrop-blur-md shadow-xl border border-base-content/5 overflow-hidden"
        >
          <div className="card-body p-0">
            {filteredPatterns.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-base-content/40" />
                </div>
                <h3 className="text-xl font-bold text-base-content">No patterns found</h3>
                <p className="text-base-content/60 mt-2 max-w-md">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first learning pattern"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary mt-6"
                  >
                    <Plus className="w-5 h-5" />
                    Create Pattern
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="pl-6 py-4">Pattern</th>
                      <th>Slug</th>
                      <th>Problems</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th className="pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-content/5">
                    {filteredPatterns.map((pattern) => (
                      <tr key={pattern.id} className="hover:bg-base-200/30 transition-colors">
                        <td className="pl-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center shadow-sm border border-emerald-500/20">
                              <BookOpen className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-bold text-base-content">{pattern.name}</div>
                              <div className="text-xs text-base-content/50 line-clamp-1 max-w-[200px]">
                                {pattern.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="font-mono text-xs text-primary">
                          {pattern.slug}
                        </td>
                        <td>
                          <div className="badge badge-ghost gap-1">
                            {pattern.totalProblems || 0}
                          </div>
                        </td>
                        <td className="font-mono text-sm text-base-content/70">
                          #{pattern.order}
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleActive(pattern)}
                            className={`badge gap-1 cursor-pointer transition-all hover:scale-105 ${
                              pattern.isActive 
                                ? "badge-success text-success-content" 
                                : "badge-ghost text-base-content/50"
                            }`}
                          >
                            {pattern.isActive ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {pattern.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="pr-6 text-right">
                          <div className="flex justify-end gap-1">
                            <div className="tooltip tooltip-left" data-tip="View Details">
                              <button
                                onClick={() => navigate(`/patterns/${pattern.slug}`)}
                                className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="tooltip tooltip-left" data-tip="Edit Pattern">
                              <button
                                onClick={() => setEditingPattern(pattern)}
                                className="btn btn-ghost btn-sm btn-square hover:bg-warning/10 hover:text-warning"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="tooltip tooltip-left" data-tip="Delete Pattern">
                              <button
                                onClick={() => handleDelete(pattern.id)}
                                className="btn btn-ghost btn-sm btn-square hover:bg-error/10 hover:text-error"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPattern) && (
        <CreatePatternModal
          pattern={editingPattern}
          initialOrder={nextOrder}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPattern(null);
          }}
        />
      )}
    </div>
  );
};

export default ManagePatternsPage;
