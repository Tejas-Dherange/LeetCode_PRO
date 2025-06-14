import React, { useState, useMemo } from "react";
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
  const [problems, setProblems] = useState(initialProblems);
  console.log("Problems in table", problems);
  const { authUser } = useAuthStore();
  const { deleteProblem } = useProblemStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { isLoading, createPlayList, addProblemToPlayList } =
    usePlaylistStore();
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const [showTagsPopup, setShowTagsPopup] = useState(null);
  const [showCompanyTagsPopup, setShowCompanyTagsPopup] = useState(null);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));

    return Array.from(tagSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty,
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag),
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    deleteProblem(id);
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };
  const handleAddToPlaylist = (id) => {
    setSelectedProblemId(id);
    setIsAddToPlaylistModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Description:", description);
    const playListData = {
      name,
      description,
    };
    if (name.length > 0) {
      await createPlayList(playListData);
      setShowPopup(false);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button
          className="btn btn-primary gap-2"
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className=" p-6 rounded-lg w-80 bg-base-200 ">
            <h2 className="text-xl mb-4 font-semibold">Enter Details</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
                required
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-900 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded"
                >
                  {isLoading ? <Loader2 /> : <h3>Submit</h3>}
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
          onChange={(e) => setDifficulty(e.target.value)}
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
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option
              key={tag}
              value={tag}
              style={
                tag === "demo"
                  ? {
                      backgroundColor: '#6366f1', // indigo-500
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
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
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
                        {/* Popup for all tags */}
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
                                    className="badge badge-info text-xs font-bold"
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
                        {/* Popup for all company tags */}
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
                          className="btn btn-sm btn-outline flex gap-2 items-center"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemTable;
