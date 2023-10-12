import React from 'react'
import { useSelector } from 'react-redux'


export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className=' font-bold text-2xl text-center '>Profile</h1>
      <form className=' mt-6 flex flex-col gap-3'>
        <img src={currentUser.avatar} alt="Profile" className=' rounded-full mx-auto h-24 w-24 object-cover cursor-pointer' />
        <input type="text" placeholder='username' id='username' className=' p-3 rounded-lg border'/>
        <input type="email" placeholder='email' id='email' className=' p-3 rounded-lg border'/>
        <input type="password" placeholder='password' id='password' className=' p-3 rounded-lg border'/>
        <button className=' bg-slate-800 text-white rounded-lg p-3 uppercase disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className=' text-red-800 cursor-pointer'>Delete Account</span>
        <span className=' text-red-800 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
