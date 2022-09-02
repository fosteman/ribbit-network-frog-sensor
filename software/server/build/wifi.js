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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeConnections = exports.connectToNetwork = exports.scanNetworks = exports.scanNetworksOffline = exports.postWifiSettings = void 0;
var fs = __importStar(require("fs"));
var exec = require("child_process").exec;
var wifi = require("node-wifi");
wifi.init({
    iface: null,
});
var postWifiSettings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var values, timestamp, wpa_supplicant_file, file, contents;
    return __generator(this, function (_a) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log("[WIFI] /postWifiSettings");
        values = {
            ssid: "",
            passkey: "",
        };
        timestamp = Number(new Date());
        wpa_supplicant_file = "/etc/wpa_supplicant/wpa_supplicant.conf";
        file = wpa_supplicant_file + ".new-" + timestamp;
        console.log("Creating new file (" + file + ")");
        console.log("Writing settings/values: " + JSON.stringify(values));
        contents = "";
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
        return [2 /*return*/];
    });
}); };
exports.postWifiSettings = postWifiSettings;
var restartInterface = function () {
    console.log("Calling ifdown wlan0");
    exec("ifdown wlan0", function (error, stdout, stderr) {
        console.log("(ifdown) ERROR: " + error);
        console.log("(ifdown) STDERR: " + stderr);
        console.log("(ifdown) STDOUT: " + stdout);
        console.log("\nCalling ifup wlan0");
        exec("ifup wlan0", function (error, stdout, stderr) {
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
var scannedWifiNetworksPath = process.cwd() + "scannedWifiNetworks.json";
var scanNetworksOffline = function () {
    console.log("Scanning wifi networks...");
    wifi.scan(function (error, networks) {
        if ((networks === null || networks === void 0 ? void 0 : networks.length) && !error) {
            console.log("Found ".concat(networks.length, " networks, saving..."));
            fs.writeFileSync(scannedWifiNetworksPath, networks);
            return networks;
        }
        else {
            new Error("Nothing scanned");
        }
    });
};
exports.scanNetworksOffline = scanNetworksOffline;
var scanNetworks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var networks;
    return __generator(this, function (_a) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log("[WIFI] /scanNetworks");
        networks = fs.readFileSync(scannedWifiNetworksPath);
        res.json(networks);
        return [2 /*return*/];
    });
}); };
exports.scanNetworks = scanNetworks;
var connectToNetwork = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connected;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                res.setHeader("Access-Control-Allow-Origin", "*");
                console.log("[WIFI] /connectToNetwork");
                console.log(req.body);
                return [4 /*yield*/, wifi.connect({
                        ssid: req.body.ssid,
                        password: req.body.password,
                    })];
            case 1:
                connected = _a.sent();
                if (connected && typeof connected == "string") {
                    return [2 /*return*/, res.status(500).send(connected)];
                }
                else {
                    wifi.getCurrentConnections(function (error, currentConnections) {
                        if (error) {
                            return res.status(500).json(error);
                        }
                        return res.json(currentConnections);
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.connectToNetwork = connectToNetwork;
var activeConnections = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log("[WIFI] /activeConnections");
        wifi.getCurrentConnections(function (error, currentConnections) {
            if (error) {
                return res.status(500).json(error);
            }
            return res.json(currentConnections);
        });
        return [2 /*return*/];
    });
}); };
exports.activeConnections = activeConnections;
