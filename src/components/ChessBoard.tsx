import React, { useEffect, useState } from 'react';
import ChessSquare from "./ChessSquare";

interface ChessBoardProps {
    board: string[][];
    setBoard: (board: string[][]) => void;
    currentPlayer: string;
}

const ChessBoard: React.FC<ChessBoardProps> = ({board, currentPlayer, setBoard}) => {
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<number[][]>([]);

    useEffect(() => {
        if (!selectedPiece) {
            return;
        }
        const [i, j] = selectedPiece;
        const piece = board[i][j];
        const possibleMoves = calulatePossibleMoves(piece, i, j);
        setPossibleMoves(possibleMoves);
    }, [selectedPiece]);

    const calulatePossibleMoves = (piece: string, i: number, j: number) => {
        const possibleMoves: number[][] = [];
        switch (piece) {
            case "wP":
                if (i === 1) {
                    possibleMoves.push([i + 1, j]);
                    possibleMoves.push([i + 2, j]);
                } else {
                    possibleMoves.push([i + 1, j]);
                }
                break;
            case "bP":
                if (i === 6) {
                    possibleMoves.push([i - 1, j]);
                    possibleMoves.push([i - 2, j]);
                } else {
                    possibleMoves.push([i - 1, j]);
                }
                break;
            case "wR":
            case "bR":
            case "wB":
            case "bB":
            case "wQ":
            case "bQ":
            case "wK":
            case "bK":
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        possibleMoves.push([i, j]);
                    }
                }
                break;
            case "wN":
            case "bN":
                possibleMoves.push([i + 2, j + 1]);
                possibleMoves.push([i + 2, j - 1]);
                possibleMoves.push([i - 2, j + 1]);
                possibleMoves.push([i - 2, j - 1]);
                possibleMoves.push([i + 1, j + 2]);
                possibleMoves.push([i + 1, j - 2]);
                possibleMoves.push([i - 1, j + 2]);
                possibleMoves.push([i - 1, j - 2]);
                break;
        }
        return possibleMoves;
    }

    const movePiece = (i: number, j: number) => {
        console.log("moving piece", i, j);
        const [selectedI, selectedJ] = selectedPiece!;
        const piece = board[selectedI][selectedJ];
        const newBoard = board.map(row => [...row]);
        newBoard[i][j] = piece;
        newBoard[selectedI][selectedJ] = "";
        setBoard(newBoard);
    }

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
                            piece={piece}
                            i={i}
                            j={j}
                            selectedPiece={selectedPiece}
                            setSelectedPiece={setSelectedPiece}
                            isPossibleMove={possibleMoves.findIndex(move=>move[0]===i && move[1]===j) !== -1}
                            movePiece={movePiece}
                        />
                    });
                })}
            </div>
        </div>

    );
}

export default ChessBoard;