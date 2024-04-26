import React, {useEffect, useState} from 'react';
import ChessSquare from "./ChessSquare";
import {useGameState} from "../providers/GameStateProvider";
import {PieceType} from "../types/enums";
import {Pieces} from "../lib/Pieces";

const ChessBoard: React.FC = () => {
    const {
        board,
        currentPlayer,
        resetBoard,
        setRandomBoard,
        blackCapturedPieces,
        whiteCapturedPieces,
        undoMove
    } = useGameState();

    return (
        <div
            className="flex flex-col items-center justify-center"
        >
            <div
                className="text-white text-2xl mb-5"
            >
                {currentPlayer === "white" ? "White's Turn" : "Black's Turn"}
            </div>

            <div className="grid grid-cols-8 grid-rows-8">
                {board.map((row, i) => {
                    return row.map((piece, j) => {
                        return <ChessSquare
                            key={`${i}${j}`}
                            piece={piece}
                            row={i}
                            col={j}
                        />
                    });
                })}
            </div>
            <div
                className="flex items-center justify-center mt-10"
            >
                <button
                    className={"mr-2 text-xl text-white"}
                    onClick={resetBoard}
                >
                    Reset
                </button>
                <button
                    className="mr-2 text-xl text-white"
                    onClick={undoMove}
                >
                    Undo
                </button>
                <button
                    className={"mr-2 text-xl text-white"}
                    onClick={setRandomBoard}
                >
                    Randomize
                </button>
            </div>

            {/*    Captured pieces*/}
            <div
                className="flex justify-center mt-10"
            >
                <div
                    className="flex flex-col items-center mr-10"
                >
                    <div
                        className="text-white text-xl"
                    >
                        White Captured Pieces
                    </div>
                    <div
                        className="flex flex-wrap"
                    >
                        {whiteCapturedPieces.map((piece, i) => {
                            return <img
                                key={i}
                                // @ts-ignore
                                src={Pieces[piece].src}
                                // @ts-ignore
                                alt={Pieces[piece].name}
                                className="h-10 w-10"
                            />
                        })}
                    </div>
                </div>
                <div
                    className="flex flex-col items-center"
                >
                    <div
                        className="text-white text-xl"
                    >
                        Black Captured Pieces
                    </div>
                    <div
                        className="flex flex-wrap"
                    >
                        {blackCapturedPieces.map((piece, i) => {
                            return <img
                                key={i}
                                // @ts-ignore
                                src={Pieces[piece].src}
                                // @ts-ignore
                                alt={Pieces[piece].name}
                                className="h-10 w-10"
                            />
                        })}
                    </div>
                </div>

            </div>
        </div>

    );
}

export default ChessBoard;