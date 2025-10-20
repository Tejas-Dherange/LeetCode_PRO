
// to build an endpoint that provides user activity data for the past year, with each day's activity count, we can create a route in our Express application. Below is an example implementation:
import express from "express";
import { getContributionActivity } from "../controllers/contribution.controllers.js";
const router = express.Router();

router.get("/activity/:userId", getContributionActivity);


export default router;