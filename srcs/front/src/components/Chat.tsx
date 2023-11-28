import React, { useEffect, useSyncExternalStore } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FaWindowClose } from 'react-icons/fa'
import { RxHamburgerMenu } from 'react-icons/rx'

const Chat = () => {
  const [open, setOpen] = useState(true)

  const isOpen = () => {
    if (open) return 1
    else return 0
  }

  function burgerIcon() {
    return <RxHamburgerMenu />
  }

  function closeIcon() {
    return <FaWindowClose />
  }

  return (
    <div className="fixed inset-y-0 right-0 ">
      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
        <button
          type="button"
          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setOpen((open) => !open)}
        >
          <span className="absolute -inset-2.5" />
          <span className="sr-only">Close panel</span>
          {!isOpen ? (
            <FaWindowClose
              data-theme="cupcake"
              className="h-6 w-6 transition-opacity duration-300"
            />
          ) : (
            <RxHamburgerMenu
              data-theme="cupcake"
              className="h-6 w-6 transition-opacity duration-300"
            />
          )}
        </button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed">
            <div className="absolute">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative w-screen max-w-md">
                    <Transition.Child
                      enter="transition-opacity duration-75"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-150"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Contacts
                          </Dialog.Title>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <input
                            type="text"
                            placeholder="Search teams or members"
                            className="my-2 w-full text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
                          />
                          <div className="w-full">
                            <div className="flex cursor-pointer my-1 hover:bg-blue-lightest rounded">
                              <div className="w-8 h-10 text-center py-1">
                                <p className="text-3xl p-0 text-green-dark">
                                  &bull;
                                </p>
                              </div>
                              <div className="w-4/5 h-10 py-3 px-1">
                                <p className="hover:text-blue-dark">
                                  Kevin Durant
                                </p>
                              </div>
                              <div className="w-1/5 h-10 text-right p-3">
                                <p className="text-sm text-grey-dark">Member</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Transition.Child>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export { Chat }
