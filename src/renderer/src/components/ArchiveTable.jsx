import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase/firebase.config'

import noDataImg from '../assets/nodata.svg'

const ArchiveTable = () => {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'archive'))
        const packsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPacks(packsData)
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  return (
    <div className="overflow-x-auto my-5">
      <table className="min-w-full divide-y divide-gray-200 h-auto">
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
        <tbody className="bg-white divide-y divide-gray-200 h-full overflow-y-auto w-full">
          {loading ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
          ) : packs.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                <div className="flex flex-col justify-center items-center">
                  <img src={noDataImg} alt="No Data" width={150} />
                  <p className="text-lg opacity-70">Brak paczek</p>
                </div>
              </td>
            </tr>
          ) : (
            packs.map((pack) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ArchiveTable
