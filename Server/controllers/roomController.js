import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"
import Booking from "../models/Booking.js"


// API to create a room 

export const createRoom = async(req,res)=> {
    try {
        console.log('createRoom called - with authentication');
        
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const owner = auth?.userId || auth?.sub;
        
        console.log('Authenticated user ID for createRoom:', owner);
        
        if (!owner) {
            return res.json({success: false, message: "User not authenticated"});
        }
        
        const { roomType, pricePerNight, amenities } = req.body
        
        // Find hotel for this owner
        const hotel = await Hotel.findOne({owner});
        console.log('Found hotel for createRoom:', hotel);
        
        if(!hotel) {
            return res.json({success: false, message: "Hotel not found"})
        }   
        
        // Handle images - use uploaded files or placeholders
        let images = [];
        if (req.files && req.files.length > 0) {
            // Store proper URLs for uploaded images
            images = req.files.map(file => {
                const filename = file.filename;
                return `http://localhost:3000/uploads/${filename}`;
            });
        } else {
            images = [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'
            ];
        }
        
        // Create room
        const room = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight : +pricePerNight,
            amenities : JSON.parse(amenities),
            images,
        })
        
        console.log('Room created successfully:', room._id);
        return res.json({success: true, message: "Room created successfully"})
    } catch (error) {
        console.error('Error in createRoom:', error);
        return res.json({success: false, message: error.message})
    }
}







// API to get all rooms (filtered by current user for Featured Destination)
export const getRooms = async(req,res)=> {
    try {
        console.log('getRooms called - filtering by current user');
        
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const owner = auth?.userId || auth?.sub;
        
        console.log('Current user ID:', owner);
        
        let rooms;
        if (owner) {
            // Find hotel for this user
            const hotel = await Hotel.findOne({owner});
            console.log('Found hotel for user:', hotel ? hotel.name : 'No hotel');
            
            if (hotel) {
                // Get rooms for this user's hotel
                rooms = await Room.find({isAvailable: true, hotel: hotel._id}).populate({
                    path: 'hotel',
                    populate: {
                        path: 'owner',
                        select: 'image'
                    }
                }).sort({createdAt: -1});
                console.log('Found rooms for user:', rooms.length);
            } else {
                rooms = [];
                console.log('No hotel found for user, returning empty rooms');
            }
        } else {
            // If not authenticated, return all available rooms (fallback)
            rooms = await Room.find({isAvailable: true}).populate({
                path: 'hotel',
                populate: {
                    path: 'owner',
                    select: 'image'
                }
            }).sort({createdAt: -1});
            console.log('User not authenticated, returning all available rooms:', rooms.length);
        }
        
        return res.json({success: true, rooms})
    } catch (error) {
        console.error('Error in getRooms:', error);
        return res.json({success: false, message: error.message})
    }
}



// API to get a single room by ID
export const getRoomById = async(req,res)=> {
    try {
        const { id } = req.params
        console.log('Looking for room with ID:', id)
        console.log('ID type:', typeof id)
        console.log('ID length:', id ? id.length : 'undefined')
        
        // First check if the ID is valid
        if (!id) {
            console.log('No ID provided')
            return res.json({success: false, message: "No room ID provided"})
        }
        
        const room = await Room.findById(id).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        })
        
        console.log('Database query result:', room)
        
        if (!room) {
            console.log('Room not found in database for ID:', id)
            
            // Let's check what rooms actually exist
            const allRooms = await Room.find({}).select('_id roomType hotel').limit(5);
            console.log('Available rooms in database:', allRooms.map(r => ({id: r._id, type: r.roomType, hotel: r.hotel})));
            
            return res.json({success: false, message: "Room not found"})
        }
        
        console.log('Found room:', room)
        return res.json({success: true, room})
    } catch (error) {
        console.error('Error in getRoomById:', error)
        return res.json({success: false, message: error.message})
    }
}

// Check room availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, guests } = req.body
        
        console.log('Checking availability for room:', roomId)
        console.log('Dates:', checkInDate, 'to', checkOutDate)
        console.log('Guests:', guests)
        
        if (!roomId || !checkInDate || !checkOutDate || !guests) {
            return res.json({success: false, message: "Missing required fields"})
        }
        
        // Get the room
        const room = await Room.findById(roomId)
        if (!room) {
            return res.json({success: false, message: "Room not found"})
        }
        
        // Check if room can accommodate guests
        if (guests > room.capacity) {
            return res.json({success: false, message: `Room can only accommodate ${room.capacity} guests`})
        }
        
        // Check for existing bookings in the date range
        const existingBookings = await Booking.find({
            roomId: roomId,
            status: 'confirmed',
            $or: [
                {
                    checkInDate: { $lte: new Date(checkOutDate) },
                    checkOutDate: { $gte: new Date(checkInDate) }
                }
            ]
        })
        
        if (existingBookings.length > 0) {
            return res.json({success: false, message: "Room is already booked for selected dates"})
        }
        
        console.log('Room is available')
        return res.json({success: true, message: "Room is available"})
        
    } catch (error) {
        console.error('Error checking availability:', error)
        return res.json({success: false, message: error.message})
    }
}

// API to get rooms for a specific hotel 
export const getOwnerRooms = async(req,res)=> {
    try {
        console.log('getOwnerRooms called - with authentication');
        
        // Get user ID from Clerk authentication
        const auth = await req.auth();
        const owner = auth?.userId || auth?.sub;
        
        console.log('Authenticated user ID:', owner);
        
        if (!owner) {
            return res.json({success: false, message: "User not authenticated"});
        }
        
        // Find hotel for this owner
        let hotel = await Hotel.findOne({owner});
        console.log('Found hotel:', hotel);
        
        if (!hotel) {
            console.log('No hotel found for owner:', owner);
            return res.json({success: true, rooms: []});
        }
        
        // Find rooms for this hotel
        const rooms = await Room.find({hotel: hotel._id.toString()}).populate('hotel');
        console.log('Found rooms:', rooms.length);
        
        return res.json({success: true, rooms: rooms || []});
    } catch (error) {
        console.error('Error in getOwnerRooms:', error);
        return res.json({success: false, message: error.message});
    }
}







// API to to toggle availability of a room 

export const toggleRoomAvailability = async(req,res)=> {

    try {

        const {roomId} = req.body

        const roomData = await Room.findById(roomId)

        roomData.isAvailable = !roomData.isAvailable

        await roomData.save()

        return res.json({success: true, message: "Room availability toggled successfully"})

    } catch (error) {

        return res.json({success: false, message: error.message})

    }

}

