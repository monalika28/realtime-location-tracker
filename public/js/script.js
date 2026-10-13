const socket = io();

const username = prompt("Apna naam likho:") || "Guest";

// Phone hai ya laptop
const device = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent)
  ? "mobile"
  : "desktop";

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude, username, device });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

const markers = {};

// Device ke hisaab se colour family, id ke hisaab se shade
function colorFor(id, device) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 60;
  const baseHue = device === "mobile" ? 0 : 190; // phone: laal/narangi, laptop: neela/hara
  return `hsl(${baseHue + hash}, 70%, 45%)`;
}

function makeIcon(id, device) {
  const emoji = device === "mobile" ? "📱" : "💻";
  return L.divIcon({
    className: "user-marker",
    html: `<div class="pin" style="background:${colorFor(id, device)}"><span>${emoji}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
}

function makePopup(name) {
  const el = document.createElement("span");
  el.textContent = name;
  return el;
}

socket.on("receive-location", (data) => {
  const { id, latitude, longitude, username, device } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], {
      icon: makeIcon(id, device),
    })
      .addTo(map)
      .bindPopup(makePopup(username || "Guest"));
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});