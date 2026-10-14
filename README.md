Real-Time Location Tracker

A small web app that shows the live location of every connected user on a shared map. Open it on two devices (for example a laptop and a phone) and each one sees the other's marker move in real time.

Features
Live location sharing between all connected users using WebSockets
One marker per user, updated as their position changes
Marker is removed automatically when a user disconnects
Username prompt, shown in a popup when a marker is clicked
Device detection (phone or laptop) with a different marker colour and icon for each
Usernames are inserted with textContent so they cannot inject HTML into the page
Tech Stack
Backend: Node.js, Express.js, Socket.io
Frontend: EJS, vanilla JavaScript, CSS
Map: Leaflet with OpenStreetMap tiles
Browser API: Geolocation (watchPosition)
How It Works
The browser asks for location permission and calls navigator.geolocation.watchPosition.
Every time the position changes, the client emits a send-location event with latitude, longitude, username and device type.
The server receives it and broadcasts a receive-location event, adding the sender's socket.id.
Each client keeps a markers object keyed by socket.id. If a marker for that id exists it is moved, otherwise a new one is created.
When a socket disconnects, the server emits user-disconnected and every client removes that marker.
Project Structure
realtime-location-tracker/
├── app.js              # Express + Socket.io server
├── package.json
├── views/
│   └── index.ejs       # Page with the map container
└── public/
    ├── css/style.css   # Map and marker styles
    └── js/script.js    # Geolocation, map and socket logic
Run Locally

Prerequisite: Node.js 18 or newer.

bash
git clone https://github.com/monalika28/realtime-location-tracker.git
cd realtime-location-tracker
npm install
npx nodemon app.js

Open http://localhost:3000, allow location access, and enter a name. Open a second tab to see two markers.

Testing with a phone

Browsers only give location access on HTTPS or localhost, so a plain http://<laptop-ip>:3000 link will not work on a phone. Use a tunnel such as VS Code Port Forwarding (Dev Tunnels) or ngrok to get an HTTPS link, and keep it private.

Notes
Locations are only relayed through the server. Nothing is stored in a database.
There is no login. Anyone who can open the page can see every connected user's location, so do not deploy this publicly as it is.
Ideas for Next Steps
Rooms, so only users with the same code can see each other
Movement trail for each user
Online users counter
Saving location history in MongoDB


## 📺 Live Demo & Video Walkthrough

Watch the complete real-time tracking demonstration here:

[![Watch Demo Video](https://img.shields.io/badge/Loom_Demo-Watch_Video-blue?style=for-the-badge&logo=loom)(https://www.loom.com/share/89d7956ad66c49218a29bbc1ed4f7520)

> 👉 **Direct Link:** [Click here to watch the full project demo on Loom](https://www.loom.com/share/89d7956ad66c49218a29bbc1ed4f7520)
