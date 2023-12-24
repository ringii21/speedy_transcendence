import React, { ComponentType } from 'react'

import { Navbar } from '../components/Navbar'

const WithNavbar = <P extends object>(Component: ComponentType<P>) => {
  const displayName = Component.displayName || Component.name || 'Component'
  const ComponentWithNavbar: React.FC<P> = (props: P) => {
    return (
      <div className='w-screen'>
        <Navbar />
        <main className='relative'>
          <Component {...props} />
        </main>
      </div>
    )
  }
  ComponentWithNavbar.displayName = `WithNavbar(${displayName})`
  return React.memo(ComponentWithNavbar)
}

export { WithNavbar }
