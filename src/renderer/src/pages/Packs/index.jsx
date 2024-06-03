import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { db } from '../../../../firebase/firebase.config'
import EditPackModal from '../../components/EditPackModal'
import PacksTable from '../../components/PacksTable'

const Packs = () => {
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // New state for search query
  const [newPack, setNewPack] = useState({
    number: '',
    receiver: '',
    supplier: '',
    supplierCode: '',
    position: ''
  })
  const [editPack, setEditPack] = useState(null)

  useEffect(() => {
    if (shouldRefreshTable) {
      setShouldRefreshTable(false)
    }
  }, [shouldRefreshTable])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPack((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleAddPack = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (user) {
        const packWithEmail = { ...newPack, email: user.email, status: 'Oczekująca' }
        await addDoc(collection(db, 'packs'), packWithEmail)
        setShowModal(false)
        setNewPack({
          number: '',
          supplier: '',
          receiver: '',
          supplierCode: '',
          position: ''
        })
        setShouldRefreshTable(true)
      } else {
        console.error('No user is logged in')
      }
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  }

  const handleEditPack = (pack) => {
    setEditPack(pack) // Set selected pack for editing
    setShowEditModal(true) // Show modal
  }

  const handleSaveEditedPack = async (editedPack) => {
    try {
      const packRef = doc(db, 'packs', editedPack.id)
      await updateDoc(packRef, editedPack)
      setShowEditModal(false)
      setEditPack(null)
      setShouldRefreshTable(true)
    } catch (error) {
      console.error('Error updating document: ', error)
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-4">
      <div className="flex w-full items-center justify-between box-border">
        <div className="rounded-md flex items-center gap-2 bg-gray-100 shadow-sm px-4 py-2 text-sm text-[#7a7a7a] w-[20rem]">
          <FaSearch />
          <div className="h-full w-0.5 bg-[#bcbcbc]" />
          <input
            className="bg-transparent focus:outline-none w-full"
            type="text"
            placeholder="Wyszukaj po numerze paczki.."
            value={searchQuery}
            onChange={handleSearchChange} // Update search query
          />
        </div>
        <button
          className="bg-[#4a7ba8] px-5 py-2 flex gap-2 rounded-md text-white justify-center items-center text-sm"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Dodaj paczkę
        </button>
      </div>
      <div className="h-auto w-full">
        <PacksTable
          shouldRefresh={shouldRefreshTable}
          setShouldRefresh={setShouldRefreshTable}
          searchQuery={searchQuery} // Pass search query to PacksTable
          onEditPack={handleEditPack}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-medium mb-4">Dodaj nową paczkę</h2>
            <form onSubmit={handleAddPack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Numer paczki</label>
                <input
                  type="text"
                  name="number"
                  value={newPack.number}
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
                  value={newPack.receiver}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
                  required
                />
              </div>
              <div className="flex gap-2 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod dostawcy</label>
                  <input
                    type="text"
                    name="supplierCode"
                    value={newPack.supplierCode}
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
                    value={newPack.supplier}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Miejsce</label>
                <input
                  type="text"
                  name="position"
                  value={newPack.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Anuluj
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <EditPackModal
          pack={editPack}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEditedPack}
        />
      )}
    </div>
  )
}

export default Packs
