'use client'
import CursorFollower from '@/components/HeroPage/CursorFollower'
import Hero from '@/components/HeroPage/Hero';
import { Navbar } from '@/components/HeroPage/navbar';
// import { Navbar } from '@/components/HeroPage/navbar'
import { AuthContext } from '@/context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

function Page() {
  const { user, loading, logout } = useContext(AuthContext);
  
  return (
    <div className='mx-auto '>
      <Navbar/>
      <CursorFollower />
      <Hero/>

    </div>
  )
}

export default Page

// import React from 'react'

// function page() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default page
