import * as React from "react";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";


export default function PositionConfig({ mapData, updateMap, selectedCubes }) {
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
              <FormControlLabel control={<Checkbox />} label="Deploy Position" />
              <Divider />
              <FormControlLabel control={<Checkbox />} label="Action Position" />
              <TextField
                id="tileName"
                defaultValue={mapData.tileName}
                variant="outlined"
                fullWidth
                label="Tile Name"
              />
              <TextField
                id="eventID"
                defaultValue={mapData.eventID}
                variant="outlined"
                fullWidth
                label="Event ID"
              />
            </FormGroup>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
