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

export const pieces = {
    white: {
        pawn: PawnW,
        rook: RookW,
        knight: KnightW,
        bishop: BishopW,
        queen: QueenW,
        king: KingW,
    },
    black: {
        pawn: PawnB,
        rook: RookB,
        knight: KnightB,
        bishop: BishopB,
        queen: QueenB,
        king: KingB,
    },
}