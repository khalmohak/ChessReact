import React from 'react';
import {generateRandomBoard, generateNewBoard, PLAYER_COLORS} from "./Pieces";
import ChessBoard from "./components/ChessBoard";


function App() {
    const [board, setBoard] = React.useState<string[][]>(generateNewBoard());
    const [currentPlayer, setCurrentPlayer] = React.useState<string>(PLAYER_COLORS.WHITE);
   
    // 

    return (
        <div
            className="flex flex-col h-screen items-center justify-center bg-gray-800 pt-10"
        >
            <ChessBoard
                board={board}
                currentPlayer={currentPlayer}
                setBoard={setBoard}
            />
            <div
                className="flex items-center justify-center mt-10"
            >
                <button
                    className={"mr-2 text-xl text-white"}
                    onClick={() => setBoard(generateNewBoard())}
                >
                    Reset
                </button>
                <button
                    className={"mr-2 text-xl text-white"}
                    onClick={() => setBoard(generateRandomBoard())}
                >
                    Randomize
                </button>
            </div>
        </div>
    );
}

//write

export default App;
