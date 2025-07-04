import { Suspense, useState } from "react";
import Game from "./pages/Game";

function App() {
  const [userName, setuserName] = useState("");
  const [toggle, settoggle] = useState(true);
  const handleEnter = () => {
    if (userName) {
      settoggle(false);
    }
  };
  return (
    <>
      {toggle ? (
        <div className="username-page">
          <div className="username-box">
            <h3>Enter your name</h3>
            <input type="text" onChange={(e) => setuserName(e.target.value)} />
            <button onClick={handleEnter}>Enter</button>
          </div>
        </div>
      ) : (
        <Suspense fallback={<p>loading...</p>}>
          <Game />
        </Suspense>
      )}
    </>
  );
}

export default App;
