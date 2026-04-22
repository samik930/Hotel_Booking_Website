import Booking from "../models/Booking.js"
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

//function to check availability of the room 
const checkAvailability = async ({checkInDate, checkOutDate, roomId}) => {
    try {
        const booking = await Booking.find({
            roomId,
            status: 'confirmed',
            checkInDate: {$lte: new Date(checkOutDate)},
            checkOutDate: {$gte: new Date(checkInDate)}
        });
        return booking.length === 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//API to create a booking 
//POST /api/bookings
export const createBooking = async (req, res) => {
    try {
        console.log('Creating booking...');
        
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const user = auth?.userId || auth?.sub;
        
        console.log('Authenticated user ID for booking:', user);
        
        if (!user) {
            return res.json({success: false, message: "User not authenticated"});
        }
        
        const { roomId, checkInDate, checkOutDate, guests, totalPrice } = req.body;
        
        console.log('Booking details:', { roomId, checkInDate, checkOutDate, guests, totalPrice });
        
        if (!roomId || !checkInDate || !checkOutDate || !guests || !totalPrice) {
            return res.json({success: false, message: "Missing required fields"});
        }
        
        // Check room availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, roomId });
        if (!isAvailable) {
            return res.json({success: false, message: "Room is not available for selected dates"});
        }
        
        // Get room and hotel details
        const roomData = await Room.findById(roomId).populate('hotel');
        if (!roomData) {
            return res.json({success: false, message: "Room not found"});
        }
        
        // Create booking
        const booking = await Booking.create({
            user,
            roomId,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            totalPrice: +totalPrice,
            status: 'confirmed'
        });
        
        console.log('Booking created successfully:', booking._id);
        return res.json({success: true, message: "Booking created successfully", booking});
        
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.json({success: false, message: "Failed to create booking: " + error.message});
    }
}

//API to get all bookings of a user
//GET /api/booking/user
export const getUserBookings = async (req,res) => {
    try {
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const user = auth?.userId || auth?.sub;
        
        if (!user) {
            return res.json({success: false, message: "User not authenticated"});
        }
        
        const bookings = await Booking.find({user}).populate("roomId hotel").sort({createdAt: -1});
        return res.json({success: true, bookings});
    } catch (error) {
        console.error('Error getting user bookings:', error);
        return res.json({success: false, message: error.message});
    }
}

//API to get all bookings of a hotel
//GET /api/bookings/hotel
export const getHotelBookings = async (req,res) => {
    try {
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const owner = auth?.userId || auth?.sub;
        
        if (!owner) {
            return res.json({success: false, message: "User not authenticated"});
        }
        
        // Find hotel for this owner
        const hotel = await Hotel.findOne({owner});
        if(!hotel){
            return res.json({success: false, message: "Hotel not found"});
        }
        
        const bookings = await Booking.find({hotel: hotel._id}).populate("roomId hotel user").sort({createdAt: -1});
        
        //Total Bookings
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
        
        res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});
    } catch (error) {
        console.error('Error getting hotel bookings:', error);
        return res.json({success: false, message: "Failed to fetch bookings"});
    }
}


