import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../store/SocketContext";
import peer from "../service/peer";
import ReactPlayer from "react-player";

function Room() {
  const routeInfo = useParams();
  const socketCtx = useSocket();
  const [remoteId, setRemoteId] = useState("");
  const [username, setUsername] = useState("");
  const [userStream, setUserStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`user ${id} joined: ${email}`);
    setRemoteId(id);
    const name = email.split("@")[0];
    setUsername(name);
  }, []);

  // Taking A's meadia stream and sending the A offer
  const callUserHandler = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socketCtx.emit("user:call", { to: remoteId, offer });
    setUserStream(stream);
  }, [remoteId, socketCtx]);

  // Handling the incoming call from A and geting the answer from B
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming call from ${from} and offer: ${offer}`);
      setRemoteId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setUserStream(stream);
      const answer = await peer.getAnswer(offer);
      socketCtx.emit("call:accepted", { to: from, answer });
    },
    [socketCtx]
  );

  const sendStreamHandler = useCallback(() => {
    // After call accepting we can exchange the media
    for (const track of userStream.getTracks()) {
      peer.peer.addTrack(track, userStream);
    }
  }, [userStream]);

  const handleCallAccepted = useCallback(
    ({ from, answer }) => {
      peer.setLocalDescription(answer);
      console.log("call accepted!");
      // After call accepting we can exchange the media
      sendStreamHandler();
    },
    [sendStreamHandler]
  );

  // Handling Negotiation Needed incoming request to A
  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await peer.getAnswer(offer);
      socketCtx.emit("peer:nego:done", { to: from, answer });
    },
    [socketCtx]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socketCtx.emit("peer:nego:needed", { offer, to: remoteId });
  }, [remoteId, socketCtx]);

  const handleNegotiationFinal = useCallback(async ({ answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    socketCtx.on("user:joined", handleUserJoined);
    socketCtx.on("incoming:call", handleIncomingCall);
    socketCtx.on("call:accepted", handleCallAccepted);
    socketCtx.on("peer:nego:needed", handleNegotiationIncoming);
    socketCtx.on("peer:nego:final", handleNegotiationFinal);

    // to deregister the event
    return () => {
      socketCtx.off("user:joined", handleUserJoined);
      socketCtx.off("incoming:call", handleIncomingCall);
      socketCtx.off("call:accepted", handleCallAccepted);
      socketCtx.off("peer:nego:needed", handleNegotiationIncoming);
      socketCtx.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [
    socketCtx,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remote = ev.streams;
      setRemoteStream(remote[0]);
    });
  }, []);

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
      {userStream ? (
        <button onClick={sendStreamHandler}>Send Stream</button>
      ) : (
        <></>
      )}
      {userStream ? (
        <ReactPlayer
          url={userStream}
          playing
          muted
          height="200px"
          width="300px"
        />
      ) : (
        <></>
      )}

      {/* B's media stream */}
      {remoteStream ? (
        <ReactPlayer
          url={remoteStream}
          playing
          muted
          height="200px"
          width="300px"
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Room;
