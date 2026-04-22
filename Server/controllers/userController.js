import User from "../models/User.js"
import Hotel from "../models/Hotel.js"

// GET api/user 

export const getUserData = async (req, res) => {
    try {
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const userId = auth?.userId || auth?.sub;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        // Find user in database
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const role = user.role;
        const recentSearchedCities = user.recentSearchedCities;
        
        // Check if user has a registered hotel
        const hotel = await Hotel.findOne({ owner: userId });
        const hasHotel = !!hotel;
        
        res.json({ success: true, role, recentSearchedCities, hasHotel });
    } catch (error) {
        console.error('Error in getUserData:', error);
        res.json({ success: false, message: error.message });
    }
}

//store user recent searched cities 

export const storeRecentSearchedCities = async (req, res) => {
    try {
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const userId = auth?.userId || auth?.sub;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        const { recentSearchedCity } = req.body;
        
        // Find user in database
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.json({ success: true, message: "City added to recent searches" });
    } catch (error) {
        console.error('Error in storeRecentSearchedCities:', error);
        res.json({ success: false, message: error.message });
    }
}

//