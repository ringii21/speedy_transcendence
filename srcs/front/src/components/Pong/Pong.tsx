import { useCallback, useEffect, useRef, useState } from 'react'
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs'
import { Circle, Image, Layer, Line, Rect, Stage } from 'react-konva'
import { useLocation, useNavigate } from 'react-router-dom'

import { WithNavbar } from '../../hoc/WithNavbar'
import { useGameSocket } from '../../providers/GameSocketProvider'
import { useGameState } from './States/GameState'

const DURATION = 20
type Cords = {
  x: number
  y: number
  ballsize: number
  p1Score: number
  p2Score: number
}

const throttle = (function () {
  let timeout: any = undefined
  return function throttle(callback: any) {
    if (timeout === undefined) {
      callback()
      timeout = setTimeout(() => {
        timeout = undefined
      }, DURATION)
    }
  }
})()

function throttlify(callback: any) {
  return function throttlified(event: any) {
    throttle(() => {
      callback(event)
    })
  }
}

export const Game = () => {
  const [ballImage, setBallImage] = useState<HTMLImageElement | null>(null)
  const gameState = useGameState()
  const { socket, isConnected } = useGameSocket()
  const [level, setLevel] = useState(1)
  const [t, setT] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const leave = useCallback(() => {
    socket?.emit('leave')
    gameState.setEnd(true)
    // eslint-disable-next-line
  }, []);

  /* useEffect(() => {
    return leave()
  }, [leave]) */
  const handleMove = throttlify((e: any) => {
    socket?.emit('mouse', e.evt.layerY)
  })
  const ArrowUp = () => {
    socket?.emit('up')
    socket?.off('up')
  }
  const ArrowDown = () => {
    socket?.emit('down')
    socket?.off('down')
  }

  useEffect(() => {
    /* const img = new window.Image()
    img.src = '../../assets/balle-pong.png'
    img.onload = () => setBallImage(img) */
    /* const img = new Image()
    img.src = '../../assets/balle-pong.png'
    img.onload = () => setImage(img) */
    socket?.on('level', (l: number) => {
      setLevel(l)
    })
    socket?.on('t', (t: number) => {
      setT(t)
    })
    socket?.on('game.end', () => {
      gameState.setEnd(true)
    })
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') socket?.emit('up')
      if (event.key === 'ArrowDown') socket?.emit('down')
    })
    socket?.on('ball', (cord: Cords) => {
      gameState.setBall({
        x: cord.x,
        y: cord.y,
        size: cord.ballsize,
        p1Score: cord.p1Score,
        p2Score: cord.p2Score,
      })
    })
    socket?.on('paddle', (paddles: any) => {
      gameState.setLPaddle(paddles.p1PaddleY)
      gameState.setRPaddle(paddles.p2PaddleY)
      if (gameState?.side !== paddles.side) gameState.setSide(paddles.side)
    })
    socket?.on('screen Error', () => {
      navigate('/')
    })
    socket?.on('players', (players: any) => {
      gameState.setP1(players[0])
      gameState.setP2(players[1])
    })
    return () => {
      socket?.off('ball')
      socket?.off('mouse')
      socket?.off('down')
      socket?.off('up')
      socket?.off('leave')
      socket?.off('level')
      socket?.off('t')
      socket?.off('game.end')

      window.removeEventListener('keydown', () => {
        return
      })
    }
    // eslint-disable-next-line
  }, []);
  /* eslint-disable */
  useEffect(() => {
    if (!gameState.p1) navigate("/");
    const divh = document.getElementById("Game")?.offsetHeight;
    const divw = document.getElementById("Game")?.offsetWidth;
    socket?.emit("screen", { h: divh, w: divw });
    gameState.setEnd(false);
    if (divw) {
      divw <= 742 ? gameState.setMobile(true) : gameState.setMobile(false);
    }
    window.addEventListener("resize", () => {
      gameState.setEnd(false);
      const divh = document.getElementById("Game")?.offsetHeight;
      const divw = document.getElementById("Game")?.offsetWidth;
      const aspectRatio = 16 / 9;
      const newWidth = divw ?? 0;
      const newHeight = newWidth / aspectRatio;
      socket?.emit("screen", { h: newHeight, w: newWidth });
      if (divh) gameState.setHeight(newHeight);
      if (divw) {
        gameState.setWidth(divw);
        divw <= 742 ? gameState.setMobile(true) : gameState.setMobile(false);
      }
    });

    return () => {
      socket?.off("screen");
      window.removeEventListener("resize", () => {});
    };
    // disable eslit next line
  }, []);

  useEffect(() => {
    const divh = document.getElementById("Game")?.offsetHeight;
    const divw = document.getElementById("Game")?.offsetWidth;

    const aspectRatio = 16 / 9;
    const newWidth = divw ?? 0;
    const newHeight = newWidth / aspectRatio;
    if (divh) gameState.setHeight(newHeight);
    if (divw) gameState.setWidth(divw);
  }, [gameState.width, gameState.height]);

  return (
    <div className="flex flex-col gap-10 justify-start md:justify-center md:items-center items-center pt-12 md:pt-0  h-full w-full">
      <div className="flex items-center justify-center gap-x10 w-full xl:pt-4">
        <div className="flex items-center justify-center w-1/4 gap-6">
          <div className="flex flex-col items-center justify-center w-1/4">
{/*             <img
              alt=""
              className="rounded-full w-auto h-auto max-w-[10vw] md:max-w-[20vw]"
              src={gameState?.p1?.image}
            /> */}
            <span>{ gameState?.p1?.username }</span>
            <span className="font-lexend font-extrabold text-[4vw] xl:text-[2vw] text-current">
                {gameState.ball.p1Score}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 gap-6">
          <div className="flex flex-col items-center justify-center w-1/4">
{/*             <img
              alt="avatar"
              className="rounded-full w-auto h-auto max-w-[10vw] md:max-w-[20vw]"
              src={gameState?.p2?.image}
            /> */}
            <span>{ gameState?.p2?.username }</span>
            <span className="font-lexend font-extrabold text-[4vw] xl:text-[2vw] text-current">
                {gameState?.ball.p2Score}
            </span>
          </div>
        </div>
        <button className="btn" onClick={leave}>
          Leave
        </button>
      </div>
      <div className="flex justify-center items-center flex-col">
        <div className="font-poppins text-neutral font-medium">
          {t > 0 ? `next level start after ${t}` : `level ${level}`}
        </div>
      </div>
      <div
        className="flex items-center justify-center min-h-16 max-h-[80%] max-w-[800px] 3xl:max-w-[1150px] min-w-92 w-[95%] rounded-xl aspect-video border-1"
        id="Game"
      >
        <Stage
          onMouseMove={handleMove}
          width={gameState.width}
          height={gameState.height}
          style={{
            borderWidth: "4px",
            borderColor: "white",
            borderRadius: "4px",
          }}
        >
          <Layer>
            <Rect
              height={gameState.height}
              width={gameState.width}
              fill="#151B26"
              x={0}
              y={0}
            />
            <Line
              points={[0, gameState.height, 0, 0]}
              dash={[gameState.height / 30, 10]}
              strokeWidth={2}
              stroke={"white"}
              height={gameState.height}
              width={20}
              fill="white"
              x={gameState.width / 2}
              y={0}
            />
            <Rect
              cornerRadius={12}
              height={gameState.height / 6}
              width={gameState.width / 70}
              x={gameState.width / 100}
              y={gameState.lPaddle}
              fill="white"
            />
            <Rect
              cornerRadius={12}
              height={gameState.height / 6}
              width={gameState.width / 70}
              x={gameState.width - gameState.width / 100 - gameState.width / 70}
              y={gameState.rPaddle}
              fill="white"
            />
            <Circle
              fill="white"
              height={gameState.ball.size}
              width={gameState.ball.size}
              x={gameState.ball.x}
              y={gameState.ball.y}
            />
            {/* { ballImage && (
              <Image
                image={ballImage}
                x={gameState.ball.x}
                y={gameState.ball.y}
                height={gameState.ball.size}
                width={gameState.ball.size}
              />
              )
            } */}
          </Layer>
        </Stage>
      </div>
      {gameState.mobile && (
        <div className="flex justify-around items-center w-full gap-20">
          <BsFillArrowLeftCircleFill
            onClick={ArrowUp}
            className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100 "
          />
          <BsFillArrowRightCircleFill
            onClick={ArrowDown}
            className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100"
          />
        </div>
      )}
    </div>
  );
};

const GameWithNavbar = WithNavbar(Game)
export { GameWithNavbar }