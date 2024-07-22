import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import Divider from "@mui/material/Divider";
import "./DrawerMenu.css";
import TileConfig from "./TileConfig";
import { MyContext } from "../MyContext";
import { IconButton } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleIcon from "@mui/icons-material/People";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CodeIcon from "@mui/icons-material/Code";
import LayersIcon from "@mui/icons-material/Layers";
import UnitConfig from "./UnitConfig";
import PositionConfig from "./PositionConfig";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function DrawerMenu() {
  const { mapData, updateMap, selectedCubes, drawerOpen, setDrawerOpen } =
    React.useContext(MyContext);
  const [menu, setMenu] = useState("tile-config"); // ['unit-config', 'tile-config'

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className={`drawer-menu-container ${drawerOpen ? "open" : ""}`}>
        <Box className="drawer-menu-side-panel">
          <Paper
            onMouseUp={(e) => {
              stopPropagation(e);
            }}
          >
            <Paper>
              <IconButton
                children={<GridViewIcon />}
                color="primary"
                onClick={() => {
                  setMenu("tile-config");
                  setDrawerOpen(true);
                }}
              />
            </Paper>
            <Divider />
            <Paper>
              <IconButton
                children={<ManageAccountsIcon />}
                color="primary"
                onClick={() => {
                  setMenu("unit-config");
                  setDrawerOpen(true);
                }}
              />
            </Paper>
            <Divider />
            <Paper>
              <IconButton
                children={<NotListedLocationIcon />}
                color="primary"
                onClick={() => {
                  setMenu("position-config");
                  setDrawerOpen(true);
                }}
              />
            </Paper>
            <Divider />
            <Paper>
              <IconButton
                children={<SwapHorizIcon />}
                color="primary"
                onClick={() => {
                  setDrawerOpen(!drawerOpen);
                }}
              ></IconButton>
            </Paper>
          </Paper>
        </Box>
        <Box
          className="drawer-menu"
          onMouseUp={(e) => {
            stopPropagation(e);
          }}
        >
          {menu === "unit-config" && <UnitConfig />}
          {menu === "tile-config" && <TileConfig />}
          {menu === "position-config" && <PositionConfig />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
