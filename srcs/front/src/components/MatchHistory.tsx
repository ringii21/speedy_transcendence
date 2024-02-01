import React from 'react'

import { IUser } from '../types/User'

type RatingProps = {
  user: IUser
}

const MatchHistory: React.FC<RatingProps> = ({ user }) => {
  return (
    <div className='hero w-1/2 mr-24 md:mr-0'>
      <div className='hero-overlay relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
        <div className='hero-content flex flex-col items-center  text-center text-neutral-content'>
          <h4 className='mb-5 text-3xl font-bold text-purple-100'>Match History</h4>
          <div className='flex flex-row scroll rounded-lg overflow-y-auto scrollbar-thumb-gray-900 scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md h-44'>
            <table role='table'>
              <thead>
                <tr role='row'>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='text-center m-6 uppercase tracking-wide text-purple-100 text-xs'>
                      You
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='text-center m-6 uppercase tracking-wide text-purple-100 text-xs'>
                      Score
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='`pb-2 text-center m-6 uppercase tracking-wide text-purple-100 text-xs'>
                      Adversary
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='`pb-2 mr-4 text-center uppercase tracking-wide text-purple-100 text-xs'>
                      Score
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody role='rowgroup'>
                <tr role='row'>
                  <td className='text-sm pt-2' role='cell'>
                    <img src={user.image} className='rounded-full w-10 ml-6' alt='' />
                  </td>
                  <td className='text-sm pt-2' role='cell'>
                    <p className='text-md font-medium text-purple-100 dark:text-white'>9821</p>
                  </td>
                  <td className='text-sm pt-2' role='cell'>
                    <img src={user.image} className='rounded-full w-10 ml-10' alt='' />
                  </td>
                  <td className='text-sm pt-2' role='cell'>
                    <p className='text-md font-medium text-purple-100 dark:text-white'>9821</p>
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

export { MatchHistory }
