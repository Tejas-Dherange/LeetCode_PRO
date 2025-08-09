import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useCompanySheetStore = create((set) => ({
  companySheets: [],
  isSheetsLoading: false,
  companySheet: null,
  premiumSheets:[],
  isPremiumSheetsLoading: false,
  sheetProblems: [],

  getCompanySheets: async () => {
    set({ isSheetsLoading: true });
    try {
      const response = await axiosInstance.get("/company-sheets/");
      console.log("Company Sheets Response:", response);
      
        set({ companySheets: response.data.sheets });
        toast.success(response.data.message || "Company Sheets fetched successfully!");
    } catch (error) {
      console.error("Error fetching company sheets:", error);
      toast.error("Failed to fetch company sheets.");
    } finally {
      set({ isSheetsLoading: false });
    }
  },

  createCompanySheet: async (sheetData) => {
    set({ isSheetsLoading: true });
    try {
      console.log("Creating Company Sheet with data:", sheetData);
      const response = await axiosInstance.post(
        "/company-sheets/create",
        sheetData,
      );
      console.log("Create Company Sheet Response:", response);

      set((state) => ({
        companySheets: [...state.companySheets, response.data.sheet],
      }));
      toast.success(response.data.message || "Company Sheet created successfully!");
    } catch (error) {
      console.error("Error creating company sheet:", error);
        toast.error("Failed to create company sheet.");
    } finally {
      set({ isSheetsLoading: false });
    }
  },

  getPremiumCompanySheets: async () => {
    set({ isPremiumSheetsLoading: true });
    try {
      const response = await axiosInstance.get("/company-sheets/premium-sheets");
      console.log("Premium Company Sheets Response:", response);

      set({ premiumSheets: response.data.sheets });
        toast.success(response.data.message || "Premium Company Sheets fetched successfully!");
    } catch (error) {
      console.error("Error fetching premium company sheets:", error);
      toast.error("Failed to fetch premium company sheets.");
    } finally {
      set({ isPremiumSheetsLoading: false });
    }
  },

  getSheetProblems: async (sheetId) => {
    set({ isSheetsLoading: true });
    try {
      const response = await axiosInstance.get(`/company-sheets/${sheetId}/problems`);
      console.log("Sheet Problems Response:", response);

      set({ sheetProblems: response.data.sheet });
      toast.success(response.data.message || "Sheet problems fetched successfully!");
    } catch (error) {
      console.error("Error fetching sheet problems:", error);
      toast.error("Failed to fetch sheet problems.");
    } finally {
      set({ isSheetsLoading: false });
    }
  }
}));
