import React from 'react'
import { FaPlus, FaLock } from "react-icons/fa";
const Sidebar = ({user}) => {
  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      <div className="py-4 border-b border-gray-700">
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-green-500"> <FaPlus size={20} /></div>
      </div>
      {/* <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
          <FaPlus size={20} />
        </button> */}

  
    <img
          src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?ga=GA1.1.1544579063.1739811380&semt=ais_hybrid"
          alt="Server Icon"
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
        />
        <img
          src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg"
          alt="Server Icon"
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
        />
         
    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
    <div className="mt-auto mb-4">
    <img
          src={user.avatar}
          alt="Server Icon"
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
        />
        </div>
  </div>
  )
}

export default Sidebar