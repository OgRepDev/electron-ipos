import React from 'react'
import { FaLock } from 'react-icons/fa'

const Administrator = () => {
  return (
    <div className="w-full h-full flex overflow-auto flex-col gap-2 p-4">
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold flex items-center gap-2">
          Administracja <FaLock />
        </p>
        <p>Użytkowników:</p>
      </div>
      <div className="shadow-lg rounded-md p-2 flex flex-col w-full">
        <div></div>
      </div>
    </div>
  )
}

export default Administrator
