import Booking from "../models/Booking.js"
import Room from "../models/Room.js";


//function to check availability of the room 
const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate}
        });
        return booking.length === 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//API to check availibility of room 
//POST /api/booking/check-availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        return res.json({ success: true, available: isAvailable });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


//API to create a booking 
//POST /api/booking/book
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guests } = req.body;
        const user = req.user._id;
        const checkAvailability = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!checkAvailability) {
            return res.json({ success: false, message: "Room is not available" });
        }
        //get totalprice from the room 
        const roomData = await Room.findById(room).populate("Hotel")
        let totalPrice = roomData.pricePerNight;

        //calculate totalPrice based on nights
        const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        totalPrice = totalPrice * nights;

        await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        return res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Failed to create booking" });
    }
}

//API to get all bookings of a user
//GET /api/booking/user
export const getUserBookings = async (req,res) => {
    try {
        const bookings = await Booking.find({user: req.user._id}).populate("room hotel").sort({createdAt: -1});
        return res.json({success: true, bookings});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//API to get all bookings of a hotel
//GET /api/booking/hotel

export const getHotelBooking = async (req,res) => {
    try {
        const hotel = await Booking.findOne({owner:req.auth.userId});
        if(!hotel){
            return res.json({success: false, message: "Hotel not found"});
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});
        //Total Bookings
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
        res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});
    } catch (error) {
        return res.json({success: false, message: "Failed to fetch bookings"});
    }
}


