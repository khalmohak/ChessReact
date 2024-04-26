interface GameStateContextType {
    board: PieceType[][];
    setBoard: (board: PieceType[][]) => void;
    currentPlayer: PlayerColors;
    setCurrentPlayer: (player: PlayerColors) => void;
    moveHistory: Move[];
    setMoveHistory: (moveHistory: Move[]) => void;
}

interface Move {
    currentRow: number;
    currentCol: number;
    targetRow: number;
    targetCol: number;
    currentPiece: PieceType;
    targetPiece: PieceType;
}




