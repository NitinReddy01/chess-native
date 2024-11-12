import useAppSelector from "@/hooks/useAppSelector";
import { green800, neutral600 } from "@/utils/colors";
import { chessImageMap, Player } from "@/utils/types";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlayerInfo from "./PlayerInfo";
import CustomText from "./CustomText";

const screenWidth = Dimensions.get("screen").width;
const sqaureWidth = screenWidth / 8;
const platform = Platform.OS;

interface ChessBoardProps {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  player1: Player;
  player2: Player;
  socket: WebSocket;
  chess: Chess;
  gameId: string;
  moves:string[];
}

export default function ChessBoard({
  board,
  socket,
  chess,
  gameId,
  player1,
  player2,
  moves
}: ChessBoardProps) {
  const [from, setFrom] = useState<string | null>(null);
  const id = useAppSelector((state) => state.auth.id);
  const myColor = id === player1.id ? "w" : "b";
  const flipBoard = myColor === "b";

  const handleMove = (square: Square) => {
    if (from === square || chess.turn() !== myColor) {
      return;
    }
    const piece = chess.get(square);
    if (!from || piece.color === myColor) {
      setFrom(square);
    } else {
      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            gameId,
            move: { from, to: square },
          },
        })
      );
      setFrom(null);
    }
  };

  return (
    <View style={{ justifyContent: "space-evenly", height: "100%" }}>
      <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection:'row',gap:3}}>
          {moves.map(move=>(
            <CustomText text={move} />
          ))}
        </View>
      </ScrollView>
      <PlayerInfo
        player={id === player1.id ? player2 : player1}
        playerTurn={chess.turn() !== myColor}
        playerColor= {myColor === "w"? "b":"w"}
      />
      <View>
        {(flipBoard ? board.slice().reverse() : board).map((row, i) => {
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              {row.map((square, j) => {
                const squareString = `${
                  String.fromCharCode(97 + j) +
                  String(flipBoard ? i + 1 : 8 - i)
                }`;
                return (
                  <View
                    key={i + j + 1}
                    style={{
                      gap: 10,
                      backgroundColor: `${
                        (flipBoard ? (i + j) % 2 === 0 : (i + j) % 2 !== 0)
                          ? green800
                          : neutral600
                      }`,
                      width: platform === "web" ? 45 : sqaureWidth,
                      height: platform === "web" ? 45 : sqaureWidth,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleMove(squareString as Square);
                      }}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {square && (
                        <Image
                          style={{
                            width: platform === "web" ? 40 : sqaureWidth * 0.8,
                            height: platform === "web" ? 40 : sqaureWidth * 0.8,
                          }}
                          source={chessImageMap[square.color][square.type]}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
      <PlayerInfo
        player={id === player1.id ? player1 : player2}
        playerTurn={chess.turn() === myColor}
        playerColor={myColor}
      />
    </View>
  );
}
