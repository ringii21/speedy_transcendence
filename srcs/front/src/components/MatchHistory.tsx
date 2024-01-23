import React from 'react'

import { IUser } from '../types/User'

type MatchProps = {
  user: IUser
}

const MatchHistory: React.FC<MatchProps> = ({ user }) => {
  return (
    <div className='hero-overlay relative flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'>
      <div className='hero-content flex flex-col px-4 w-full'>
        <h4 className='mb-5 text-5xl font-bold text-purple-100 text-center'>Match History</h4>
        <div className='flex flex-col m-6 scroll rounded-lg overflow-y-auto scrollbar-track-transparent scrollbar-thumb-gray-900 scrollbar-thin scrollbar-thumb-rounded-md h-2/3 '>
          <table role='table'>
            <thead>
              <tr role='row'>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pt-4 ml-4 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    You
                  </div>
                </th>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pt-4 pl-4 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    Score
                  </div>
                </th>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pt-4 ml-4 pr-4 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    Adversary
                  </div>
                </th>
                <th role='columnheader' title='Toggle SortBy'>
                  <div className='flex items-center justify-between pb-2 pt-4 mr-4 text-center uppercase tracking-wide text-purple-100 sm:text-xs lg:text-xs'>
                    Score
                  </div>
                </th>
              </tr>
            </thead>
            <tbody role='rowgroup'>
              <tr role='row'>
                {/************* USER HOST **************************/}
                <td className='text-sm' role='cell'>
                  <div className='flex items-center pr-2 ml-3'>
                    <img src={user.image} className='rounded-full w-10 h-10' alt='' />
                  </div>
                </td>
                <td className='text-sm pl-2' role='cell'>
                  <p className='text-md font-medium text-purple-100 pl-4'>9821</p>
                </td>
                {/************* FAKE USER **************************/}
                <td className='text-sm' role='cell'>
                  <div className='flex items-center pl-7 mr-3'>
                    <img
                      src='https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2244&amp;q=80'
                      className='rounded-full w-10 h-10'
                      alt=''
                    />
                  </div>
                </td>
                <td className='text-sm pl-2' role='cell'>
                  <p className='text-md font-medium text-purple-100 break-all'>9821</p>
                </td>
                {/***************************************************/}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { MatchHistory }
