"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var sqlite3_1 = __importDefault(require("sqlite3"));
var sqlite_1 = require("sqlite");
var mobx_1 = require("mobx");
var uuid_1 = require("uuid");
var AppDAO = /** @class */ (function () {
    function AppDAO() {
        this.init();
        (0, mobx_1.makeAutoObservable)(this);
    }
    AppDAO.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, platformUUID;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sqlite3_1.default.verbose();
                        _a = this;
                        return [4 /*yield*/, (0, sqlite_1.open)({
                                driver: sqlite3_1.default.Database,
                                filename: "./database.sqlite",
                            })];
                    case 1:
                        _a.db = _b.sent();
                        console.log("[DB] Initializing settings table...");
                        return [4 /*yield*/, this.db.run("CREATE TABLE IF NOT EXISTS settings(name TEXT, value TEXT)")];
                    case 2:
                        _b.sent();
                        console.log("[DB] Initializing sensorReadings table...");
                        return [4 /*yield*/, this.db.run("CREATE TABLE IF NOT EXISTS sensorReadings(uuid TEXT, timestamp TEXT, co2 TEXT, temp TEXT, relative_humidity TEXT, lat TEXT, lon TEXT, alt TEXT, scd_temp_offset TEXT, baro_temp TEXT, baro_pressure_hpa TEXT, scd30_pressure_mbar TEXT, scd30_alt_m TEXT)")];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.getPlatformUUID()];
                    case 4:
                        platformUUID = _b.sent();
                        console.log("[DB] Platform UUID recognized:", platformUUID);
                        return [2 /*return*/];
                }
            });
        });
    };
    AppDAO.prototype.addSensorReading = function (reading) {
        return __awaiter(this, void 0, void 0, function () {
            var co2, temp, relative_humidity, baro_temp, baro_pressure_hpa, lat, lon, scd30_pressure_mbar, scd30_alt_m, alt, scd_temp_offset, uuid, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        co2 = reading.co2, temp = reading.temp, relative_humidity = reading.relative_humidity, baro_temp = reading.baro_temp, baro_pressure_hpa = reading.baro_pressure_hpa, lat = reading.lat, lon = reading.lon, scd30_pressure_mbar = reading.scd30_pressure_mbar, scd30_alt_m = reading.scd30_alt_m, alt = reading.alt, scd_temp_offset = reading.scd_temp_offset;
                        _a = uuid_1.v5;
                        _b = [(0, uuid_1.v4)()];
                        return [4 /*yield*/, this.getPlatformUUID()];
                    case 1:
                        uuid = _a.apply(void 0, _b.concat([_c.sent()]));
                        return [4 /*yield*/, this.db.exec("INSERT INTO sensorReadings VALUES (".concat(uuid, ", ").concat(Date.now(), ", ").concat(co2, ", ").concat(temp, ", ").concat(relative_humidity, ", ").concat(lat, ", ").concat(lon, ", ").concat(alt, ", ").concat(scd_temp_offset, ", ").concat(baro_temp, ", ").concat(baro_pressure_hpa, ", ").concat(scd30_pressure_mbar, ", ").concat(scd30_alt_m, ")"), reading)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppDAO.prototype.getAllSensorReadings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.all("SELECT * FROM sensorReadings")];
            });
        });
    };
    AppDAO.prototype.getPlatformUUID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var platformUUID, newUUID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.platformUUID)
                            return [2 /*return*/, this.platformUUID];
                        return [4 /*yield*/, this.db.get("SELECT name, value FROM settings WHERE name == 'platformUUID'")];
                    case 1:
                        platformUUID = _a.sent();
                        if (!(platformUUID === null || platformUUID === void 0 ? void 0 : platformUUID.value)) return [3 /*break*/, 2];
                        this.platformUUID = platformUUID.value;
                        return [3 /*break*/, 4];
                    case 2:
                        newUUID = (0, uuid_1.v4)();
                        console.log("[DB] initializing platform UUID", newUUID);
                        return [4 /*yield*/, this.db.exec("INSERT INTO settings VALUES (\"platformUUID\", \"".concat(newUUID, "\")"))];
                    case 3:
                        _a.sent();
                        this.platformUUID = newUUID;
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.platformUUID];
                }
            });
        });
    };
    return AppDAO;
}());
exports.db = new AppDAO();
