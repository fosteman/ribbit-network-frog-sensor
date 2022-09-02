import { Request, Response } from "express";
import { db } from "./database";
import * as fs from "fs";
const exec = require("child_process").exec;

const wifi = require("node-wifi");

wifi.init({
  iface: null,
});

export const postWifiSettings = async (req: Request, res: Response) => {
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

const scannedWifiNetworksPath = process.cwd() + "/scannedWifiNetworks.json";

export const scanNetworksOffline = () => {
  console.log("Scanning wifi networks...");

  wifi.scan((error, networks) => {
    if (networks?.length && !error) {
      console.log(`Found ${networks.length} networks, saving...`);
      fs.writeFileSync(scannedWifiNetworksPath, JSON.stringify(networks));
    } else {
      new Error("Nothing scanned");
    }
  });
};

export const scanNetworks = async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log("[WIFI] /scanNetworks");

  // momentarily kill ap and setup wlan0 interface for scanning
  // exec("sudo killall create_ap");

  // wifi.scan((error, networks) => {
  //   // restart the AP
  //   exec(
  //     "sudo create_ap -n wlan0 FROG --no-virt --no-dnsmasq --redirect-to-localhost --daemon",
  //     (error, stdout, stderr) => {
  //       console.log("(ifup) ERROR: " + error);
  //       console.log("(ifup) STDERR: " + stderr);
  //       console.log("(ifup) STDOUT: " + stdout);
  //     }
  //   );
  //
  //   if (error) {
  //     return res.status(500).json(error);
  //   }
  //   res.json(networks);
  // });

  const networks = fs.readFileSync(scannedWifiNetworksPath).toJSON();
  console.log(networks);
  res.json(networks);
};

export const connectToNetwork = async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log("[WIFI] /connectToNetwork");

  console.log(req.body);

  const connected = await wifi.connect({
    ssid: req.body.ssid,
    password: req.body.password,
  });

  if (connected && typeof connected == "string") {
    return res.status(500).send(connected);
  } else {
    wifi.getCurrentConnections((error, currentConnections) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.json(currentConnections);
    });
  }
};

export const activeConnections = async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log("[WIFI] /activeConnections");

  wifi.getCurrentConnections((error, currentConnections) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.json(currentConnections);
  });
};
