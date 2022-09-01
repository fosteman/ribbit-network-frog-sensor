import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import auth, { Auth, getAuth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { configure, makeAutoObservable, toJS } from "mobx";
import axios from "axios";

import { Network, Settings } from "./types";

configure({
  enforceActions: "never",
});

const firebaseConfig = {
  apiKey: "AIzaSyD35dn4IMvA7-Tul_OPeBGerHPHJfqypSk",
  authDomain: "ribbit-network.firebaseapp.com",
  projectId: "ribbit-network",
  storageBucket: "ribbit-network.appspot.com",
  messagingSenderId: "56492711430",
  appId: "1:56492711430:web:1451d6012c0874e1492d87",
  measurementId: "G-8FFJCG61RL",
};

const serverURL = "http://frog.local";

class Core {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);

    makeAutoObservable(this);

    this.getSettings();
    this.activeConnections();
  }

  app: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
  firestore: Firestore;
  authUI?: any;

  sensorData: SensorData[] = [];

  isOffline: boolean = true;

  public loading = true;

  settings?: Settings;

  async getMap() {}

  async heartbeat() {
    return await fetch(`${serverURL}/heartbeat`);
  }

  async getSettings() {
    const settings = await (await fetch(`${serverURL}/settings`)).json();

    this.settings = settings;

    this.loading = false;
    return settings;
  }

  networks: Network[] = [];

  async getNetworks() {
    this.networks = (await axios.get(`${serverURL}/scanNetworks`)).data;
    return this.networks;
  }

  connectedTo?: Network;

  activeConnections() {
    return axios
      .get<Network[]>(`${serverURL}/activeConnections`)
      .then((res) => {
        console.log("Active wifi connections: ", res.data);
        this.connectedTo = res.data[0];
        return this.connectedTo;
      });
  }

  connectToNetwork(network: { ssid: string; password?: string }) {
    return axios
      .post<Network[]>(`${serverURL}/connectToNetwork`, network)
      .then((res) => {
        this.connectedTo = res.data[0];
        return this.connectedTo;
      });
  }
}

export const core = new Core();

export interface SensorData {
  co2: number;
  host: string;
  lat: number;
  lon: number;
  result: string;
  table: number;
  _time: string;
}
