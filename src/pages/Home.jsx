import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Feature from '../components/Feature'
import Values from '../components/Values'
import Banner from '../components/Banner'
import Products from '../components/Products'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div style={{ background: '#fff' }}>
        <Feature />
        <Values />
        <Banner />
        <Products />
        <Contact />
      </div>
      <Footer />
    </>
  )
}
