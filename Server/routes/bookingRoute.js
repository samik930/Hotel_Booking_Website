import express from 'express'
import { createBooking, getUserBookings, getHotelBookings } from '../controllers/bookingController.js'

const bookingRouter = express.Router()

bookingRouter.post('/', createBooking)
bookingRouter.get('/user', getUserBookings)
bookingRouter.get('/hotel', getHotelBookings)

export default bookingRouter