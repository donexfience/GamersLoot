import React from 'react'
import Checkoutradio from './components/Checkoutradio'
import AddressCheckout from './components/AddressCheckout'
import Addaddress from './pages/Addaddress'

const Checkout = () => {
  return (
    <div>
        <AddressCheckout/>
        <Checkoutradio/>
        <Addaddress/>
    </div>
  )
}

export default Checkout