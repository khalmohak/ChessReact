import QueenW from "../../assets/queen-w.svg";
import QueenB from "../../assets/queen-b.svg";
import KingW from "../../assets/king-w.svg";
import KingB from "../../assets/king-b.svg";
import BishopW from "../../assets/bishop-w.svg";
import BishopB from "../../assets/bishop-b.svg";
import KnightW from "../../assets/knight-w.svg";
import KnightB from "../../assets/knight-b.svg";
import RookW from "../../assets/rook-w.svg";
import RookB from "../../assets/rook-b.svg";
import PawnW from "../../assets/pawn-w.svg";
import PawnB from "../../assets/pawn-b.svg";
import {PieceType} from "../../types/enums";

export const Pieces :{
    [key in PieceType]: {name: string, src: string}
} = {
    // wP: {name: "wP", src: PawnW},
    // wR: {name: "wR", src: RookW},
    // wN: {name: "wN", src: KnightW},
    // wB: {name: "wB", src: BishopW},
    // wQ: {name: "wQ", src: QueenW},
    // wK: {name: "wK", src: KingW},
    // bP: {name: "bP", src: PawnB},
    // bR: {name: "bR", src: RookB},
    // bN: {name: "bN", src: KnightB},
    // bB: {name: "bB", src: BishopB},
    // bQ: {name: "bQ", src: QueenB},
    // bK: {name: "bK", src: KingB}
    [PieceType.BLACK_PAWN]: {name: "bP", src: PawnB},
    [PieceType.BLACK_ROOK]: {name: "bR", src: RookB},
    [PieceType.BLACK_KNIGHT]: {name: "bN", src: KnightB},
    [PieceType.BLACK_BISHOP]: {name: "bB", src: BishopB},
    [PieceType.BLACK_QUEEN]: {name: "bQ", src: QueenB},
    [PieceType.BLACK_KING]: {name: "bK", src: KingB},
    [PieceType.WHITE_PAWN]: {name: "wP", src: PawnW},
    [PieceType.WHITE_ROOK]: {name: "wR", src: RookW},
    [PieceType.WHITE_KNIGHT]: {name: "wN", src: KnightW},
    [PieceType.WHITE_BISHOP]: {name: "wB", src: BishopW},
    [PieceType.WHITE_QUEEN]: {name: "wQ", src: QueenW},
    [PieceType.WHITE_KING]: {name: "wK", src: KingW},
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
    const pieces = Object.keys(Pieces);
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

