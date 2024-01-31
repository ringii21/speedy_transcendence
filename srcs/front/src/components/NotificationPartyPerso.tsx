import { Transition } from '@headlessui/react'
import React from 'react'

type NotificationPartyPersoModalProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  errorMessage: string
}

const NotificationPartyPersoModal: React.FC<NotificationPartyPersoModalProps> = ({
  openModal,
  setOpenModal,
  errorMessage,
}) => {
  return (
    <Transition show={openModal}>
      <div className='absolute top-0 right-0 mt-4 mr-4 bg-white shadow-lg rounded-lg p-4 z-50'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-800'>{errorMessage}</span>
          <button onClick={() => setOpenModal(false)} className='text-gray-600 hover:text-gray-800'>
            &times;
          </button>
        </div>
      </div>
    </Transition>
  )
}

export { NotificationPartyPersoModal }
