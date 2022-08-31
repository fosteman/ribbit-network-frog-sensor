"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSettings = exports.getSettings = void 0;
const database_1 = require("./database");
const getSettings = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[API] /getSettings");
    const uuid = await database_1.db.getPlatformUUID();
    const settings = await database_1.db.db.all("SELECT * from settings");
    console.log(settings);
    res.json({
        // uuid,
        settings,
    });
    console.log("[API:Success] /getSettings");
};
exports.getSettings = getSettings;
const postSettings = async (req, res) => {
    console.log("[API] /postSettings");
    console.log(req.body);
    // TODO
    // const nameValue = [
    //   {
    //     name: "platformName",
    //     value: req.body.platformName,
    //   },
    //   {
    //     name: "hostname",
    //     value: req.body.hostname,
    //   },
    //   {
    //     name: "frequency",
    //     value: req.body.frequency,
    //   },
    // ];
    // const settings = await db.db.exec(
    //   " into settings VALUES (name, value)",
    //   nameValue
    // );
    // const settings = await db.db.exec(
    //   "REPLACE into settings (:name, :value)",
    //   req.body
    // );
    // console.log(settings);
    // res.json({
    //   uuid,
    //   settings,
    // });
    res.send("ok");
    console.log("[API:Success] /postSettings");
};
exports.postSettings = postSettings;
