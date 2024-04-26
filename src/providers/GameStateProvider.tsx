import React, {createContext, useContext, useState} from 'react';
import {PieceType, PlayerColors} from "../types/enums";

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{
    children: React.ReactNode;
}> = ({children}) => {
    const [board, setBoard] = useState<PieceType[][]>([
        [PieceType.BLACK_ROOK, PieceType.BLACK_KNIGHT, PieceType.BLACK_BISHOP, PieceType.BLACK_KING, PieceType.BLACK_QUEEN, PieceType.BLACK_BISHOP, PieceType.BLACK_KNIGHT, PieceType.BLACK_ROOK],
        new Array(8).fill(PieceType.BLACK_PAWN),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.WHITE_PAWN),
        [PieceType.WHITE_ROOK, PieceType.WHITE_KNIGHT, PieceType.WHITE_BISHOP, PieceType.WHITE_KING, PieceType.WHITE_QUEEN, PieceType.WHITE_BISHOP, PieceType.WHITE_KNIGHT, PieceType.WHITE_ROOK]
    ]);
    const [currentPlayer, setCurrentPlayer] = useState<PlayerColors>(PlayerColors.WHITE);
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);

    return (
        <GameStateContext.Provider
            value={{board, setBoard, currentPlayer, setCurrentPlayer, moveHistory, setMoveHistory}}>
            {children}
        </GameStateContext.Provider>
    )
};

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};
