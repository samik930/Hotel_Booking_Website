import express from "express";
import { getUserData } from "../controllers/userController.js";
import { storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getUserData);
userRouter.post("/store-recent-search", storeRecentSearchedCities);

export default userRouter;