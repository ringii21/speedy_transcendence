import React from 'react'

import { IUser } from '../types/User'

type MatchProps = {
  user: IUser
}

const MatchHistory: React.FC<MatchProps> = ({ user }) => {
  return (
    <div className='hero-overlay relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
      <div className='hero-content text-center text-neutral-content'>
        <div className='pt-4'>
          <h4 className='mb-5 text-5xl font-bold text-purple-100'>Match History</h4>
          <div className='flex flex-row justify-around items-align scroll rounded-lg p-10 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-gray-700 scrollbar-thin scrollbar-thumb-rounded h-60'>
            <table role='table'>
              <thead>
                <tr role='row'>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex items-center pb-2 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs mr-10'>
                      You
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex pb-2 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs mr-10'>
                      Score
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex pb-2 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs mr-10'>
                      Adversary
                    </div>
                  </th>
                  <th role='columnheader' title='Toggle SortBy'>
                    <div className='flex pb-2 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs mr-10'>
                      Score
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody role='rowgroup'>
                <tr role='row'>
                  {/************* USER HOST **************************/}
                  <td className='text-sm pt-2' role='cell'>
                    <div className='flex items-center mr-10'>
                      <img src={user.image} className='rounded-full w-10 h-10' alt='' />
                    </div>
                  </td>
                  <td className='text-sm pt-2' role='cell'>
                    <p className='text-md font-medium text-purple-100 mr-10'>9821</p>
                  </td>
                  {/************* FAKE USER **************************/}
                  <td className='text-sm pt-2' role='cell'>
                    <div className='flex items-center mr-10'>
                      <img
                        src='https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2244&amp;q=80'
                        className='rounded-full w-10 h-10'
                        alt=''
                      />
                    </div>
                  </td>
                  <td className='text-sm pt-2' role='cell'>
                    <p className='text-md font-medium text-purple-100 break-all mr-10'>9821</p>
                  </td>
                  {/***************************************************/}
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
