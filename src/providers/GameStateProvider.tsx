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

        //Check if the move is valid
        if (!possibleMoves.some((move) => move.row === toRow && move.col === toCol)) {
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
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);
        const moves: Position[] = [];

        //A rook can move in four directions
        //1. Up
        //2. Down
        //3. Left
        //4. Right
        //A rook can move until it reaches the end of the board or captures a piece

        //Up
        for (let i = row - 1; i >= 0; i--) {
            if (board[i][col] === PieceType.EMPTY) {
                moves.push({row: i, col});
            } else {
                if (getPieceColor(board[i][col]) !== pieceColor) {
                    moves.push({row: i, col});
                }
                break;
            }
        }

        //Down
        for (let i = row + 1; i < 8; i++) {
            if (board[i][col] === PieceType.EMPTY) {
                moves.push({row: i, col});
            } else {
                if (getPieceColor(board[i][col]) !== pieceColor) {
                    moves.push({row: i, col});
                }
                break;
            }
        }

        //Left
        for (let i = col - 1; i >= 0; i--) {
            if (board[row][i] === PieceType.EMPTY) {
                moves.push({row, col: i});
            } else {
                if (getPieceColor(board[row][i]) !== pieceColor) {
                    moves.push({row, col: i});
                }
                break;
            }
        }

        //Right
        for (let i = col + 1; i < 8; i++) {
            if (board[row][i] === PieceType.EMPTY) {
                moves.push({row, col: i});
            } else {
                if (getPieceColor(board[row][i]) !== pieceColor) {
                    moves.push({row, col: i});
                }
                break;
            }
        }


        return moves;
    }

    const getKnightMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);
        const moves: Position[] = [];

        //A knight can move in an L shape
        //1. Up and left
        //2. Up and right
        //3. Down and left
        //4. Down and right

        //Up and left
        if (row - 2 >= 0 && col - 1 >= 0) {
            if (board[row - 2][col - 1] === PieceType.EMPTY || getPieceColor(board[row - 2][col - 1]) !== pieceColor) {
                moves.push({row: row - 2, col: col - 1});
            }
        }

        //Up and right
        if (row - 2 >= 0 && col + 1 < 8) {
            if (board[row - 2][col + 1] === PieceType.EMPTY || getPieceColor(board[row - 2][col + 1]) !== pieceColor) {
                moves.push({row: row - 2, col: col + 1});
            }
        }

        //Down and left
        if (row + 2 < 8 && col - 1 >= 0) {
            if (board[row + 2][col - 1] === PieceType.EMPTY || getPieceColor(board[row + 2][col - 1]) !== pieceColor) {
                moves.push({row: row + 2, col: col - 1});
            }
        }

        //Down and right
        if (row + 2 < 8 && col + 1 < 8) {
            if (board[row + 2][col + 1] === PieceType.EMPTY || getPieceColor(board[row + 2][col + 1]) !== pieceColor) {
                moves.push({row: row + 2, col: col + 1});
            }
        }

        //Left and up
        if (row - 1 >= 0 && col - 2 >= 0) {
            if (board[row - 1][col - 2] === PieceType.EMPTY || getPieceColor(board[row - 1][col - 2]) !== pieceColor) {
                moves.push({row: row - 1, col: col - 2});
            }
        }

        //Left and down
        if (row + 1 < 8 && col - 2 >= 0) {
            if (board[row + 1][col - 2] === PieceType.EMPTY || getPieceColor(board[row + 1][col - 2]) !== pieceColor) {
                moves.push({row: row + 1, col: col - 2});
            }
        }

        //Right and up
        if (row - 1 >= 0 && col + 2 < 8) {
            if (board[row - 1][col + 2] === PieceType.EMPTY || getPieceColor(board[row - 1][col + 2]) !== pieceColor) {
                moves.push({row: row - 1, col: col + 2});
            }
        }

        //Right and down
        if (row + 1 < 8 && col + 2 < 8) {
            if (board[row + 1][col + 2] === PieceType.EMPTY || getPieceColor(board[row + 1][col + 2]) !== pieceColor) {
                moves.push({row: row + 1, col: col + 2});
            }
        }



        return moves;
    }

    const getBishopMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);
        const moves: Position[] = [];

        //A bishop can move diagonally
        //1. Up and left
        //2. Up and right
        //3. Down and left
        //4. Down and right

        //Up and left
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === PieceType.EMPTY) {
                moves.push({row: i, col: j});
            } else {
                if (getPieceColor(board[i][j]) !== pieceColor) {
                    moves.push({row: i, col: j});
                }
                break;
            }
        }

        //Up and right
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++) {
            if (board[i][j] === PieceType.EMPTY) {
                moves.push({row: i, col: j});
            } else {
                if (getPieceColor(board[i][j]) !== pieceColor) {
                    moves.push({row: i, col: j});
                }
                break;
            }
        }

        //Down and left
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--) {
            if (board[i][j] === PieceType.EMPTY) {
                moves.push({row: i, col: j});
            } else {
                if (getPieceColor(board[i][j]) !== pieceColor) {
                    moves.push({row: i, col: j});
                }
                break;
            }
        }

        //Down and right
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++) {
            if (board[i][j] === PieceType.EMPTY) {
                moves.push({row: i, col: j});
            } else {
                if (getPieceColor(board[i][j]) !== pieceColor) {
                    moves.push({row: i, col: j});
                }
                break;
            }
        }

        return moves;
    }

    const getQueenMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);

        const moves: Position[] = [];

        //A queen can move in all directions like a rook and a bishop
        //Reuse the rook and bishop moves
        moves.push(...getRookMoves(position));
        moves.push(...getBishopMoves(position));

        return moves;
    }

    const getKingMoves = (position: Position) => {
        const {row, col} = position;
        const piece = board[row][col];
        const pieceColor = getPieceColor(piece);

        const moves: Position[] = [];

        //A king can move in all directions by one step
        //1. Up
        //2. Down
        //3. Left
        //4. Right
        //5. Up and left
        //6. Up and right
        //7. Down and left
        //8. Down and right

        //Up
        if (row - 1 >= 0) {
            if (board[row - 1][col] === PieceType.EMPTY || getPieceColor(board[row - 1][col]) !== pieceColor) {
                moves.push({row: row - 1, col});
            }
        }

        //Down
        if (row + 1 < 8) {
            if (board[row + 1][col] === PieceType.EMPTY || getPieceColor(board[row + 1][col]) !== pieceColor) {
                moves.push({row: row + 1, col});
            }
        }

        //Left
        if (col - 1 >= 0) {
            if (board[row][col - 1] === PieceType.EMPTY || getPieceColor(board[row][col - 1]) !== pieceColor) {
                moves.push({row, col: col - 1});
            }
        }

        //Right
        if (col + 1 < 8) {
            if (board[row][col + 1] === PieceType.EMPTY || getPieceColor(board[row][col + 1]) !== pieceColor) {
                moves.push({row, col: col + 1});
            }
        }

        //Up and left
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (board[row - 1][col - 1] === PieceType.EMPTY || getPieceColor(board[row - 1][col - 1]) !== pieceColor) {
                moves.push({row: row - 1, col: col - 1});
            }
        }

        //Up and right
        if (row - 1 >= 0 && col + 1 < 8) {
            if (board[row - 1][col + 1] === PieceType.EMPTY || getPieceColor(board[row - 1][col + 1]) !== pieceColor) {
                moves.push({row: row - 1, col: col + 1});
            }
        }

        //Down and left
        if (row + 1 < 8 && col - 1 >= 0) {
            if (board[row + 1][col - 1] === PieceType.EMPTY || getPieceColor(board[row + 1][col - 1]) !== pieceColor) {
                moves.push({row: row + 1, col: col - 1});
            }
        }

        //Down and right
        if (row + 1 < 8 && col + 1 < 8) {
            if (board[row + 1][col + 1] === PieceType.EMPTY || getPieceColor(board[row + 1][col + 1]) !== pieceColor) {
                moves.push({row: row + 1, col: col + 1});
            }
        }

        return moves;
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
