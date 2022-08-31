"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeConnections = exports.connectToNetwork = exports.scanNetworks = exports.postWifiSettings = void 0;
const fs = __importStar(require("fs"));
const exec = require("child_process").exec;
const wifi = require("node-wifi");
wifi.init({
    iface: null,
});
const postWifiSettings = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[WIFI] /postWifiSettings");
    const values = {
        ssid: "",
        passkey: "",
    };
    const timestamp = Number(new Date());
    const wpa_supplicant_file = "/etc/wpa_supplicant/wpa_supplicant.conf";
    let file = wpa_supplicant_file + ".new-" + timestamp;
    console.log("Creating new file (" + file + ")");
    console.log("Writing settings/values: " + JSON.stringify(values));
    let contents = "";
    contents += "ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n";
    contents += "update_config=1\n\n";
    contents += "network={\n";
    contents += '\tssid="' + values.ssid + '"\n';
    if (values.passkey != null && values.passkey.length > 0) {
        contents += '\tpsk="' + values.passkey + '"\n';
    }
    contents += "}\n";
    fs.writeFile(file, contents, function (err) {
        if (err) {
            console.log("Error writing contents to new wpa supplicant file");
            console.log(err);
            res.status(500).send(err);
            return;
        }
        restartInterface();
        console.log("The file was saved!");
        console.log("[WIFI:Success] /postWifiSettings");
        res.status(200).send("done");
    });
};
exports.postWifiSettings = postWifiSettings;
const restartInterface = () => {
    console.log("Calling ifdown wlan0");
    exec("ifdown wlan0", (error, stdout, stderr) => {
        console.log("(ifdown) ERROR: " + error);
        console.log("(ifdown) STDERR: " + stderr);
        console.log("(ifdown) STDOUT: " + stdout);
        console.log("\nCalling ifup wlan0");
        exec("ifup wlan0", (error, stdout, stderr) => {
            console.log("(ifup) ERROR: " + error);
            console.log("(ifup) STDERR: " + stderr);
            console.log("(ifup) STDOUT: " + stdout);
            // if (stdout != null) {
            //   console.log("(ifup) checking for assigned ip address");
            //
            //   const regex = /[\s\s]*?bound to (\d+\.\d+\.\d+\.\d+)[\s\s]*?/gi;
            //   if (stderr.match(regex)) {
            //     console.log("(ifup) ip address regex matched stdout.");
            //     return true;
            //   } else {
            //     console.log("(ifup) no ip address found in stdout.");
            //     return false;
            //   }
            // }
        });
    });
};
const scanNetworks = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[WIFI] /scanNetworks");
    wifi.scan((error, networks) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.json(networks);
    });
};
exports.scanNetworks = scanNetworks;
const connectToNetwork = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[WIFI] /connectToNetwork");
    console.log(req.body);
    const connected = await wifi.connect({
        ssid: req.body.ssid,
        password: req.body.password,
    });
    if (connected && typeof connected == "string") {
        return res.status(500).send(connected);
    }
    else {
        wifi.getCurrentConnections((error, currentConnections) => {
            if (error) {
                return res.status(500).json(error);
            }
            return res.json(currentConnections);
        });
    }
};
exports.connectToNetwork = connectToNetwork;
const activeConnections = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[WIFI] /activeConnections");
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
            return res.status(500).json(error);
        }
        return res.json(currentConnections);
    });
};
exports.activeConnections = activeConnections;
