import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

const ListRoom = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingRoom, setEditingRoom] = useState(null)
  const { getToken } = useAppContext()
  const hasFetched = useRef(false)

  // Fetch rooms from database
  const fetchRooms = async () => {
    // Prevent duplicate calls
    if (hasFetched.current) {
      console.log('Already fetching, skipping duplicate call');
      return;
    }
    
    try {
      hasFetched.current = true;
      setLoading(true)
      console.log('Fetching rooms from database...')
      
      const token = await getToken()
      console.log('Token obtained:', token ? 'Yes' : 'No')
      
      if (!token) {
        throw new Error('No authentication token available')
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/room/owner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Rooms API Response:', response.data)
      
      if (response.data.success) {
        setRooms(response.data.rooms || [])
        console.log('Rooms fetched successfully:', response.data.rooms)
        if (response.data.rooms.length === 0) {
          alert('No rooms found. Add your first room to get started.')
        } else {
          alert(`Loaded ${response.data.rooms.length} rooms`)
        }
      } else {
        console.error('API Error:', response.data)
        alert('Error: ' + (response.data.message || 'Failed to fetch rooms'))
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      alert('Error loading rooms: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'available' && room.isAvailable) ||
      (filterStatus === 'unavailable' && !room.isAvailable)
    return matchesSearch && matchesFilter
  })

  const handleToggleAvailability = async (roomId) => {
    try {
      const token = await getToken()
      const response = await axios.put(`${API_BASE_URL}/api/room/toggle-availability`, 
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (response.data.success) {
        // Update local state
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
          )
        )
        const room = rooms.find(r => r._id === roomId)
        alert(`Room ${room.roomType} availability updated`)
      } else {
        alert('Failed to update room availability')
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
      alert('Error updating room availability')
    }
  }

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(prev => prev.filter(room => room._id !== roomId))
      const room = rooms.find(r => r._id === roomId)
      alert(`Room ${room.roomType} has been deleted successfully`)
    }
  }

  const handleRoomClick = (roomId) => {
    console.log('Clicked room ID:', roomId)
    console.log('Navigating to:', `/room/${roomId}`)
    navigate(`/room/${roomId}`)
  }

  const handleEditRoom = (room) => {
    setEditingRoom(room)
    alert(`Editing room: ${room.roomType}`)
  }

  const handleSaveEdit = () => {
    setRooms(prev => prev.map(room => 
      room._id === editingRoom._id ? editingRoom : room
    ))
    alert(`Room ${editingRoom.roomType} has been updated successfully`)
    setEditingRoom(null)
  }

  const handleEditChange = (field, value) => {
    setEditingRoom(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className='flex-1 p-6 bg-gray-50 min-h-screen'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Room Listings</h1>
        <p className='text-gray-600'>View, edit, or manage all listed rooms. Keep information up-to-date to provide best experience for users.</p>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search rooms by type...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <svg className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          </div>
          <div className='flex gap-2'>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Rooms</option>
              <option value='available'>Available</option>
              <option value='unavailable'>Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900'>All Rooms</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Facility</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Price / night</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="4" className='px-6 py-12 text-center'>
                    <div className='flex justify-center items-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                      <span className='ml-3 text-gray-600'>Loading rooms...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{room.roomType}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {room.amenities && room.amenities.length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className='text-xs text-gray-500'>+{room.amenities.length - 3} more</span>
                            )}
                          </div>
                        ) : (
                          <span className='text-gray-500 text-sm'>No facilities</span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-medium'>${room.pricePerNight}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-3'>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            className='sr-only peer'
                            checked={room.isAvailable}
                            onChange={() => handleToggleAvailability(room._id)}
                          />
                          <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
                        </label>
                        <button
                          onClick={() => handleEditRoom(room)}
                          className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className='px-6 py-12 text-center'>
                    <div className='text-gray-500'>
                      <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                      </svg>
                      <p className='mt-2 text-sm text-gray-600'>
                        {searchTerm || filterStatus !== 'all' 
                          ? 'No rooms found matching your criteria' 
                          : 'No rooms found. Add your first room to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Edit Room</h3>
              
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Room Type
                  </label>
                  <input
                    type='text'
                    value={editingRoom.roomType}
                    onChange={(e) => handleEditChange('roomType', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Price Per Night ($)
                  </label>
                  <input
                    type='number'
                    value={editingRoom.pricePerNight}
                    onChange={(e) => handleEditChange('pricePerNight', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={editingRoom.isAvailable}
                    onChange={(e) => handleEditChange('isAvailable', e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <label className='ml-2 text-sm text-gray-700'>
                    Room is available
                  </label>
                </div>
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  onClick={() => setEditingRoom(null)}
                  className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListRoom
