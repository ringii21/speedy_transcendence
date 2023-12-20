import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { InitialState } from './InitialState'

const Grid = () => {
  // Style pour le Grid
  const gridStyle: React.CSSProperties = {
    position: 'relative',
    border: '1px solid #000000',
    backgroundColor: '#d0d0d0',
    width: '85vw', // par exemple, 80% de la largeur de la vue
    height: '60vh', // par exemple, 80% de la hauteur de la vue
    margin: '0 auto', // Centrer le Grid
  }

  const netStyle: React.CSSProperties = {
    position: 'absolute',
    width: '2px',
    height: '100%',
    backgroundColor: 'white',
    left: '50%',
    transform: 'translateX(-50%)',
  }

  return (
    <div style={gridStyle}>
      <div style={netStyle}></div>
      {/* Autres éléments du Grid */}
    </div>
  )
}

export { Grid }
