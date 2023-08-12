import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../store/SocketContext";

function Room() {
  const routeInfo = useParams();
  const socketCtx = useSocket();
  const [remoteId, setRemoteId] = useState("");
  const [username, setUsername] = useState("");

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`user ${id} joined: ${email}`);
    setRemoteId(id);
    const name = email.split("@")[0];
    setUsername(name);
  }, []);

  // to check if another user joined or not
  useEffect(() => {
    socketCtx.on("user:joined", handleUserJoined);

    return () => {
      socketCtx.off("user:joined", handleUserJoined);
    };
  }, [socketCtx, handleUserJoined]);

  const callUserHandler = useCallback(() => {}, []);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1>{`Welcome to Room ${routeInfo.roomId}`}</h1>
      <h3 className="">
        {remoteId === "" ? (
          <p>No one in the room</p>
        ) : (
          <p>{`${username} joined!`}</p>
        )}
      </h3>
      {remoteId !== "" ? (
        <button onClick={callUserHandler}>{`Call ${username}`}</button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Room;
