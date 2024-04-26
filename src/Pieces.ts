import QueenW from "./assets/queen-w.svg";
import QueenB from "./assets/queen-b.svg";
import KingW from "./assets/king-w.svg";
import KingB from "./assets/king-b.svg";
import BishopW from "./assets/bishop-w.svg";
import BishopB from "./assets/bishop-b.svg";
import KnightW from "./assets/knight-w.svg";
import KnightB from "./assets/knight-b.svg";
import RookW from "./assets/rook-w.svg";
import RookB from "./assets/rook-b.svg";
import PawnW from "./assets/pawn-w.svg";
import PawnB from "./assets/pawn-b.svg";


export const PIECES:{
    [key: string]: {
        name: string;
        src: any;
        unicode: string;
    };
} = {
    wP: { name: "wP", src: PawnW, unicode: "\u2659" },
    wR: { name: "wR", src: RookW, unicode: "\u2656" },
    wN: { name: "wN", src: KnightW, unicode: "\u2658" },
    wB: { name: "wB", src: BishopW, unicode: "\u2657" },
    wQ: { name: "wQ", src: QueenW, unicode: "\u2655" },
    wK: { name: "wK", src: KingW, unicode: "\u2654" },
    bP: { name: "bP", src: PawnB, unicode: "\u265F" },
    bR: { name: "bR", src: RookB, unicode: "\u265C" },
    bN: { name: "bN", src: KnightB, unicode: "\u265E" },
    bB: { name: "bB", src: BishopB, unicode: "\u265D" },
    bQ: { name: "bQ", src: QueenB, unicode: "\u265B" },
    bK: { name: "bK", src: KingB, unicode: "\u265A" }
};

export const PIECE_NAMES = {
    wP: "White Pawn",
    wR: "White Rook",
    wN: "White Knight",
    wB: "White Bishop",
    wQ: "White Queen",
    wK: "White King",
    bP: "Black Pawn",
    bR: "Black Rook",
    bN: "Black Knight",
    bB: "Black Bishop",
    bQ: "Black Queen",
    bK: "Black King"
};

export const PLAYER_COLORS = {
    WHITE: "white",
    BLACK: "black"
};

export const generateNewBoard = () => {
    const board = new Array(8).fill(null).map(() => new Array(8).fill(""));
    //White pieces
    board[0] = ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"];
    board[1] = new Array(8).fill("wP");
    //Black pieces
    board[6] = new Array(8).fill("bP");
    board[7] = ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"];
    return board;
};

export const generateEmptyBoard = () => {
    return new Array(8).fill(null).map(() => new Array(8).fill(""));
};

export const generateRandomBoard = () => {
    const board = generateEmptyBoard();
    const pieces = Object.keys(PIECES);
    const shuffledPieces = pieces.sort(() => Math.random() - 0.5);
    let whiteCount = 0;
    let blackCount = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] !== "") {
                continue;
            }
            if (Math.random() > 0.5) {
                board[i][j] = shuffledPieces[whiteCount];
                whiteCount++;
            } else {
                board[i][j] = shuffledPieces[blackCount + 6];
                blackCount++;
            }
        }
    }

    return board;
}

