interface GameStateContextType {
    board: PieceType[][];
    currentPlayer: PlayerColors;
    moveHistory: Move[];
    movePiece: (from: Position, to: Position) => void;
    undoMove: () => void;
    setRandomBoard: () => void;
    resetBoard: () => void;
    selectedPiece: Position | null;
    setSelectedPiece: (position: Position | null) => void;
    possibleMoves: Position[];
    isGameOver: boolean;
    whiteCapturedPieces: PieceType[];
    blackCapturedPieces: PieceType[];
}

interface Move {
    currentRow: number;
    currentCol: number;
    targetRow: number;
    targetCol: number;
    currentPiece: PieceType;
    targetPiece: PieceType;
}

interface Position {
    row: number;
    col: number;
}




