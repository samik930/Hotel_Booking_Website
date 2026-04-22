import mongoose from 'mongoose';
import Room from './models/Room.js';

mongoose.connect('mongodb+srv://Hotel_Booking:kACkQuDECGe67jzY@cluster0.ithifa6.mongodb.net/Hotel_Booking')
  .then(async () => {
    console.log('Connected to database');
    
    try {
      // Get all rooms
      const rooms = await Room.find({});
      console.log(`Found ${rooms.length} rooms to update images`);
      
      for (const room of rooms) {
        console.log(`\nProcessing room: ${room._id}`);
        console.log('Current images:', room.images);
        
        // Update image paths
        const updatedImages = room.images.map((img, index) => {
          // If it's a local path, replace with a placeholder URL
          if (img.includes('C:') || img.includes('\\\\') || img.includes('\\')) {
            console.log(`Replacing local path: ${img}`);
            // Use different placeholder images for variety
            const placeholderImages = [
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
              'https://images.unsplash.com/photo-1590497829814-3c8336e4b1fb?w=800&q=80'
            ];
            return placeholderImages[index % placeholderImages.length];
          }
          
          // If it's via.placeholder.com, replace with better placeholder
          if (img.includes('via.placeholder.com')) {
            console.log(`Replacing placeholder: ${img}`);
            const placeholderImages = [
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
              'https://images.unsplash.com/photo-1590497829814-3c8336e4b1fb?w=800&q=80'
            ];
            return placeholderImages[index % placeholderImages.length];
          }
          
          // If it's already a valid URL, keep it
          if (img.startsWith('http://') || img.startsWith('https://')) {
            console.log(`Keeping existing URL: ${img}`);
            return img;
          }
          
          // For any other case, use default
          console.log(`Using default for: ${img}`);
          return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        });
        
        // Update the room with new image URLs
        room.images = updatedImages;
        await room.save();
        
        console.log(`Updated room ${room._id} with new images:`, updatedImages);
      }
      
      console.log('\nAll room images updated successfully!');
    } catch (error) {
      console.error('Error updating room images:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
