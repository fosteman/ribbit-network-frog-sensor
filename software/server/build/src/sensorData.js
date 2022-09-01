"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSensorReadings = exports.getSensorData = void 0;
const child_process_1 = require("child_process");
const json5_1 = __importDefault(require("json5"));
const database_1 = require("./database");
const getSensorData = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[API] /sensorData");
    const python = (0, child_process_1.spawn)("py", ["./scripts/co2.py"]);
    python.stdout.on("data", async (data) => {
        const sensorReading = json5_1.default.parse(data.toString());
        await database_1.db.addSensorReading(sensorReading);
        res.json(sensorReading);
        console.log("[API:Success] /sensorData");
    });
};
exports.getSensorData = getSensorData;
const getAllSensorReadings = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[API] /getAllSensorReadings");
    res.json(await database_1.db.getAllSensorReadings());
    console.log("[API:Success] /getAllSensorReadings");
};
exports.getAllSensorReadings = getAllSensorReadings;
