import React from 'react'

import { IUser } from '../types/User'

type RatingProps = {
  user: IUser
}

const RatingHistory: React.FC<RatingProps> = ({ user }) => {
  return (
    <div className='hero-overlay relative flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
      <div className='hero-content flex flex-col overflow-x-scroll px-4 md:overflow-x-hidden w-full'>
        <h4 className='mb-5 text-5xl font-bold text-purple-100 text-center'>Rating players</h4>
        <table role='table' className='overflow-x-scroll'>
          <thead>
            <tr role='row'>
              <th role='columnheader' title='Toggle SortBy'>
                <div className='flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                  You
                </div>
              </th>
              <th role='columnheader' title='Toggle SortBy'>
                <div className='flex items-center justify-between pb-2 pt-4 pl-8 text-start uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                  Score
                </div>
              </th>
              <th role='columnheader' title='Toggle SortBy'>
                <div className='flex items-center justify-between pb-2 pt-4 pl-8 text-start uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                  Ladder
                </div>
              </th>
            </tr>
          </thead>
          <tbody role='rowgroup'>
            <tr role='row'>
              <td className='text-sm' role='cell'>
                <div className='flex items-center pr-4'>
                  <img src={user.image} className='rounded-full w-10 h-10' alt='' />
                </div>
              </td>
              <td className='text-sm' role='cell'>
                <p className='text-md font-medium pl-9 text-purple-100 dark:text-white pr-8'>
                  9821
                </p>
              </td>
              <td className='text-sm' role='cell'>
                <p className='text-md font-medium text-purple-100 dark:text-white pl-12'>9821</p>
              </td>
              {/* <td className='py-3 text-sm' role='cell'>
                <div className='mx-2 flex font-bold'>
                  <div className='h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-700'>
                    <div
                      className='flex h-full items-center justify-center rounded-md bg-brand-500 dark:bg-brand-400'
                      style={{ width: '30%' }}
                    ></div>
                  </div>
                </div>
              </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { RatingHistory }
