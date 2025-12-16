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
const envPath = path.join(process.cwd(), ".env");

const content = `EXPO_PUBLIC_API_URL=http://${ip}:${port}/api
`;

fs.writeFileSync(envPath, content);

console.log(`✅ .env generated with IP: ${ip}`);
