import React, { useState } from 'react'

const EditPackModal = ({ pack, onClose, onSave }) => {
  const [editedPack, setEditedPack] = useState(
    pack
      ? pack
      : {
          number: '',
          receiver: '',
          supplier: '',
          status: '',
          supplierCode: '',
          position: ''
        }
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedPack((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(editedPack)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-medium mb-4">Edytuj paczkę</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numer paczki</label>
            <input
              type="text"
              name="number"
              value={editedPack.number}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Odbiorca</label>
            <input
              type="text"
              name="receiver"
              value={editedPack.receiver}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dostawca</label>
            <input
              type="text"
              name="supplier"
              value={editedPack.supplier}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kod dostawcy</label>
            <input
              type="text"
              name="supplierCode"
              value={editedPack.supplierCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Uwagi</label>
            <input
              type="text"
              name="comments"
              value={editedPack.comments}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Anuluj
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPackModal
