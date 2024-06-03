import React from 'react'
import { FaFileArchive, FaUser } from 'react-icons/fa'
import { GoPackage } from 'react-icons/go'
import { IoMdHelpCircle } from 'react-icons/io'
import { MdAdminPanelSettings } from 'react-icons/md'
import { RiLogoutBoxLine } from 'react-icons/ri'
import IPosLogo from '../../assets/logotyp.svg'
import { useAuth } from '../../contexts/authContext'
import { NavButton } from './NavButton'

export const Navbar = () => {
  const { logOut, role, user } = useAuth()

  console.log('Rola użytkownika:', role)

  return (
    <div className="relative h-full p-2 flex gap-5 flex-col w-[225px] shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <div className="rounded-lg bg-[#4a7ba8] h-[50px] text-white w-[50px] flex items-center justify-center shadow-md">
            <FaUser />
          </div>
          <img src={IPosLogo} width={100} alt="logo IPos" />
        </div>
      </div>
      <div className="w-full bg-gray-300 h-0.5 rounded-full" />
      <div className="flex flex-col h-full gap-5 justify-between">
        <div className="flex flex-col gap-3 h-full">
          <NavButton title="Paczki" icon={<GoPackage />} link="/home" />
          <NavButton title="Archiwum" icon={<FaFileArchive />} link="/archive" />
        </div>
        {role === 'admin' && (
          <NavButton title="Administracja" icon={<MdAdminPanelSettings />} link="/admin" />
        )}
        <div className="w-full bg-gray-300 h-0.5 rounded-full" />
        <div className="flex justify-between items-center">
          <button className="text-[#4a7ba8]">
            <IoMdHelpCircle size={25} />
          </button>
          <p className="opacity-50">Ver. 1.0.0</p>
          <button className="" onClick={logOut}>
            <RiLogoutBoxLine size={25} />
          </button>
        </div>
      </div>
    </div>
  )
}
