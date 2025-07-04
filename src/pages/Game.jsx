import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import { KeyboardControls } from "@react-three/drei";
import { socket } from "../components/socket";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const Game = () => {
  const otherPlayerState = useRef({
    position: new Vector3(),
    rotation: 0,
    animation: "idle",
  });

  useEffect(() => {
    // Connect to the socket and adding a listener for events
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("player position", (pos) => {
      if (otherPlayerState.current) {
        otherPlayerState.current.position.copy(pos.position);
        otherPlayerState.current.rotation = pos.rotation;
        otherPlayerState.current.animation = pos.animation;
      }
    });

    // Cleanup on unmount
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience otherPlayerState={otherPlayerState} />
      </Canvas>
    </KeyboardControls>
  );
};

export default Game;
