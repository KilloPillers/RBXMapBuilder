import * as React from "react";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import { useRef } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MyContext } from "../MyContext";


export default function PositionConfig() {
  const { mapData, updateMap, selectedCubes } = React.useContext(MyContext);
  const deployPositionRef = useRef(null);
  const actionPositionRef = useRef(null);
  const tileNameRef = useRef(null);
  const eventIDRef = useRef(null);

  const handleDeployPosition = () => {
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.tileJSON.is_deploy_position = deployPositionRef.current.checked;
    }
  }

  const handleActionPosition = () => {
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.tileJSON.is_action_tile = actionPositionRef.current.checked;
      cube.tileJSON.tile_name = tileNameRef.current.value;
      cube.tileJSON.event_id = eventIDRef.current.value;
    }
  }

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
        <Box>
          <Paper className="drawer-menu-deploy-action">
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Deploy Position" inputRef={deployPositionRef} onChange={handleDeployPosition} />
              <Divider />
              <FormControlLabel control={<Checkbox />} label="Action Position" inputRef={actionPositionRef} onChange={handleActionPosition} />
              <TextField
                id="tileName"
                defaultValue={mapData.tileName}
                variant="outlined"
                fullWidth
                label="Tile Name"
                inputRef={tileNameRef}
                onChange={handleActionPosition}
              />
              <TextField
                id="eventID"
                defaultValue={mapData.eventID}
                variant="outlined"
                fullWidth
                label="Event ID"
                inputRef={eventIDRef}
                onChange={handleActionPosition}
              />
            </FormGroup>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
