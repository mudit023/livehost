![livehost-logo](assets/livehost.svg)

# livehost

A real time video calling application developed using WebRTC and socket.io📺

## Live at🚀 [https://livehost.vercel.app/](https://livehost.vercel.app/)

![ui](/assets/ui.png)

## Installation🖥️

- `git clone <this_url>`
- install npm on client and server
  - `cd client`
  - `npm install`
  - `cd server`
  - `npm install`
- Configure Client
  - Go to `store` then in `socketContext` in the `socketProvider` change the `io` path from the deployed backend to your localhost on which your server will run `localhost:8000`
- Running the application in development mode

  - Development Mode (Client only): `cd client` then `npm run dev` and then open `http://localhost:5173` in a browser
  - Development Mode (Server only): `cd server` then `npm start` on port 8000.

  ## Features🔥

  - Do real-time video conversation with other user using the blazing fast low-latency connection of **WebRTC**.
  - Create rooms and invite people you want to connect with.

  > This application was created to understand the working of webRTC. I had a lot of fun building it✌️🚀

## Tech Used🤖

- webRTC🏎️💨
- Socket.io🎯
- ReactJS⚛️
- TailwindCSS🌈
