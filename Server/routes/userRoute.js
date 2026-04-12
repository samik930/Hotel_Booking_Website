import express from "express";
import { getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);

export default userRouter;