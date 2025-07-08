import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContex';




const Header = () => {
  const {userData} = useContext(AppContext)
  
 
  return (
    <div className='container mx-auto flex flex-col items-center justify-center w-full h-[80vh]'>
        <img src={assets.header_img} alt="Header Image" className='object-contain w-44' />
        <h3 className='flex items-center justify-center gap-1.5 font-semibold text-2xl'>
            Hey {userData ? userData.name:"Developer"}!
            <img src={assets.hand_wave} alt="Hello" className='object-contain w-8 pt-4 pb-2'/>
        </h3>
        <h1 className='text-4xl font-bold mb-5'>Welcome to our app</h1>
        <p>Let's start with a quick product tour and we will have you up and running in no time!</p>
        
        <button className='border border-gray-500 mt-10 rounded-full px-6 py-2 hover:bg-gray-100 transition-all'>
        Get Starter
    </button>
            
    </div>
  )
}

export default Header;