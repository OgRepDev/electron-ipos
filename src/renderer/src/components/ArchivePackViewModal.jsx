import React from 'react'

const ArchivePackViewModal = ({ isOpen, onClose, pack }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-3 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-2/3">
        <div className="flex flex-col gap-8">
          <p className="flex gap-2 items-center">
            Numer paczki: <span className="font-semibold">{pack.number}</span>
          </p>
          <p className="flex gap-2 items-center">
            Unikalny numer paczki: <span className="font-semibold">{pack.uniqueNumber}</span>
          </p>
          <div className="flex items-center gap-6 w-full">
            <p>
              Odebrał/a:{' '}
              <span className="px-2 py-1 bg-[#4a7ba8] rounded-full opacity-70 text-white">
                {pack.email}
              </span>
            </p>
            <p>
              Data: <span className="opacity-70">{pack.addedDate}</span>
            </p>
          </div>
          <div className="flex items-center gap-6 w-full">
            <p>
              Wydał/a:{' '}
              <span className="px-2 py-1 text-white bg-[#4a7ba8] rounded-full opacity-70">
                {pack.email}
              </span>
            </p>
            <p>
              Data: <span className="opacity-70">{pack.releasedDate}</span>
            </p>
          </div>
          <p className="flex gap-2 items-center">
            Dostawca: <span className="opacity-70">{pack.supplier}</span>
          </p>
          <p className="flex gap-2 items-center">
            Kod dostawcy: <span className="opacity-70">{pack.supplierCode}</span>
          </p>
          <p className="flex gap-2 items-center">
            Do kogo: <span className="opacity-70">{pack.receiver}</span>
          </p>
          <div className="w-full h-0.5 bg-slate-400 rounded-full" />
          <div className="flex items-center gap-6 w-full">
            <p>
              Odbiorca:{' '}
              <span className="px-2 py-1 text-white bg-[#4a7ba8] rounded-full opacity-70">
                {pack.releasedTo}
              </span>
            </p>
            <p>
              Kod odbiorcy: <span className="opacity-70">{pack.releaseCode}</span>
            </p>
          </div>
          <div className="w-full h-0.5 bg-slate-400 rounded-full" />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Uwagi</p>
            <div className="bg-gray-200 shadow-md rounded-md p-2">
              <p>{pack.comments}</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
          Zamknij
        </button>
      </div>
    </div>
  )
}

export default ArchivePackViewModal
