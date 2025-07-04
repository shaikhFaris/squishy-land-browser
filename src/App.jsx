import { Suspense, useState } from "react";
import Game from "./pages/Game";

function App() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Game />
    </Suspense>
  );
}

export default App;
