import express from 'express'
import { checkRoomAvailability, createBooking, getUserBookings, getHotelBooking } from '../controllers/bookingController.js'
import { protect } from '../middleware/authMiddleware.js'

const bookingRouter = express.Router()

bookingRouter.post('/check-availability', checkRoomAvailability)
bookingRouter.post('/book', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/hotel', protect, getHotelBooking)


export default bookingRouter