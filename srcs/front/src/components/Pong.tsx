import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/*Pour l'instant je suis un tuto pong qui se trouve ici: https://javascript.plainenglish.io/create-ping-pong-game-using-react-2d78c8e1cd9b
Je fais des tests pour voir me familiariser avec React et typescript
- Comment on va s'organiser pour le match making
- Estce que je dois decouper en plusieurs petit component le jeu de pong
	(exemple: 1 component pour le box, 1 component pour les raquettes)
Bwef voila ou j'en suis dans ma vie mdr c'est pas ouf
*/ 

const PADDLE_BOARD_SIZE = 3
const PADDLE_EDGE_SPACE = 1
const ROW_SIZE = 10
const COL_SIZE = 20
const board = [...Array(ROW_SIZE * COL_SIZE)]

const InitialState = () => {
    const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);
    return { 
        /* Paddle Array */
        player:   board.map(x => (x  * COL_SIZE) + PADDLE_EDGE_SPACE),    
        opponent: board.map(x => ((x+1) * COL_SIZE)-(PADDLE_EDGE_SPACE+1)),
        /* ball */
        ball:     Math.round((ROW_SIZE * COL_SIZE)/2)+ ROW_SIZE,          
        ballSpeed: 100,   // speed of ball
        deltaY:   -COL_SIZE, // change ball in Y AXIS
        deltaX:   -1, // change ball in  X AXIS
        /* pause */
        pause:     true, // pause the game
        /* Score */
        playerScore:   0,
        opponentScore: 0,
    }
}


const Pong = () => {
	return(
		<div>
			<p>Jeu de Pong</p>
			<p>Je viens du fichier "components/Pong.tsx"</p>
		</div>
	)
} 
export default Pong;