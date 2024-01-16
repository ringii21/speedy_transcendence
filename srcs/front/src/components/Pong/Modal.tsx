import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { useGameSocket } from '../../providers/GameSocketProvider'
import { useGameState } from './States/GameState'
export const Modal = () => {
  const gameState = useGameState()
  const [opacity, setOpacity] = useState('')
  const [resOpacity, setResOpacity] = useState('')
  const [result, setResutl] = useState<undefined | string>(undefined)
  const [status, setStatus] = useState<undefined | string>(undefined)
  const [timer, setTimer] = useState<undefined | number>(undefined)
  const [gameid, setGameId] = useState<undefined | string>(undefined)
  const [gameName, setGameName] = useState<undefined | string>(undefined)
  const { socket, isConnected } = useGameSocket()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (!location.pathname.startsWith('/Game')) {
      socket?.emit('game.stop', { gameid: gameName, gameState: gameState })
    }
  }, [location])
  useEffect(() => {
    /* const { user } = useAuth() */
    if (socket !== null) {
      socket?.on('game.launched', (GameId: any) => {
        setGameName(GameId)
        setGameId(GameId.slice(5))
      })
      socket?.on('timer', (msg: any) => {
        msg !== 0 && setOpacity('opacity-100')
        msg === 0 && setOpacity('opacity-0')
        setTimer(msg / 1000)
        if (timer === 5) {
          navigate(`/game/${gameid}`)
        }
      })
      socket?.on('players', (players: any) => {
        gameState.setP1(players[0])
        gameState.setP2(players[1])
      })
      socket?.on('win', (msg: string) => {
        setResutl(msg)
        setStatus('win')
        setResOpacity('opacity-100')
        let count = 2
        setTimer(count)
        const inter = setInterval(() => {
          setTimer(count)
          --count
          if (count === -1) {
            setResOpacity('opacity-0')
            clearInterval(inter)
            navigate('/')
          }
        }, 1000)
      })
      socket?.on('lose', (msg: string) => {
        setResutl(msg)
        setStatus('lose')
        setResOpacity('opacity-100')
        let count = 2
        setTimer(count)
        const inter = setInterval(() => {
          setTimer(count)
          --count
          if (count === -1) {
            setResOpacity('opacity-0')
            clearInterval(inter)
            navigate('/')
          }
        }, 1000)
      })
    }
    return () => {
      /* socket?.emit('game.stop', { gameid: gameid , user: user  }) */
      socket?.off('lose')
      socket?.off('win')
      socket?.off('timer')
      socket?.off('game.launched')
      socket?.off('players')
    }
    // eslint-disable-next-line
  }, [timer]);

  return (
    <>
      <div className={`modal ${opacity}`}>
        <div className='modal-box'>
          <h3 className='text-lg font-bold'>Game Starting .... </h3>
          <p className='py-4 flex items-center justify-center text-xl font-poppins font-bold'>
            Game Start In {timer}
          </p>
        </div>
      </div>
      <div className={`modal ${resOpacity}`}>
        <div className='modal-box'>
          <h3 className='text-lg font-bold'>You {status}</h3>
          <p className='py-4 flex items-center justify-center text-xl font-poppins font-bold'>
            {result}{' '}
          </p>
          <p className='py-4 flex items-center justify-center text-xl font-poppins font-bold'>
            this window will be dismiss in {timer}{' '}
          </p>
        </div>
      </div>
    </>
  )
}
