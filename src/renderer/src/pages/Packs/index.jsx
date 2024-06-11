import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { db } from '../../../../firebase/firebase.config'
import EditPackModal from '../../components/EditPackModal'
import PacksTable from '../../components/PacksTable'
import { exportExcel } from '../../utils/exportExcelUtil'

const Packs = () => {
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // New state for search query
  const [searchCategory, setSearchCategory] = useState('number') // New state for search category
  const [newPack, setNewPack] = useState({
    number: '',
    uniqueNumber: '',
    receiver: '',
    supplier: '',
    supplierCode: '',
    comments: '',
    sender: '',
    addedDate: ''
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

  const handleExportExcel = () => {
    // Wyeksportuj dane z tabeli do formatu Excel
    exportExcel(filteredPacks)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value)
  }

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    const formatter = new Intl.DateTimeFormat('pl-PL', options)
    const formattedParts = formatter.formatToParts(date)

    const formattedDate = `${formattedParts[4].value}-${formattedParts[2].value}-${formattedParts[0].value} ${formattedParts[6].value}:${formattedParts[8].value}`
    return formattedDate
  }

  const handleAddPack = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const currentDate = formatDate(new Date())
      if (user) {
        const packWithEmail = {
          ...newPack,
          email: user.email,
          status: 'Oczekująca',
          addedDate: currentDate
        }
        await addDoc(collection(db, 'packs'), packWithEmail)
        setShowModal(false)
        setNewPack({
          number: '',
          uniqueNumber: '',
          supplier: '',
          receiver: '',
          supplierCode: '',
          comments: '',
          sender: ''
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
        <div className="flex items-center gap-2">
          <select
            className="rounded-md bg-gray-100 shadow-sm px-4 py-2 text-sm text-[#7a7a7a]"
            value={searchCategory}
            onChange={handleCategoryChange}
          >
            <option value="number">Numer</option>
            <option value="receiver">Odbiorca</option>
            <option value="supplier">Dostawca</option>
          </select>
          <div className="rounded-md flex items-center gap-2 bg-gray-100 shadow-sm px-4 py-2 text-sm text-[#7a7a7a] w-[20rem]">
            <FaSearch />
            <div className="h-full w-0.5 bg-[#bcbcbc]" />
            <input
              className="bg-transparent focus:outline-none w-full"
              type="text"
              placeholder="Wyszukaj..."
              value={searchQuery}
              onChange={handleSearchChange} // Update search query
            />
          </div>
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
          searchCategory={searchCategory} // Pass search category to PacksTable
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
                <label className="block text-sm font-medium text-gray-700">
                  Unikalny numer paczki
                </label>
                <input
                  type="text"
                  name="uniqueNumber"
                  value={newPack.uniqueNumber}
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
                  <label className="block text-sm font-medium text-gray-700 w-[60%]">
                    Kod dostawcy
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 w-[40%]">
                    Dostawca
                  </label>
                  <select
                    name="supplier"
                    value={newPack.supplier}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-gray-100 shadow-inner focus:border-indigo-500 sm:text-sm focus:outline-none p-2"
                    required
                  >
                    <option value="">Wybierz dostawcę</option>
                    <option value="DHL">DHL</option>
                    <option value="DPD">DPD</option>
                    <option value="UPS">UPS</option>
                    <option value="Poczta Polska">Poczta Polska</option>
                    <option value="Inpost">Inpost</option>
                    <option value="GLS">GLS</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nadawca</label>
                <input
                  type="text"
                  name="sender"
                  value={newPack.sender}
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
                  value={newPack.comments}
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
