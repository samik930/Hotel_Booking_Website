import mongoose from 'mongoose';
import Room from './models/Room.js';
import Hotel from './models/Hotel.js';

mongoose.connect('mongodb://localhost:27017/hotel-booking')
  .then(async () => {
    console.log('Connected to database');
    
    try {
      // Get all rooms
      const rooms = await Room.find({});
      console.log(`Found ${rooms.length} rooms to update`);
      
      for (const room of rooms) {
        // Find hotel by name (assuming the hotel reference was stored as a name)
        if (typeof room.hotel === 'string') {
          const hotel = await Hotel.findOne({ name: room.hotel });
          if (hotel) {
            room.hotel = hotel._id;
            await room.save();
            console.log(`Updated room ${room._id} to reference hotel ${hotel.name}`);
          } else {
            console.log(`Hotel not found for room ${room._id} with reference: ${room.hotel}`);
          }
        }
      }
      
      console.log('Room references updated successfully!');
    } catch (error) {
      console.error('Error updating rooms:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
