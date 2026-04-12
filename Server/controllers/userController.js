import User from "../models/User.js"
import Hotel from "../models/Hotel.js"

// GET api/user 

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        
        // Check if user has a registered hotel
        const hotel = await Hotel.findOne({ owner: req.user._id });
        const hasHotel = !!hotel;
        
        res.json({ success: true, role, recentSearchedCities, hasHotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//store user recent searched cities 

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = await req.user;
        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.json({ success: true, message: "City added to recent searches" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//