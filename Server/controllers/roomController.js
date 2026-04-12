import Hotel from "../models/Hotel.js"

import Room from "../models/Room.js"



// API to create a room 

export const createRoom = async(req,res)=> {
    try {
        const { roomType, pricePerNight, amenities } = req.body
        const hotel = Hotel.findOne({owner: req.user_id})
        
        if(!hotel) {
            return res.json({success: false, message: "Hotel not found"})
        }   
        
        // Handle images - use uploaded files or placeholders
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        } else {
            images = [
                'https://via.placeholder.com/300x200.png?text=Room+Image+1',
                'https://via.placeholder.com/300x200.png?text=Room+Image+2'
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
        
        return res.json({success: true, message: "Room created successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}







// API to get all rooms 

export const getRooms = async(req,res)=> {

    try {

        const rooms = await Room.find({isAvailable :true}).populate({

            path: 'hotel',

            populate: {

                path: 'owner',

                select: 'image'

            }

        }).sort({createdAt: -1})

        return res.json({success: true, rooms})

    } catch (error) {

        return res.json({success: false, message: error.message})

    }

}



// API to get a single room by ID
export const getRoomById = async(req,res)=> {
    try {
        const { id } = req.params
        console.log('Looking for room with ID:', id)
        const room = await Room.findById(id).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        })
        
        if (!room) {
            console.log('Room not found in database for ID:', id)
            return res.json({success: false, message: "Room not found"})
        }
        
        console.log('Found room:', room)
        return res.json({success: true, room})
    } catch (error) {
        console.error('Error in getRoomById:', error)
        return res.json({success: false, message: error.message})
    }
}


// API to get a room for a specific hotel 

export const getOwnerRooms = async(req,res)=> {

    try {

        const hotelData = await Hotel.findOne({owner: req.user_id})

        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate('hotel')

        return res.json({success: true, rooms})

    } catch (error) {

        return res.json({success: false, message: error.message})

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

