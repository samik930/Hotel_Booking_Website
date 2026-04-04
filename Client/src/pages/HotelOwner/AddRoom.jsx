import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    roomType: '',
    price: '',
    description: '',
    amenities: [],
    images: [],
    isAvailable: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target
    setRoomData((prevData) => {
      const updatedAmenities = checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((amenity) => amenity !== value)
      return { ...prevData, amenities: updatedAmenities }
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setRoomData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...newImages],
    }))
  }

  const handleRemoveImage = (index) => {
    setRoomData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index)
      return { ...prevData, images: updatedImages }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Room Data Submitted:', roomData)
    // Here you would typically send data to a backend server
    alert('Room Added Successfully! (Check console for data)')
    // Reset form
    setRoomData({
      roomType: '',
      price: '',
      description: '',
      amenities: [],
      images: [],
      isAvailable: true,
    })
  }

  const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Family']
  const allAmenities = [
    'Free WiFi',
    'Free Breakfast',
    'Room Service',
    'Mountain View',
    'Pool Access',
    'Air Conditioning',
    'Balcony',
    'TV',
  ]

  return (
    <div className='flex-1 p-6 bg-gray-100 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Add Room</h1>
        <p className='text-gray-600 mt-2'>Fill in the details carefully and accurate room details, pricing, and amenities</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Image Upload */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>Images</h2>
            
            {/* Upload Area */}
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4'>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
                id='image-upload'
              />
              <label htmlFor='image-upload' className='cursor-pointer'>
                <div className='flex flex-col items-center'>
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
                    <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                  </div>
                  <span className='text-blue-600 font-medium'>Upload</span>
                  <span className='text-gray-500 text-sm'>Drop your images here or click to browse</span>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            <div className='space-y-2'>
              {roomData.images.map((image, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={image.preview}
                    alt={`Room preview ${index + 1}`}
                    className='w-full h-32 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className='lg:col-span-2'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Room Type */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Room Type
                </label>
                <select
                  name='roomType'
                  value={roomData.roomType}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                >
                  <option value=''>Select room type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Price / Night
                </label>
                <input
                  type='number'
                  name='price'
                  value={roomData.price}
                  onChange={handleChange}
                  placeholder='Enter price per night'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              {/* Amenities */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Amenities
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {allAmenities.map((amenity) => (
                    <label key={amenity} className='flex items-center space-x-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        value={amenity}
                        checked={roomData.amenities.includes(amenity)}
                        onChange={handleAmenityChange}
                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                      />
                      <span className='text-sm text-gray-700'>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

        
             

              {/* Submit Button */}
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRoom