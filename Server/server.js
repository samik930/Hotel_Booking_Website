import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware, createClerkClient } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebHooks.js"
import userRouter from "./routes/userRoute.js"
import hotelRouter from "./routes/hotelRoute.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRouter.js"
import bookingRouter from "./routes/bookingRoute.js"
import upload from "./middleware/uploadMiddleware.js"

connectDB()
connectCloudinary()

const app = express() 

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://hotel-booking-website.onrender.com'],
  credentials: true
})) //Enable cross origin resource sharing 
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

// Configure Clerk middleware 
app.use('/api/clerk',clerkWebhooks)
app.use('/api/user', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}), userRouter)
app.use('/api/hotel', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}), hotelRouter)
app.use('/api/booking', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}), bookingRouter)
// Add back Clerk middleware to room routes
app.use('/api/room', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}), roomRouter)

// Public route to get all rooms (now with authentication for user filtering)
app.get('/api/rooms', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}), async (req, res) => {
  try {
    const { getRooms } = await import('./controllers/roomController.js')
    await getRooms(req, res)
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

// Serve local images
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename
  // Construct the full path to the temp file
  const path = require('path')
  const fs = require('fs')
  
  // Try to find the file in common temp locations
  const possiblePaths = [
    path.join(process.env.TEMP || '/tmp', filename),
    path.join('C:\\Users\\LENOVO\\AppData\\Local\\Temp', filename),
    filename
  ]
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath)
    }
  }
  
  // If not found, return 404
  res.status(404).send('Image not found')
})

app.get('/',(req,res)=>
    res.send("API is working fine")
)

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() })
})

// Add test route directly here to bypass auth
app.post('/api/room/test', upload.array("images", 4), async (req, res) => {
    try {
        console.log("Test route called from server.js");
        console.log("Request body:", req.body);
        console.log("Files:", req.files);
        
        // Mock successful response
        res.json({ success: true, message: "Test route working - room created successfully!" });
    } catch (error) {
        console.error("Test route error:", error);
        res.json({ success: false, message: error.message });
    }
});

// Simple test route without file upload
app.post('/api/room/simple-test', async (req, res) => {
    try {
        console.log("Simple test route called");
        console.log("Request body:", req.body);
        
        res.json({ success: true, message: "Simple test working!" });
    } catch (error) {
        console.error("Simple test error:", error);
        res.json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})