import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async(req,res,next) => {
    try {
        console.log("Auth middleware called");
        
        // Get auth object from Clerk
        const auth = req.auth();
        console.log("Auth object:", auth);
        
        const userId = auth?.userId || auth?.sub;
        console.log("User ID:", userId);
        
        if(!userId) {
            console.log("No user ID found in auth");
            res.json({success: false, message: "Not authorized, no token"});
            return;
        }
        
        // Find user in database
        const user = await User.findById(userId);
        console.log("User found:", user ? "Yes" : "No");
        
        if(!user) {
            console.log("User not found in database for ID:", userId);
            res.json({success: false, message: "User not found"});
            return;
        }
        
        req.user = user;
        console.log("User set in req.user:", req.user.userName);
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.json({success: false, message: "Authorization failed"});
    }
}