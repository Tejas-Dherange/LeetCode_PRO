import React, { useState, useMemo, useEffect, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { Link } from "react-router-dom";

import {
  Bookmark,
  PencilIcon,
  Trash,
  TrashIcon,
  Plus,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylistModal from "./AddToPlaylistModal";

const ProblemTable = ({ problems: initialProblems }) => {
  const { authUser } = useAuthStore();
  const { 
    problems, 
    pagination, 
    isLoadingMore, 
    loadMoreProblems, 
    updateFilters,
    filters,
    deleteProblem 
  } = useProblemStore();
  
  const [localProblems, setLocalProblems] = useState(problems);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");

  const [showPopup, setShowPopup] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { isLoading, createPlayList } = usePlaylistStore();
  
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const [showTagsPopup, setShowTagsPopup] = useState(null);
  const [showCompanyTagsPopup, setShowCompanyTagsPopup] = useState(null);

  // Ref for infinite scroll sentinel
  const sentinelRef = useRef(null);

  // Update local problems when store problems change
  useEffect(() => {
    setLocalProblems(problems);
  }, [problems]);

  // Get all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [problems]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When sentinel is visible and there's more data to load
        if (entries[0].isIntersecting && pagination.hasMore && !isLoadingMore) {
          loadMoreProblems();
        }
      },
      {
        root: null,
        rootMargin: "100px", // Start loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [pagination.hasMore, isLoadingMore, loadMoreProblems]);

  // Handle filter changes - debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== filters.search) {
        updateFilters({ search });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    updateFilters({ difficulty: newDifficulty === "ALL" ? "" : newDifficulty });
  };

  const handleTagChange = (newTag) => {
    setSelectedTag(newTag);
    updateFilters({ tag: newTag === "ALL" ? "" : newTag });
  };

  const handleDelete = (id) => {
    deleteProblem(id);
    setLocalProblems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToPlaylist = (id) => {
    setSelectedProblemId(id);
    setIsAddToPlaylistModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playListData = { name, description };
    if (name.length > 0) {
      await createPlayList(playListData);
      setShowPopup(false);
      setName("");
      setDescription("");
    }
  };

  const handleCloseModal = () => {
    setShowPopup(false);
    setName("");
    setDescription("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button
          className="btn btn-success text-white font-bold gap-2"
          onClick={() => setShowPopup(true)}
        >
          <Plus className="w-4 h-4 " />
          Create Playlist
        </button>
      </div>

      {showPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-base-200 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-base-300 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-base-content">Create New Playlist</h2>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Playlist Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Array Problems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full focus:input-primary"
                  required
                  autoFocus
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  placeholder="Describe your playlist..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered w-full h-24 focus:textarea-primary resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success text-white min-w-[100px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => handleTagChange(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option
              key={tag}
              value={tag}
              style={
                tag === "demo"
                  ? {
                      backgroundColor: '#6366f1',
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }
                  : {}
              }
            >
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination info */}
      <div className="mb-4 text-sm text-base-content/70">
        Showing {localProblems.length} of {pagination.total} problems
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Company</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localProblems.length > 0 ? (
              localProblems.map((problem) => {
                const isSolved = (problem.solvedBy || []).some(
                  (user) => user.userId === authUser?.id,
                );

                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1 items-center relative">
                        {(() => {
                          const validTags = (problem.tags || []).filter(
                            (tag) => tag && tag.trim(),
                          );
                          const showEllipsis = validTags.length > 2;
                          const displayTags = showEllipsis
                            ? validTags.slice(0, 2)
                            : validTags;
                          return (
                            <>
                              {displayTags.length > 0 ? (
                                displayTags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className={
                                      tag === "demo"
                                        ? "badge px-5 py-3 text-lg text-white bg-indigo-500 uppercase animate-pulse transition-all duration-300 ease-in-out"
                                        : "badge badge-outline badge-warning text-xs font-bold"
                                    }
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  -
                                </span>
                              )}
                              {showEllipsis && (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-xs px-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTagsPopup(
                                      showTagsPopup === problem.id ? null : problem.id,
                                    );
                                  }}
                                >
                                  <MoreHorizontal className="w-6 h-4 bg-amber-900 rounded-xl" />
                                </button>
                              )}
                            </>
                          );
                        })()}
                        {showTagsPopup === problem.id && (
                          <div
                            className="absolute left-0 z-50 bg-base-100 border rounded shadow-lg p-2 mt-2"
                            style={{ top: "100%", marginTop: 8 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {problem.tags
                                .filter((tag) => tag && tag.trim())
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className={
                                      tag === "demo"
                                        ? "badge px-5 py-3 text-lg text-white bg-indigo-500 uppercase animate-pulse transition-all duration-300 ease-in-out"
                                        : "badge badge-outline badge-warning text-xs font-bold"
                                    }
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                            <button
                              className="btn btn-xs btn-error mt-2 w-full"
                              onClick={() => setShowTagsPopup(null)}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1 items-center relative">
                        {(() => {
                          const validCompanyTags = (problem.companyTags || []).filter((tag) => tag && tag.trim());
                          const showEllipsis = validCompanyTags.length > 2;
                          const displayTags = showEllipsis ? validCompanyTags.slice(0, 2) : validCompanyTags;
                          return (
                            <>
                              {displayTags.length > 0 ? (
                                displayTags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="badge badge-primary text-xs font-bold"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">-</span>
                              )}
                              {showEllipsis && (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-xs px-1"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setShowCompanyTagsPopup(showCompanyTagsPopup === problem.id ? null : problem.id);
                                  }}
                                >
                                  <MoreHorizontal className="w-6 h-4 bg-amber-900 rounded-xl" />
                                </button>
                              )}
                            </>
                          );
                        })()}
                        {showCompanyTagsPopup === problem.id && (
                          <div
                            className="absolute left-0 z-50 bg-base-100 border rounded shadow-lg p-2 mt-2"
                            style={{ top: "100%", marginTop: 8 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {problem.companyTags
                                .filter((tag) => tag && tag.trim())
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="badge badge-info text-xs font-bold"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                            <button
                              className="btn btn-xs btn-error mt-2 w-full"
                              onClick={() => setShowCompanyTagsPopup(null)}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge font-semibold text-xs text-white ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            <button disabled className="btn btn-sm btn-warning">
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                        <button
                          className="btn btn-sm hover:bg-gray-400 flex gap-2 items-center"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll sentinel */}
      {pagination.hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isLoadingMore && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading more problems...</span>
            </div>
          )}
        </div>
      )}

      {/* End message when no more problems */}
      {!pagination.hasMore && localProblems.length > 0 && (
        <div className="text-center py-6 text-base-content/70">
          You've reached the end of the list
        </div>
      )}

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemTable;
