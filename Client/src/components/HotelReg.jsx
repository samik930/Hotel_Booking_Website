import { assets, cities } from "../assets/assets";

import { useNavigate } from "react-router-dom";



const HotelReg = () => {

  const navigate = useNavigate();

  return (

    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>



      <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2 overflow-hidden'>

        

        {/* Left Image */}

        <img

          src={assets.regImage}

          alt="reg-image"

          className='w-1/2 hidden md:block object-cover'

        />



        {/* Right Form */}

        <div className='relative flex flex-col md:w-1/2 p-8 md:p-10'>



          <img

            src={assets.closeIcon}

            alt="close-icon"

            className='absolute top-4 right-4 h-4 w-4 cursor-pointer'

            onClick={() => navigate("/")}

          />



          <p className='text-2xl font-semibold mt-6 text-center'>

            Register Your Hotel

          </p>



          {/* Hotel Name */}

          <div className='w-full mt-4'>

            <label className="font-medium text-gray-500">Hotel Name</label>

            <input type="text" placeholder="Type here"

              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"

              required

            />

          </div>



          {/* Phone */}

          <div className='w-full mt-4'>

            <label className="font-medium text-gray-500">Phone</label>

            <input type="text" placeholder="Type here"

              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"

              required

            />

          </div>



          {/* Address */}

          <div className='w-full mt-4'>

            <label className="font-medium text-gray-500">Address</label>

            <input type="text" placeholder="Type here"

              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"

              required

            />

          </div>



          {/* City */}

          <div className='w-full mt-4'>

            <label className="font-medium text-gray-500">City</label>

            <select

              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'

              required

            >

              <option value="">Select City</option>

              {cities.map((city) => (

                <option key={city} value={city}>{city}</option>

              ))}

            </select>

          </div>



          {/* Button */}

          <button className='bg-indigo-500 text-white px-4 py-2 mt-6 rounded'>

            Register

          </button>



        </div>



      </form>

    </div>

  )

}



export default HotelReg

