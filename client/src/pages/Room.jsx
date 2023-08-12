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
  // let initialStream = null;
  // let newStream = null;

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`user ${id} joined: ${email}`);
    setRemoteId(id);
    const name = email.split("@")[0];
    setUsername(name);
  }, []);

  // Taking client's meadia stream
  const callUserHandler = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socketCtx.emit("user:call", { to: remoteId, offer });
    setUserStream(stream);
    // if (initialStream) {
    //   await getStreamTacks(initialStream);
    // }
  }, [remoteId, socketCtx]);

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

  const handleCallAccepted = useCallback(({ from, answer }) => {
    peer.setLocalDescription(answer);
    console.log("call accepted!");
  }, []);

  // async function getStreamTacks(stream) {
  //   newStream = new MediaStream(stream.getTracks());
  // }

  // To end call

  // const endCallHandler = useCallback(async () => {
  //   console.log(await newStream);
  //   let videoTrack = await newStream.getVideoTracks()[0];
  //   let audioTrack = await newStream.getAudioTracks()[0];

  //   await newStream.removeTrack(videoTrack);
  //   await newStream.removeTrack(audioTrack);
  //   setUserStream(null);
  // }, []);

  useEffect(() => {
    socketCtx.on("user:joined", handleUserJoined);
    socketCtx.on("incoming:call", handleIncomingCall);
    socketCtx.on("call:accepted", handleCallAccepted);

    // to deregister the event
    return () => {
      socketCtx.off("user:joined", handleUserJoined);
      socketCtx.off("incoming:call", handleIncomingCall);
      socketCtx.off("call:accepted", handleCallAccepted);
    };
  }, [socketCtx, handleUserJoined, handleIncomingCall, handleCallAccepted]);

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
      {/* {userStream ? <button onClick={endCallHandler}>End Call</button> : <></>} */}
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
    </div>
  );
}

export default Room;
