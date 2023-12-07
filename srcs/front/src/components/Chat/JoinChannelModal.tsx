import { Dialog, Transition } from '@headlessui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form'

import { getPubChannels, joinChannel } from '../../utils/chatHttpRequests'

type CreateChannelModalProps = {
  isJoinModalOpen: boolean
  setJoinModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValues = {
  id: number
}

const JoinChannelModal = ({
  isJoinModalOpen: isOpen,
  setJoinModalOpen: setIsOpen,
}: CreateChannelModalProps) => {
  const { register, handleSubmit } = useForm<FormValues>({})

  const notJoinedChannels = useQuery({
    queryKey: ['channels', 'not-joined'],
    queryFn: getPubChannels,
  })

  const joinChan = useMutation({
    mutationKey: ['channels', 'joined'],
    mutationFn: joinChannel,
  })

  const buttonStyle = clsx({
    ['btn']: true,
    ['btn-disabled']: notJoinedChannels.isPending,
  })

  const onSubmit = (data: FormValues) => {
    joinChan.mutate(data.id)
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-box">
                <Dialog.Title as="h3" className="font-bold text-lg">
                  Join a channel
                </Dialog.Title>
                <div className="modal-action">
                  <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-control">
                        <label className="label" htmlFor="name">
                          <span className="label-text">Channel name</span>
                        </label>
                        <select
                          id="id"
                          {...register('id', { required: true })}
                          className="select select-bordered w-full max-w-xs"
                        >
                          {notJoinedChannels.isPending && (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                          {notJoinedChannels.data?.length === 0 && (
                            <option value="" disabled>
                              No available channels
                            </option>
                          )}
                          {notJoinedChannels.data?.map((channel) => (
                            <option key={channel.id} value={channel.id}>
                              {channel.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-evenly mt-4">
                        <button
                          type="submit"
                          className={`${buttonStyle} btn-success`}
                        >
                          Join
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className={`${buttonStyle} btn-error`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export { JoinChannelModal }
