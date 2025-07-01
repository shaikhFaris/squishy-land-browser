import { Vector3 } from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useEffect, useRef, useState } from "react";

export default function PlayerChar({ Player }) {
  const rb = useRef();
  // example: you can later use rb.current for position/velocity etc.

  useEffect(() => {
    console.log(Player.Pposition);
    // rb.current.position = Player.Pposition;
    rb.current.setTranslation(
      new Vector3(Player.Pposition[0], Player.Pposition[1], Player.Pposition[2]),
      true
    );
  }, [Player]);

  return (
    <RigidBody ref={rb} position={[1, 1, 0]} colliders={false} lockRotations>
      <Character scale={0.18} position={[0, -0.25, 0]} animation={"idle"} />
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
}
