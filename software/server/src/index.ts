import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAllSensorReadings, getSensorData } from "./sensorData";
import { getSettings, postSettings } from "./settings";
import cors from "cors";
import {
  activeConnections,
  connectToNetwork,
  postWifiSettings,
  scanNetworks,
  scanNetworksOffline,
} from "./wifi";
dotenv.config();

const exec = require("child_process").exec;

const app: Express = express();
app.use(cors());
const port = process.env.PORT || 80;

app.use("/", express.static("dashboard/build"));
app.use("/captiveportal", express.static("dashboard/build"));
app.use(express.json());

app.get("/heartbeat", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Alive!");
});

app.get("/sensorData", getSensorData);

app.get("/getAllSensorReadings", getAllSensorReadings);

app.get("/settings", getSettings);

app.post("/settings", postSettings);

app.post("/updateWifiSettings", postWifiSettings);
app.get("/scanNetworks", scanNetworks);
app.post("/connectToNetwork", connectToNetwork);
app.get("/activeConnections", activeConnections);

app.listen(80, "0.0.0.0", () => {
  scanNetworksOffline();

  console.log("Starting a hotspot...");
  exec(
    "sudo create_ap -n wlan0 FROG --no-virt --no-dnsmasq --redirect-to-localhost --daemon"
  );

  console.log(`⚡️[server]: Server is running at port ${port}`);
});
