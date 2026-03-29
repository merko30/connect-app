const os = require("os");
const fs = require("fs");
const path = require("path");

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        net.address.startsWith("192.")
      ) {
        return net.address;
      }
    }
  }

  return "localhost";
}

const ip = getLocalIP();
const port = 1337; // Strapi port
const envPath = path.join(process.cwd(), ".env.local");
const apiUrl = `http://${ip}:${port}/api`;

let content = "";

if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, "utf8");
}

const lines = content.length > 0 ? content.split(/\r?\n/) : [];
let foundApiUrl = false;

const updatedLines = lines.map((line) => {
  if (line.startsWith("EXPO_PUBLIC_API_URL=")) {
    foundApiUrl = true;
    return `EXPO_PUBLIC_API_URL=${apiUrl}`;
  }
  return line;
});

if (!foundApiUrl) {
  updatedLines.push(`EXPO_PUBLIC_API_URL=${apiUrl}`);
}

fs.writeFileSync(envPath, `${updatedLines.join("\n")}\n`);

console.log(`✅ .env generated with IP: ${ip}`);
