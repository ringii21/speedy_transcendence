import React from 'react'

import { IUser } from '../types/User'

type RatingProps = {
  user: IUser
}

const RatingHistory: React.FC<RatingProps> = ({ user }) => {
  return (
    <div className='hero w-1/2 ml-2'>
      <div className='hero-overlay relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
        <div className='hero-content flex flex-col items-center  text-center text-neutral-content'>
          <h4 className='mb-5 text-3xl font-bold text-purple-100'>Rating players</h4>
          <div className='flex flex-row scroll rounded-lg overflow-y-auto scrollbar-thumb-gray-900 scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md h-44'>
            <table role='table'>
              <thead>
                <tr role='row'>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='text-center pt-2 pb-2 pl-12 pr-12 uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                      You
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex pb-2 pt-2 pr-12 text-center pl-12 uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                      Score
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex pb-2 pt-2 pr-12 text-center pl-12 uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                      Ladder
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody role='rowgroup'>
                <tr role='row'>
                  <td className='text-sm' role='cell'>
                    <img src={user.image} className='rounded-full w-10 ml-12' alt='' />
                  </td>
                  <td className='text-sm' role='cell'>
                    <p className='text-md font-medium text-purple-100 dark:text-white'>9821</p>
                  </td>
                  <td className='text-sm' role='cell'>
                    <p className='text-md font-medium text-purple-100 dark:text-white'>9825</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export { RatingHistory }
