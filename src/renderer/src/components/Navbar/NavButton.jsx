import { Link } from 'react-router-dom'

export const NavButton = ({ title, icon, onClick, link }) => {
  return (
    <Link to={link}>
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer hover:bg-[#4a7ba8] px-3 py-2 rounded-md text-black hover:text-white transition-colors duration-75 gap-4"
      >
        {icon}
        <p className="">{title}</p>
      </button>
    </Link>
  )
}
