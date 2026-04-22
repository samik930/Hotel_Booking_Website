import mongoose from "mongoose"

const RoomSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    capacity: { type: Number, required: true, default: 2 },
}, { timestamps: true })

const Room = mongoose.model("Room", RoomSchema)
export default Room