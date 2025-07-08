import React from 'react'
import Navbar from './../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <section className='flex flex-col items-center min-h-screen bg-[url("./bg_img.png")] bg-center bg-cover'>
    <Navbar/>
    <Header/>
    </section>
  )
}

export default Home;