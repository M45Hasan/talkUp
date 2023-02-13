import React from 'react'

const Header = ({heading,sub}) => {
  return (
    <div className='text-center'>
    <h1 className='font-nuni font-bold text-[#11175D] text-2xl'>{heading}</h1>
    <p className='font-nuni font-normal text-[14px] text-[#11175d80]'>{sub}</p>
    
    
    </div>
  )
}

export default Header