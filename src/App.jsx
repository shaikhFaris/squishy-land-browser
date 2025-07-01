import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";
import { socket } from "./components/socket";
import { useEffect, useState } from "react";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

function App() {
  const [Player, setPlayer] = useState({
    Pposition: [0, 1, 0],
  });

  useEffect(() => {
    // Connect to the socket and adding a listener for events
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // from server
    socket.on("player postion", ({ position }) => {
      // console.log(position);
      setPlayer({ Pposition: [position.x, position.y, position.z] });
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("player postion"); // important
    };
  }, []);

  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience Player={Player} />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
