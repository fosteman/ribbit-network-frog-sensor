"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const mobx_1 = require("mobx");
const uuid_1 = require("uuid");
class AppDAO {
    db;
    platformUUID;
    constructor() {
        this.init();
        (0, mobx_1.makeAutoObservable)(this);
    }
    async init() {
        sqlite3_1.default.verbose();
        this.db = await (0, sqlite_1.open)({
            driver: sqlite3_1.default.Database,
            filename: "./database.sqlite",
        });
        console.log("[DB] Initializing settings table...");
        await this.db.run("CREATE TABLE IF NOT EXISTS settings(name TEXT, value TEXT)");
        console.log("[DB] Initializing sensorReadings table...");
        await this.db.run("CREATE TABLE IF NOT EXISTS sensorReadings(uuid TEXT, timestamp TEXT, co2 TEXT, temp TEXT, relative_humidity TEXT, lat TEXT, lon TEXT, alt TEXT, scd_temp_offset TEXT, baro_temp TEXT, baro_pressure_hpa TEXT, scd30_pressure_mbar TEXT, scd30_alt_m TEXT)");
        const platformUUID = await this.getPlatformUUID();
        console.log("[DB] Platform UUID recognized:", platformUUID);
    }
    async addSensorReading(reading) {
        const { co2, temp, relative_humidity, baro_temp, baro_pressure_hpa, lat, lon, scd30_pressure_mbar, scd30_alt_m, alt, scd_temp_offset, } = reading;
        // generating uuid using a platformUUID namespace
        const uuid = (0, uuid_1.v5)((0, uuid_1.v4)(), await this.getPlatformUUID());
        await this.db.exec(`INSERT INTO sensorReadings VALUES (${uuid}, ${Date.now()}, ${co2}, ${temp}, ${relative_humidity}, ${lat}, ${lon}, ${alt}, ${scd_temp_offset}, ${baro_temp}, ${baro_pressure_hpa}, ${scd30_pressure_mbar}, ${scd30_alt_m})`, reading);
    }
    async getAllSensorReadings() {
        return this.db.all("SELECT * FROM sensorReadings");
    }
    async getPlatformUUID() {
        if (this.platformUUID)
            return this.platformUUID;
        const platformUUID = await this.db.get("SELECT name, value FROM settings WHERE name == 'platformUUID'");
        if (platformUUID?.value) {
            this.platformUUID = platformUUID.value;
        }
        else {
            const newUUID = (0, uuid_1.v4)();
            console.log("[DB] initializing platform UUID", newUUID);
            await this.db.exec(`INSERT INTO settings VALUES ("platformUUID", "${newUUID}")`);
            this.platformUUID = newUUID;
        }
        return this.platformUUID;
    }
}
exports.db = new AppDAO();
