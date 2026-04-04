import React, { useState, useMemo } from 'react'
import { roomsDummyData, facilityIcons, assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'

const AllRooms = () => {
  const navigate = useNavigate()

  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [minRating, setMinRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleRoomTypeChange = (type) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' })
    setSelectedRoomTypes([])
    setSelectedAmenities([])
    setMinRating('')
  }

  const filteredRooms = useMemo(() => {
    return roomsDummyData.filter((room) => {
      if (priceRange.min && room.pricePerNight < parseInt(priceRange.min)) return false
      if (priceRange.max && room.pricePerNight > parseInt(priceRange.max)) return false

      if (selectedRoomTypes.length && !selectedRoomTypes.includes(room.roomType)) return false

      if (selectedAmenities.length) {
        const hasAll = selectedAmenities.every((a) => room.amenities.includes(a))
        if (!hasAll) return false
      }

      if (minRating && room.rating < parseInt(minRating)) return false

      return true
    })
  }, [priceRange, selectedRoomTypes, selectedAmenities, minRating])

  return (
    <div className="pt-24 px-4 md:px-10 lg:px-20">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h2 className="text-lg font-semibold">Hotel Rooms</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          {showFilters ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div className="flex gap-8">

        {/* Sidebar */}
        <div className={`lg:w-80 w-full ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white p-5 rounded-xl shadow sticky top-6">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Clear</button>
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="mb-2 text-sm">Price</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="border p-2 w-full rounded focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="border p-2 w-full rounded focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-5">
              <p className="mb-2 text-sm">Room Type</p>
              {['Single Bed', 'Double Bed', 'Suite', 'Deluxe'].map((type) => (
                <label key={type} className="block text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedRoomTypes.includes(type)}
                    onChange={() => handleRoomTypeChange(type)}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Amenities */}
            <div className="mb-5">
              <p className="mb-2 text-sm">Amenities</p>
              {Object.keys(facilityIcons).map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  <img src={facilityIcons[a]} className="w-4 h-4" />
                  {a}
                </label>
              ))}
            </div>

            {/* Rating */}
            <div>
              <p className="mb-2 text-sm">Rating</p>
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r.toString()}
                    onChange={() => setMinRating(r.toString())}
                  />
                  {r}★ & up
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1">

          {filteredRooms.length === 0 && (
            <p className="text-center text-gray-500">No rooms found</p>
          )}

          <div className="grid gap-6">
            {filteredRooms.map((room) => (
              <div key={room._id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 hover:shadow-xl transition-all duration-300 group">

                <img
                  src={room.images[0]}
                  className="w-full md:w-1/3 h-52 object-cover rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/rooms/${room._id}`)}
                />

                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <p className="text-sm text-gray-500">{room.hotel.city}</p>
                    <h3
                      className="text-xl font-semibold cursor-pointer group-hover:text-blue-600 transition-colors"
                      onClick={() => navigate(`/rooms/${room._id}`)}
                    >
                      {room.hotel.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <StarRating rating={room.rating} />
                      <span className="text-sm text-gray-500">200+ reviews</span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">{room.hotel.address}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold">${room.pricePerNight}/night</p>
                    <button
                      onClick={() => navigate(`/rooms/${room._id}`)}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors transform hover:scale-105 active:scale-95"
                    >
                      View
                    </button>
                  </div>

                  {/* Amenities */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-3">
                      {room.amenities.slice(0,4).map((a,i)=> (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                          {facilityIcons[a] && (
                            <img src={facilityIcons[a]} className="w-4 h-4" />
                          )}
                          <span>{a}</span>
                        </div>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AllRooms
