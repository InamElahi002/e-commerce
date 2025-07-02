import React from 'react'
import './NewLetter.css'

const NewsLetter = () => {

  return (
    
    <div className='newletter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subcribe to our newsletter and saty updated</p>
      <div>

      <input type="email"  placeholder='Your Email id '/>
      <button>Subscribe</button>

      </div>
    </div>
    
  )
}

export default NewsLetter
