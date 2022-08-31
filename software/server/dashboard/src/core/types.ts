import firebase from "firebase/compat";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  avatarUrl: string;
  verified: boolean;
}

export interface Settings {
  uuid?: string;
  platformName: string;
  hostname: string;
  frequency: string;
}

export interface Network {
  bssid: string;
  channel: number;
  frequency: number;
  mac: string;
  quality: number;
  security: string;
  security_flags: string[];
  signal_level: string;
  ssid: string;
}
