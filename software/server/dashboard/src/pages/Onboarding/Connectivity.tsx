import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { core, Network, userCore } from "../../core";
import { observer } from "mobx-react";
import "firebase/compat/auth";
import { onboardingCore } from "./OnboardingCore";
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default observer(() => {
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, selectNetwork] = useState<Network>();
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    core.getNetworks();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "space-between",
        padding: 4,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3">Welcome</Typography>

        <Typography variant="h5">
          Let's connect your frog to your wifi network
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        {(!core.networks.length || loading) && <LinearProgress />}
        <List sx={{ maxHeight: 450, overflowY: "scroll", mb: 1 }}>
          {core.networks?.map((n, i) => {
            return (
              <MenuItem
                selected={selectedNetwork === n}
                onClick={() => selectNetwork(n)}
                key={i}
              >
                {n.ssid}
              </MenuItem>
            );
          })}
        </List>

        {selectedNetwork && (
          <TextField
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: "100%" }}
            label={"Password"}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <LoadingButton
          sx={{ mr: 4 }}
          variant={"outlined"}
          onClick={async () => {
            setLoading(true);
            await core.getNetworks();
            setLoading(false);
          }}
          loading={loading}
        >
          Refresh
          <Refresh />
        </LoadingButton>

        <LoadingButton
          disabled={!selectedNetwork}
          loading={loading}
          variant={"contained"}
          onClick={() => {
            setLoading(true);

            core
              .connectToNetwork({
                ssid: selectedNetwork!.ssid,
                password,
              })
              .then((res) => {
                if (res) {
                  enqueueSnackbar(`Connected to ${res.ssid}`, {
                    variant: "success",
                  });

                  setTimeout(() => {
                    onboardingCore.onboardingStep++;
                    setLoading(false);
                  }, 1000);
                }
              })
              .catch((err) => {
                setLoading(false);
                enqueueSnackbar(err.response.data, {
                  variant: "error",
                });
              });
          }}
        >
          Connect
        </LoadingButton>
      </Box>
    </Box>
  );
});
