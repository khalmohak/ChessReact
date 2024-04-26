import React from 'react';
import {PIECES} from "../Pieces";

interface ChessSquareProps {
    piece: string;
    i: number;
    j: number;
    selectedPiece: number[] | null;
    setSelectedPiece: (piece: number[]) => void;
    isPossibleMove: boolean;
    movePiece: (i:number, j:number) => void;
}


const ChessSquare: React.FC<ChessSquareProps> = ({
                                                     piece,
                                                     i,
                                                     j,
                                                     selectedPiece,
                                                     setSelectedPiece,
                                                     isPossibleMove,
                                                     movePiece
                                                 }) => {


    const isSelected = i === selectedPiece?.[0] && j === selectedPiece?.[1];
    const canBeKilled = isPossibleMove && piece;

    return (
        <div 
        key={`${i}-${j}`}
        onClick={() => {
            console.log("clicked", i, j);
                    if (isPossibleMove) {
                        movePiece(i, j);
                        return;
                    }

                    if (piece) {
                        setSelectedPiece([i, j]);
                    }
                }}
        className={`h-16 w-16  ${i % 2 === j % 2 ? "bg-gray-300" : "bg-gray-500"} ${isSelected ? "border-4 border-yellow-400" : ""}`}
        >
            <div
                className={`flex items-center justify-center w-full h-full ${canBeKilled ? "bg-red-500 opacity-50" : isPossibleMove? "bg-green-500 opacity-50" :""}`}
            >
            {
                PIECES[piece] ? <img
                    src={PIECES[piece]['src']}
                    alt={piece}
                    className={"h-10 w-10"}
                    
                   
                /> : ""
            }
            </div>
        </div>
    );
}

export default ChessSquare;