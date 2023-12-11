import './../styles/footer.css'

import React from 'react'

const Footer = () => {
  return (
    <footer className='footer bg-white footer-center fixed bottom-0 py-6'>
      <div className='container mx-auto px-6'>
        <div className='mt-16 border-t-2 border-gray-300 flex flex-col items-center'>
          <div className='sm:w-2/3 text-center py-6'>
            <p className='text-sm text-blue-700 font-bold'>Transcendence © 2023 by 42Students</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
