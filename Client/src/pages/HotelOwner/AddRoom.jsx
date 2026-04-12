import React, { useState } from "react"
import { useAppContext } from "../../context/AppContext"

const AddRoom = () => {
  const { axios, getToken } = useAppContext()

  const [roomData, setRoomData] = useState({
    roomType: "",
    price: "",
    description: "",
    amenities: [],
    images: [],
    isAvailable: true,
  })

  // Handle text / select / toggle
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle amenities
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target

    setRoomData((prev) => {
      const updatedAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value)

      return { ...prev, amenities: updatedAmenities }
    })
  }

  // Handle image change for specific slot
  const handleImageChange = (e, slotIndex) => {
    const file = e.target.files[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    // Create new images array
    const newImages = [...roomData.images]
    
    // Add or replace image at specific slot
    newImages[slotIndex] = {
      file,
      preview: URL.createObjectURL(file)
    }

    setRoomData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  // Remove image from specific slot
  const handleRemoveImage = (slotIndex) => {
    setRoomData((prev) => {
      // Cleanup memory for the removed image
      if (prev.images[slotIndex]) {
        URL.revokeObjectURL(prev.images[slotIndex].preview)
      }

      // Create new images array with empty slot
      const newImages = [...prev.images]
      newImages[slotIndex] = null
      
      // Filter out null values to clean up the array
      const cleanedImages = newImages.filter(img => img !== null)
      
      return { ...prev, images: cleanedImages }
    })
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!roomData.roomType) return alert("Please select a room type")
    if (roomData.price <= 0) return alert("Price must be greater than 0")
    if (roomData.images.length === 0) return alert("Please upload at least 1 image")

    try {
      // Test server connection first
      console.log("Testing server connection...")
      const testResponse = await axios.get("http://localhost:3000/api/test")
      console.log("Server test:", testResponse.data)

      /*// Test existing room GET route
      const roomTestResponse = await axios.get("http://localhost:3000/api/room")
      console.log("Room GET test:", roomTestResponse.data)

      // Create form data
      const formData = new FormData()
      formData.append("roomType", roomData.roomType)
      formData.append("pricePerNight", roomData.price)  // Backend expects pricePerNight
      formData.append("description", roomData.description)
      formData.append("isAvailable", roomData.isAvailable)*/

      // Add amenities as JSON string
      formData.append("amenities", JSON.stringify(roomData.amenities))

      // Add images
      roomData.images.forEach((img) => formData.append("images", img.file))

      // Get auth token
      const token = await getToken()
      console.log("Token obtained:", token ? "Yes" : "No")
      
      // Submit to server with full URL
      console.log("Submitting to server...")
      const response = await axios.post("http://localhost:3000/api/room", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Response:", response.data)

      // Handle success
      if (response.data.success) {
        alert("Room Added Successfully!")
        
        // Cleanup memory
        roomData.images.forEach((img) => URL.revokeObjectURL(img.preview))

        // Reset form
        setRoomData({
          roomType: "",
          price: "",
          description: "",
          amenities: [],
          images: [],
          isAvailable: true,
        })
      } else {
        alert(`Error: ${response.data.message || "Failed to add room"}`)
      }
    } catch (error) {
      console.error("Error details:", error)
      if (error.response) {
        console.error("Response status:", error.response.status)
        console.error("Response data:", error.response.data)
      }
      alert("Error adding room. Please check console for details.")
    }
  }

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family"]

  const amenitiesList = [
    "Free WiFi",
    "Free Breakfast",
    "Room Service",
    "Mountain View",
    "Pool Access",
    "Air Conditioning",
    "Balcony",
    "TV",
  ]

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Room</h1>
          <p className="text-gray-600">Fill in the details to add a new room to your hotel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Images</h2>
                
                {/* Image Upload Areas - Exactly 4 slots */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Room Images</span>
                    <span className="text-xs text-gray-500">{roomData.images.length}/4 images</span>
                  </div>
                  
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative">
                      {roomData.images[index] ? (
                        // Show uploaded image
                        <div className="relative group">
                          <img
                            src={roomData.images[index].preview}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            Image {index + 1}
                          </div>
                        </div>
                      ) : (
                        // Show upload slot
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                          <label htmlFor={`image-upload-${index}`} className="cursor-pointer">
                            <div className="flex flex-col items-center py-2">
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm text-gray-600">Upload Image {index + 1}</span>
                              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {roomData.images.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">Upload at least 1 image to continue</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Room Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="roomType"
                      value={roomData.roomType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Night ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={roomData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={roomData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the room features, view, amenities, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Amenities */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((a) => (
                      <label key={a} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          value={a}
                          checked={roomData.amenities.includes(a)}
                          onChange={handleAmenityChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="mt-6">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Room Availability</h3>
                      <p className="text-sm text-gray-500">Toggle to make this room available for booking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={roomData.isAvailable}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRoomData({
                        roomType: "",
                        price: "",
                        description: "",
                        amenities: [],
                        images: [],
                        isAvailable: true,
                      })
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={roomData.images.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRoom