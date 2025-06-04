import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlayList: async (playListData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/playlist/create-playlist",
        playListData,
      );

      set((state) => ({
        playlists: [...state.playlists, res.data.playlist],
      }));

      toast.success(res.data.message);
      return res.data.playlist;
    } catch (error) {
      console.error("error occured in creating playlist", error);
      toast.error("error in creating playlist");
    } finally {
      set({ isLoading: false });
    }
  },
  getAllPlayLists: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/playlist");

      set({ playlists: res.data.allPlaylists });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured in fetching playlists", error);
      toast.error("error in fetching playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlayListById: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/playlist/get-playlist-by-id/${id}`);
      console.log(res.data.playlist);

      set({ currentPlaylist: res.data.playlist });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured in fetching playlist", error);
      toast.error("error in fetching playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlayList: async (playListId, problemIds) => {
    try {
      set({ isLoading: true });
      console.log("prob ids",problemIds);
      
      const res = await axiosInstance.post(
        `/playlist/${playListId}/add-problem`,
        {problemIds},
      );
      console.log("response",res);

      toast.success(res.data.message);

      //refresh playlist details
      if (get().currentPlaylist?.id === playListId) {
        await get().getPlayListById(playListId);
      }
    } catch (error) {
      console.error("error occured in adding problem in playlist", error);
      toast.error("error in adding problem in playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProblemFromPlayList: async (playListId, problemIds) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post(
        `/playlist/${playListId}/remove-problem`,
        problemIds,
      );

      toast.success(res.data.message);
      if (get().currentPlaylist?.id === playListId) {
        await get().getPlayListById(playListId);
      }
    } catch (error) {
      console.error("error occured in deleting problem from playlist", error);
      toast.error("error in deleting problem from playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlayList: async (playListId) => {
    try {
      set({ isLoading: true });

      await axiosInstance.delete(`/playlist/delete-playlist/${playListId}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playListId),
      }));
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured in deleting  playlist", error);
      toast.error("error in deleting playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
