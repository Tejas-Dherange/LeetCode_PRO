import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";

import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  List,
  Tag,
  ExternalLink,
  
  Loader2,
} from "lucide-react";

const PlaylistProfile = () => {
  const { playlists, getAllPlayLists, deletePlayList, createPlayList,isLoading } =
    usePlaylistStore();
  // console.log("Playlists : 0", playlists);

  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getAllPlayLists();
  }, [getAllPlayLists]);

  const handleDelete = async (id) => {
    await deletePlayList(id);
  };
  const togglePlaylist = (id) => {
    if (expandedPlaylist === id) {
      setExpandedPlaylist(null);
    } else {
      setExpandedPlaylist(id);
    }
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
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return <span className="badge badge-success">Easy</span>;
      case "MEDIUM":
        return <span className="badge badge-warning">Medium</span>;
      case "HARD":
        return <span className="badge badge-error">Hard</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };
  return (
    <div className="p-4 bg-base-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">My Playlists</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowPopup(true)}
          >
            Create Playlist
          </button>
        {showPopup && (
          <div className="modal modal-open">
            <div className="modal-box bg-base-100/95 backdrop-blur-md border-2 border-emerald-500/30 shadow-2xl max-w-md">
              <h2 className="text-2xl mb-6 font-bold text-emerald-500 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Create New Playlist
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dynamic Programming"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered input-lg bg-base-200/50 focus:bg-base-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Description</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <textarea
                    placeholder="Brief description of the playlist..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered textarea-lg bg-base-200/50 focus:bg-base-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none leading-relaxed"
                    rows={4}
                    required
                  />
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="btn btn-ghost"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-none gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Create Playlist
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-backdrop" onClick={() => setShowPopup(false)}></div>
          </div>
        )}
        </div>
        {playlists.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h3 className="text-xl font-medium">No playlists found</h3>
              <p className="text-base-content/70">
                Create your first playlist to organize problems!
              </p>
              <div className="card-actions justify-center mt-4">
                <button className="btn btn-primary">Create Playlist</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  {/* Playlist Header */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => togglePlaylist(playlist.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder flex items-center justify-center">
                        <div className="bg-primary text-primary-content rounded-lg w-12 items-center">
                          <BookOpen size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{playlist.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-base-content/70">
                          <div className="flex items-center gap-1">
                            <List size={14} />
                            <span>{playlist.problems?.length} problems</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>
                              Created {formatDate(playlist.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-sm">
                      {expandedPlaylist === playlist.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-base-content/80 mt-1">
                    {playlist.description}
                  </p>

                  {/* Expanded Problems List */}
                  {expandedPlaylist === playlist.id && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                      <h4 className="text-lg font-semibold mb-3">
                        Problems in this playlist
                      </h4>

                      {playlist.problem?.length === 0 ? (
                        <div className="alert">
                          <span>No problems added to this playlist yet.</span>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="table table-zebra w-full">
                            <thead>
                              <tr>
                                <th>Problem</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                                <th className="text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {playlist.problem?.map((item) => (
                                <tr key={item.id} className="hover">
                                  <td className="font-medium">
                                    {item.problem.title}
                                  </td>
                                  <td>
                                    {getDifficultyBadge(
                                      item.problem.difficulty,
                                    )}
                                  </td>
                                  <td>
                                    <div className="flex flex-wrap gap-1">
                                      {item.problem.tags &&
                                        item.problem.tags.map((tag, idx) => (
                                          <div
                                            key={idx}
                                            className="badge badge-outline badge-sm"
                                          >
                                            <Tag size={10} className="mr-1" />
                                            {tag}
                                          </div>
                                        ))}
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    <Link
                                      to={`/problem/${item.problem.id}`}
                                      className="btn btn-xs btn-outline btn-primary"
                                    >
                                      <ExternalLink size={12} />
                                      Solve
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="btn btn-sm btn-error"
                        >
                          Delete Playlist
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistProfile;
