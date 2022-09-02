"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var sensorData_1 = require("./sensorData");
var settings_1 = require("./settings");
var cors_1 = __importDefault(require("cors"));
var wifi_1 = require("./wifi");
dotenv_1.default.config();
var exec = require("child_process").exec;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var port = process.env.PORT || 80;
app.use("/", express_1.default.static("dashboard/build"));
app.use("/captiveportal", express_1.default.static("dashboard/build"));
app.use(express_1.default.json());
app.get("/heartbeat", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("Alive!");
});
app.get("/sensorData", sensorData_1.getSensorData);
app.get("/getAllSensorReadings", sensorData_1.getAllSensorReadings);
app.get("/settings", settings_1.getSettings);
app.post("/settings", settings_1.postSettings);
app.post("/updateWifiSettings", wifi_1.postWifiSettings);
app.get("/scanNetworks", wifi_1.scanNetworks);
app.post("/connectToNetwork", wifi_1.connectToNetwork);
app.get("/activeConnections", wifi_1.activeConnections);
app.listen(80, "0.0.0.0", function () {
    (0, wifi_1.scanNetworksOffline)();
    (0, wifi_1.disconnectWifi)();
    console.log("Starting a hotspot...");
    exec("sudo create_ap -n wlan0 FROG --no-virt --no-dnsmasq --redirect-to-localhost --daemon");
    console.log("\u26A1\uFE0F[server]: Server is running at port ".concat(port));
});
