const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "locations.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Load existing data
function loadLocations() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }
  return [];
}

// Save data
function saveLocations(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Receive location data
app.post("/api/location", (req, res) => {
  const { ip, city, region, country, org, lat, lon, timestamp } = req.body;
  const locations = loadLocations();
  locations.push({
    ip, city, region, country, org, lat, lon,
    timestamp: timestamp || new Date().toISOString()
  });
  saveLocations(locations);
  res.json({ success: true });
});

// Get all locations (admin)
app.get("/api/locations", (req, res) => {
  res.json(loadLocations());
});

// Serve admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Share: http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});
