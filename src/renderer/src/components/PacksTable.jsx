import { getAuth } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { IoMdSend } from 'react-icons/io'
import { db } from '../../../firebase/firebase.config'
import noDataImg from '../assets/nodata.svg'

const PacksTable = ({ shouldRefresh, setShouldRefresh, onEditPack, searchQuery }) => {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedPackId, setSelectedPackId] = useState(null)
  const [selectedPack, setSelectedPack] = useState(null)
  const [receiver, setReceiver] = useState('')
  const [releaseCode, setReleaseCode] = useState('')
  const { currentUser } = getAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'packs'))
        const packsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPacks(packsData)
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [shouldRefresh])

  const handleDeletePack = async (packId) => {
    try {
      await deleteDoc(doc(db, 'packs', packId))
      setShouldRefresh(true)
    } catch (error) {
      console.error('Error deleting document: ', error)
    }
  }

  const handleEditPack = (pack) => {
    onEditPack(pack)
  }

  const handleConfirmDelete = (packId) => {
    setSelectedPackId(packId)
    setShowDeleteModal(true)
  }

  const handleCancelDelete = () => {
    setSelectedPackId(null)
    setShowDeleteModal(false)
  }

  const handleDeleteConfirmed = () => {
    handleDeletePack(selectedPackId)
    setSelectedPackId(null)
    setShowDeleteModal(false)
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Oczekująca':
        return 'bg-orange-500 border-orange-300'
      case 'Wydana':
        return 'bg-green-500 border-green-300'
      case 'Zgubiona':
        return 'bg-gray-500 border-gray-300'
      default:
        return 'bg-green-500 border-green-300'
    }
  }

  const handleSendPack = async () => {
    try {
      if (!selectedPack) return

      const packToArchive = {
        ...selectedPack,
        status: 'Wydana',
        releasedTo: receiver,
        releaseCode: releaseCode,
        releasedBy: currentUser.email
      }

      // Add the pack to the 'archive' collection
      const archiveRef = doc(db, 'archive', selectedPack.id)
      await setDoc(archiveRef, packToArchive)

      // Delete the pack from the 'packs' collection
      await deleteDoc(doc(db, 'packs', selectedPack.id))

      // Reset modal state and refresh the table
      setSelectedPack(null)
      setReceiver('')
      setReleaseCode('')
      setShowSendModal(false)
      setShouldRefresh(true)
    } catch (error) {
      console.error('Error sending pack: ', error)
    }
  }

  const handleSendClick = (pack) => {
    setSelectedPack(pack)
    setShowSendModal(true)
  }

  const handleCancelSend = () => {
    setSelectedPack(null)
    setReceiver('')
    setReleaseCode('')
    setShowSendModal(false)
  }

  const filteredPacks = packs.filter((pack) =>
    pack.number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="overflow-x-auto py-5 h-[90vh] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numer paczki
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Odbiorca
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dostawca
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Miejsce
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
          ) : filteredPacks.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                <div className="flex flex-col justify-center items-center">
                  <img src={noDataImg} alt="No Data" width={150} />
                  <p className="text-lg opacity-70">Brak paczek</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredPacks.map((pack) => (
              <tr key={pack.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pack.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pack.receiver}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pack.supplier}
                </td>
                <td className="px-6 py-4 text-white whitespace-nowrap text-[0.6rem]">
                  <span
                    className={`rounded-full border-[0.2rem] px-2 py-1 text-center ${getStatusClasses(pack.status)}`}
                  >
                    {pack.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pack.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    className="text-orange-600 hover:text-orange-900"
                    onClick={() => handleEditPack(pack)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="ml-2 text-red-600 hover:text-red-900"
                    onClick={() => handleConfirmDelete(pack.id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="ml-2 text-blue-600 hover:text-blue-900"
                    onClick={() => handleSendClick(pack)}
                  >
                    <IoMdSend />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-medium mb-4">Potwierdź usunięcie paczki</h2>
            <p>Czy na pewno chcesz usunąć tę paczkę?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleCancelDelete}
              >
                Anuluj
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteConfirmed}
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {showSendModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-medium mb-4">Wydaj paczkę</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="receiver">
                Komu wydano
              </label>
              <input
                type="text"
                id="receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseCode">
                Kod wydania
              </label>
              <input
                type="text"
                id="releaseCode"
                value={releaseCode}
                onChange={(e) => setReleaseCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleCancelSend}
              >
                Anuluj
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSendPack}
              >
                Wydaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PacksTable
