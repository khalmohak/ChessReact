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
            </GameStateProvider>
        </div>
    );
}

//write

export default App;
