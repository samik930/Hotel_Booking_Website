import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, toggleRoomAvailability, getOwnerRooms, getRooms, getRoomById, checkRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();

// Test route without auth middleware
roomRouter.post('/test', upload.array("images", 4), async (req, res) => {
    try {
        console.log("Test route called");
        console.log("Request body:", req.body);
        console.log("Files:", req.files);
        
        // Mock successful response
        res.json({ success: true, message: "Test route working - room created successfully!" });
    } catch (error) {
        console.error("Test route error:", error);
        res.json({ success: false, message: error.message });
    }
});

// Explicit POST route for room creation (temporarily without auth)
roomRouter.post('/', upload.array("images", 4), createRoom);

// GET routes
roomRouter.get('/', getRooms)
roomRouter.get('/owner', getOwnerRooms)
roomRouter.get('/:id', getRoomById)
roomRouter.get('/test', async (req, res) => {
    try {
        console.log('Test route called');
        const auth = await req.auth();
        console.log('Auth in test route:', auth);
        res.json({ success: true, message: 'Test route working', auth: auth ? 'Yes' : 'No' });
    } catch (error) {
        console.error('Test route error:', error);
        res.json({ success: false, message: error.message });
    }
});
roomRouter.post('/check-availability', checkRoomAvailability);
roomRouter.put('/toggle-availability', toggleRoomAvailability)

export default roomRouter;
