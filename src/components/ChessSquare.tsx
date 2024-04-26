import React from 'react';
import {PieceType} from "../types/enums";
import {Pieces} from "../lib/Pieces";
import {useGameState} from "../providers/GameStateProvider";

interface ChessSquareProps {
    piece: PieceType;
    row: number;
    col: number;
}


const ChessSquare: React.FC<ChessSquareProps> = ({
                                                     piece,
                                                     row,
                                                     col,
                                                 }) => {

    const {movePiece, selectedPiece, setSelectedPiece, possibleMoves} = useGameState();

    const isSelected = row === selectedPiece?.row && col === selectedPiece?.col;
    const isPossibleMove = possibleMoves.some((move) => move.row === row && move.col === col);
    const canBeKilled = piece !== PieceType.EMPTY && isPossibleMove;

    return (
        <div
            onClick={() => {
                if (selectedPiece) {
                    movePiece(selectedPiece, {row, col});
                    setSelectedPiece(null);
                } else if (piece) {
                    setSelectedPiece({
                        row,
                        col,
                    });
                }
            }}
            className={`h-16 w-16  ${row % 2 === col % 2 ? "bg-gray-300" : "bg-gray-500"} ${isSelected ? "border-4 border-yellow-400" : ""}`}
        >
            <div
                className={`flex items-center justify-center w-full h-full ${canBeKilled ? "bg-red-500 opacity-50" : isPossibleMove ? "bg-green-500 opacity-50" : ""}`}
            >
                {
                    piece != PieceType.EMPTY && <img
                        // @ts-ignore
                        src={Pieces[piece].src as string}
                        alt={piece}
                        className={"h-10 w-10"}
                    />
                }

            </div>
        </div>
    );
}

export default ChessSquare;