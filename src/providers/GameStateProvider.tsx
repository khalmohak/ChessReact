import React, {createContext, useContext, useState} from 'react';
import {PieceType, PlayerColors} from "../types/enums";
import {Pieces} from "../lib/Pieces";

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const generateEmptyBoard = () => {
    return [
        [PieceType.BLACK_ROOK, PieceType.BLACK_KNIGHT, PieceType.BLACK_BISHOP, PieceType.BLACK_KING, PieceType.BLACK_QUEEN, PieceType.BLACK_BISHOP, PieceType.BLACK_KNIGHT, PieceType.BLACK_ROOK],
        new Array(8).fill(PieceType.BLACK_PAWN),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.EMPTY),
        new Array(8).fill(PieceType.WHITE_PAWN),
        [PieceType.WHITE_ROOK, PieceType.WHITE_KNIGHT, PieceType.WHITE_BISHOP, PieceType.WHITE_KING, PieceType.WHITE_QUEEN, PieceType.WHITE_BISHOP, PieceType.WHITE_KNIGHT, PieceType.WHITE_ROOK]
    ];
};

const generateRandomBoard = () => {
    // A player can have at most 16 pieces, choose pieces from empty board and randomize their positions,
    // then return the board
};

export const GameStateProvider: React.FC<{
    children: React.ReactNode;
}> = ({children}) => {
    const [board, setBoard] = useState<PieceType[][]>(generateEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState<PlayerColors>(PlayerColors.WHITE);
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState<PieceType[]>([]);
    const [blackCapturedPieces, setBlackCapturedPieces] = useState<PieceType[]>([]);

    const addMoveToHistory = (move: Move) => {
        setMoveHistory([...moveHistory, move]);
    }

    const popMoveFromHistory = () => {
        const lastMove = moveHistory.pop();
        setMoveHistory([...moveHistory]);
        return lastMove;
    }

    const getPieceColor = (piece: PieceType) => {
        if (piece.startsWith('w')) {
            return PlayerColors.WHITE;
        }
        if (piece.startsWith('b')) {
            return PlayerColors.BLACK;
        }
        return null;
    }

    const togglePlayer = () => {
        setCurrentPlayer(currentPlayer === PlayerColors.WHITE ? PlayerColors.BLACK : PlayerColors.WHITE);
    }

    const setRandomBoard = () => {
        alert('Random board not implemented yet')
    }

    const resetBoard = () => {
        setBoard(generateEmptyBoard());
    }

    const movePiece = (from: Position, to: Position) => {
        const {row: fromRow, col: fromCol} = from;
        const {row: toRow, col: toCol} = to;
        const piece = board[fromRow][fromCol];

        //Check piece color
        if (currentPlayer === PlayerColors.WHITE && getPieceColor(piece) !== PlayerColors.WHITE
            || currentPlayer === PlayerColors.BLACK && getPieceColor(piece) !== PlayerColors.BLACK
        ) {
            return;
        }

        const targetPiece = board[toRow][toCol];
        if (piece === PieceType.EMPTY) {
            return;
        }
        if (piece === targetPiece) {
            return;
        }
        const move: Move = {
            targetPiece,
            currentPiece: piece,
            currentCol: fromCol,
            currentRow: fromRow,
            targetCol: toCol,
            targetRow: toRow,
        }
        addMoveToHistory(move);
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = PieceType.EMPTY;

        //If the target piece is not empty, add it to the captured pieces
        if (targetPiece !== PieceType.EMPTY) {
            if (currentPlayer === PlayerColors.WHITE) {
                setWhiteCapturedPieces([...whiteCapturedPieces, targetPiece]);
            } else {
                setBlackCapturedPieces([...blackCapturedPieces, targetPiece]);
            }
        }

        togglePlayer();
        setPossibleMoves([]);
    };

    const undoMove = () => {
        const lastMove = popMoveFromHistory();
        if (!lastMove) {
            return;
        }
        const {currentPiece, targetPiece, currentRow, currentCol, targetRow, targetCol} = lastMove;
        board[currentRow][currentCol] = currentPiece;
        board[targetRow][targetCol] = targetPiece;

        //Remove the captured piece from the captured pieces
        if (targetPiece !== PieceType.EMPTY) {
            if (getPieceColor(targetPiece) === PlayerColors.WHITE) {
                const index = blackCapturedPieces.indexOf(targetPiece);
                blackCapturedPieces.splice(index, 1);
                setBlackCapturedPieces([...blackCapturedPieces]);
            } else {
                const index = whiteCapturedPieces.indexOf(targetPiece);
                whiteCapturedPieces.splice(index, 1);
                setWhiteCapturedPieces([...whiteCapturedPieces]);
            }
        }


        togglePlayer();
    }

    const setSelectedPiece_ = (position: Position | null) => {
        //Check if the piece is the same color as the current player
        if (!position) {
            setSelectedPiece(null);
            return;
        }

        const {row, col} = position;
        const piece = board[row][col];

        if (piece === PieceType.EMPTY) {
            return;
        }

        if (currentPlayer === PlayerColors.WHITE && getPieceColor(piece) !== PlayerColors.WHITE
            || currentPlayer === PlayerColors.BLACK && getPieceColor(piece) !== PlayerColors.BLACK
        ) {
            return;
        }

        setSelectedPiece(position);
        getPossibleMoves(position);
    };

    const getPawnMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);
        const moves: Position[] = [];

        //A pawn can move
        //1. One step forward
        //2. Two steps forward if it's the first move
        //3. Capture a piece diagonally
        //If first move, the pawn can move two steps forward
        const isFirstMove = row === 1 && pieceColor === PlayerColors.BLACK || row === 6 && pieceColor === PlayerColors.WHITE;
        if (isFirstMove) {
            const twoStepsForward = pieceColor === PlayerColors.BLACK ? {row: row + 2, col} : {row: row - 2, col};
            moves.push(twoStepsForward);
        }

        //Check if the pawn can move one step forward
        const oneStepForward = pieceColor === PlayerColors.BLACK ? {row: row + 1, col} : {row: row - 1, col};
        if (board[oneStepForward.row][oneStepForward.col] === PieceType.EMPTY) {
            moves.push(oneStepForward);
        }

        //Check if the pawn can capture a piece diagonally
        const leftDiagonal = pieceColor === PlayerColors.BLACK ? {row: row + 1, col: col - 1} : {
            row: row - 1,
            col: col - 1
        };
        const rightDiagonal = pieceColor === PlayerColors.BLACK ? {row: row + 1, col: col + 1} : {
            row: row - 1,
            col: col + 1
        };

        if (board[leftDiagonal.row][leftDiagonal.col] !== PieceType.EMPTY) {
            moves.push(leftDiagonal);
        }
        if (board[rightDiagonal.row][rightDiagonal.col] !== PieceType.EMPTY) {
            moves.push(rightDiagonal);
        }


        return moves;
    }

    const getRookMoves = (position: Position) => {
        return [];
    }

    const getKnightMoves = (position: Position) => {
        return [];
    }

    const getBishopMoves = (position: Position) => {
        return [];
    }

    const getQueenMoves = (position: Position) => {
        return [];
    }

    const getKingMoves = (position: Position) => {
        return [];
    }

    const getPossibleMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        if (piece === PieceType.EMPTY) {
            return;
        }

        const pieceColor = getPieceColor(piece);

        const moves: Position[] = [];

        switch (piece) {
            case PieceType.WHITE_PAWN:
            case PieceType.BLACK_PAWN:
                moves.push(...getPawnMoves(position));
                break;
            case PieceType.WHITE_ROOK:
            case PieceType.BLACK_ROOK:
                moves.push(...getRookMoves(position));
                break;
            case PieceType.WHITE_KNIGHT:
            case PieceType.BLACK_KNIGHT:
                moves.push(...getKnightMoves(position));
                break;
            case PieceType.WHITE_BISHOP:
            case PieceType.BLACK_BISHOP:
                moves.push(...getBishopMoves(position));
                break;
            case PieceType.WHITE_QUEEN:
            case PieceType.BLACK_QUEEN:
                moves.push(...getQueenMoves(position));
                break;
            case PieceType.WHITE_KING:
            case PieceType.BLACK_KING:
                moves.push(...getKingMoves(position));
                break;
        }
        console.log("Possible moves: ", moves)
        setPossibleMoves(moves);
    }

    return (
        <GameStateContext.Provider
            value={{
                board,
                currentPlayer,
                moveHistory,
                selectedPiece,
                setSelectedPiece: setSelectedPiece_,
                movePiece,
                setRandomBoard,
                resetBoard,
                undoMove,
                possibleMoves,
                isGameOver,
                whiteCapturedPieces,
                blackCapturedPieces,
            }}>
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
