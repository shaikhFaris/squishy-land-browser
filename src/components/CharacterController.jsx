import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useRef, useState, useEffect } from "react";
import { MathUtils, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export default function CharacterCotroller({ initialPostion }) {
  const ROTATION_SPEED = degToRad(1.5);
  const WALK_SPEED = 0.8;
  const RUN_SPEED = 2;

  const rb = useRef();
  const [, get] = useKeyboardControls();

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);

  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const character = useRef();

  const [animation, setAnimation] = useState("idle");

  const cameraWorldPostion = useRef(new Vector3());
  const cameraLookAtWorldPostion = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  function lerpAngle(a, b, t) {
    let diff = b - a;

    // Wrap difference to [-PI, PI]
    while (diff < -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;

    return a + diff * t;
  }

  let movement = {
    x: 0,
    z: 0,
  };
  const prevPlayerState = useRef({
    position: new Vector3(),
    rotation: 0,
    animation: "idle",
  });

  useFrame(({ camera }) => {
    movement = {
      x: 0,
      z: 0,
    };
    const vel = rb.current.linvel();
    if (rb.current) {
      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }
      let speed = get().run ? RUN_SPEED : WALK_SPEED;
      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        if (speed === RUN_SPEED) {
          setAnimation("run");
        } else {
          setAnimation("walk");
        }
      } else {
        setAnimation("idle");
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );
      rb.current.setLinvel(vel, true);
    }

    //  CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPostion.current);
    camera.position.lerp(cameraWorldPostion.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPostion.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPostion.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody colliders={false} position={initialPostion} lockRotations ref={rb}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={1.5} position-z={-3} />
        <group ref={character}>
          <Character scale={0.18} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
}
