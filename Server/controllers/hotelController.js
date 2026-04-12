import Hotel from "../models/Hotel.js"

import User from "../models/User.js"



export const registerHotel = async (req,res)=> {

    try {

        const {name,address,contact,city} = req.body

        const owner = req.user_id

        const hotel = await Hotel.findOne({owner})

        if(hotel) {

            return res.json({success: true, message: "Hotel aleady registered"})

        } else {

            await Hotel.create({name,address,contact,city,owner})

            await User.findByIdAndUpdate(owner, {role: "hotelOwner"});

            return res.json({success: true, message: "Hotel registered successfully"})

        }

        

        

    } catch (error) {

        return res.json({success: false, message: error.message})

    }

}