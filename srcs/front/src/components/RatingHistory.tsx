import React from 'react'

import { IUser } from '../types/User'

type RatingProps = {
  user: IUser
}

const RatingHistory: React.FC<RatingProps> = ({ user }) => {
  return (
    <div className='hero-overlay relative flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
      <div className='hero-content flex flex-col px-4 w-full'>
        <h4 className='mb-5 text-5xl font-bold text-purple-100 text-center'>Rating players</h4>
        <div className='flex flex-col m-6 scroll rounded-lg overflow-y-auto scrollbar-track-transparent scrollbar-thumb-gray-900 scrollbar-thin scrollbar-thumb-rounded-md h-2/3'>
          <table role='table'>
            <thead>
              <tr role='row'>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pl-1.5 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    You
                  </div>
                </th>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pl-8 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    Score
                  </div>
                </th>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pl-8 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    Ladder
                  </div>
                </th>
              </tr>
            </thead>
            <tbody role='rowgroup'>
              <tr role='row'>
                <td className='text-sm pt-2' role='cell'>
                  <div className='flex items-center pr-4'>
                    <img src={user.image} className='rounded-full w-10 h-10' alt='' />
                  </div>
                </td>
                <td className='text-sm pt-2' role='cell'>
                  <p className='text-md font-medium pl-9 text-purple-100 dark:text-white pr-8'>
                    9821
                  </p>
                </td>
                <td className='text-sm pt-2' role='cell'>
                  <p className='text-md font-medium text-purple-100 dark:text-white pl-12'>9825</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { RatingHistory }