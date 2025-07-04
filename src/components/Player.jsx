import { Vector3 } from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";

export default function PlayerChar({ playerState }) {
  const rb = useRef();
  const char = useRef();
  const [animation, setanimation] = useState(playerState.current.animation);

  useFrame(() => {
    if (!rb.current || !char.current || !playerState) return;
    rb.current.setLinvel(playerState.current.position, true);
    char.current.rotation.y = playerState.current.rotation;
    setanimation(playerState.current.animation);
  });

  // No — useEffect does not get triggered when the value of a ref (ref.current) changes.

  return (
    <RigidBody ref={rb} position={[1, 1, 0]} colliders={false} lockRotations>
      <group ref={char}>
        <Character scale={0.18} position={[0, -0.25, 0]} animation={animation} />
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
}
