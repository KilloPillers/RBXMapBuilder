import * as React from "react";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { MyContext } from "../MyContext";

export default function PositionConfig() {
  const { mapData, updateMap, selectedCubes, inspectedTile } =
    React.useContext(MyContext);
  const [deployPosition, setDeployPosition] = useState(false);
  const [actionPosition, setActionPosition] = useState(false);
  const [tileName, setTileName] = useState("");
  const [eventID, setEventID] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (inspectedTile) {
      console.log("inspectedTile: ", inspectedTile);
      setDeployPosition(inspectedTile.tileJSON.is_deploy_position);
      setActionPosition(inspectedTile.tileJSON.is_action_tile);
      setTileName(inspectedTile.tileJSON.tile_name);
      setEventID(inspectedTile.tileJSON.event_id);
    }
    setKey((prevKey) => prevKey + 1);
  }, [inspectedTile]);

  const handleDeployPosition = (event) => {
    setDeployPosition(event.target.checked);
  };

  const handleActionPosition = (event) => {
    setActionPosition(event.target.checked);
  };

  const saveDeployPosition = (event) => {
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.setDeployPosition(deployPosition);
    }
  };

  const saveActionPosition = (event) => {
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.setActionTile(actionPosition);
      cube.tileJSON.tile_name = tileName;
      cube.tileJSON.event_id = eventID;
    }
  };

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className="drawer-position-config-menu">
        <Box className="drawer-menu-header">
          <Paper>
            <Typography
              variant="h6"
              color={"text.pimary"}
              sx={{ margin: "10px" }}
            >
              Position Configs
            </Typography>
          </Paper>
        </Box>
        <Box key={key}>
          <Paper className="drawer-menu-deploy-action">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Deploy Position"
                checked={deployPosition}
                onChange={handleDeployPosition}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={saveDeployPosition}
              >
                Save
              </Button>
              <Divider />
              <FormControlLabel
                control={<Checkbox />}
                label="Action Position"
                checked={actionPosition}
                onChange={handleActionPosition}
              />
              <TextField
                id="tileName"
                defaultValue={mapData.tileName}
                variant="outlined"
                fullWidth
                label="Tile Name"
                value={tileName}
                onChange={(e) => setTileName(e.target.value)}
              />
              <TextField
                id="eventID"
                defaultValue={mapData.eventID}
                variant="outlined"
                fullWidth
                label="Event ID"
                value={eventID}
                onChange={(e) => setEventID(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={saveActionPosition}
              >
                Save
              </Button>
            </FormGroup>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
