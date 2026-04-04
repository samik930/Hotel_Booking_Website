import React, { useState } from 'react'
import { assets, roomsDummyData } from '../../assets/assets'

const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingRoom, setEditingRoom] = useState(null)

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'available' && room.isAvailable) ||
      (filterStatus === 'unavailable' && !room.isAvailable)
    return matchesSearch && matchesFilter
  })

  const handleToggleAvailability = (id) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === id ? { ...room, isAvailable: !room.isAvailable } : room
      )
    )
  }

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(prev => prev.filter(room => room._id !== roomId))
    }
  }

  const handleEditRoom = (room) => {
    setEditingRoom(room)
  }

  const handleSaveEdit = () => {
    // In a real app, this would save to backend
    setRooms(prev => prev.map(room => 
      room._id === editingRoom._id ? editingRoom : room
    ))
    setEditingRoom(null)
  }

  const handleEditChange = (field, value) => {
    setEditingRoom(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className='flex-1 p-6 bg-gray-100 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Room Listings</h1>
        <p className='text-gray-600 mt-2'>View, edit, or manage all listed rooms. Keep information up-to-date to provide best experience for users.</p>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search rooms by type...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='flex gap-2'>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Rooms</option>
              <option value='available'>Available</option>
              <option value='unavailable'>Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>All Rooms</h2>
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
              {filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {room.roomType}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {room.amenities.join(', ')}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${room.pricePerNight}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex gap-2'>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          value=''
                          className='sr-only peer'
                          checked={room.isAvailable}
                          onChange={() => handleToggleAvailability(room._id)}
                        />
                        <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
                      </label>
                      <button
                        onClick={() => handleEditRoom(room)}
                        className='px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className='px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Edit Room</h2>
            
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Room Type
                </label>
                <input
                  type='text'
                  value={editingRoom.roomType}
                  onChange={(e) => handleEditChange('roomType', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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

            <div className='flex justify-end gap-2 mt-6'>
              <button
                onClick={() => setEditingRoom(null)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-500 mb-4'>
            <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>No rooms found</h3>
          <p className='text-gray-500'>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first room'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ListRoom