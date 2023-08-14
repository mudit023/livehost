import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../store/SocketContext";
function Home() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socketCtx = useSocket();
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  // on receiving room:join from the backend
  useEffect(() => {
    socketCtx.on("room:join", handleJoinRoom);

    return () => {
      socketCtx.off("room:join", handleJoinRoom);
    };
  }, [socketCtx, handleJoinRoom]);

  // console.log(socketCtx);
  const submitHandler = (e) => {
    e.preventDefault();
    socketCtx.emit("room:join", { email, room });
    // console.log(email, room);
    setEmail("");
    setRoom("");
  };
  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-5 border-2 border-cyan-700 rounded-lg px-4 py-6 min-w-[400px] text-lg"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full rounded py-2 px-1 outline-none"
      />
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room No."
        required
        className="w-full rounded py-2 px-1 outline-none"
      />
      <button type="submit" className="border-none bg-cyan-600 mt-4">
        Enter Room
      </button>
    </form>
  );
}

export default Home;
