// import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { AiFillGithub } from "react-icons/ai";
import { MdLiveTv } from "react-icons/md";

function App() {
  return (
    <div>
      <nav className="fixed top-0 left-0 min-w-full flex justify-between px-2 py-4 text-3xl">
        <div className="flex gap-2 justify-center items-center font-bold text-cyan-100">
          <MdLiveTv />
          <span>livehost</span>
        </div>
        <div>
          <a className="text-white cursor-pointer hover:text-white">
            <AiFillGithub />
          </a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="fixed bottom-2 left-0 min-w-full">
        <p className="text-center">
          Made by{" "}
          <a href="https://linktr.ee/muditwt" target="_blank">
            Mudit
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
