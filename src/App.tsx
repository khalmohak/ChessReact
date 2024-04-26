import React from 'react';
import ChessBoard from "./components/ChessBoard";
import {GameStateProvider} from "./providers/GameStateProvider";


function App() {
    return (
        <div
            className="flex flex-col h-screen items-center justify-center bg-gray-800 pt-10"
        >
            <GameStateProvider>
                <ChessBoard/>
                {/*<div*/}
                {/*    className="flex items-center justify-center mt-10"*/}
                {/*>*/}
                {/*    <button*/}
                {/*        className={"mr-2 text-xl text-white"}*/}
                {/*        onClick={() => setBoard(generateNewBoard())}*/}
                {/*    >*/}
                {/*        Reset*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*        className={"mr-2 text-xl text-white"}*/}
                {/*        onClick={() => setBoard(generateRandomBoard())}*/}
                {/*    >*/}
                {/*        Randomize*/}
                {/*    </button>*/}
                {/*</div>*/}
            </GameStateProvider>
        </div>
    );
}

//write

export default App;
