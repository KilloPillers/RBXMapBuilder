import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MyContext } from "../MyContext"
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import "./DrawerMenu.css";

const buttons = [];

export default function TileConfig() {
  const { selectedCubes } = React.useContext(MyContext);
  const [decimalHeight, setDecimalHeight] = React.useState(0);
  const [oldHeight, setOldHeight] = React.useState(1);
  const [height, setHeight] = React.useState(1);
  const [maxHeight, setMaxHeight] = React.useState(10);
  const [minHeight, setMinHeight] = React.useState(-1);
  const [mode, setMode] = React.useState("uniform");

  useEffect(() => { 
    if (selectedCubes.length > 0) {
      // Find Median Height
      let totalHeight = 0;
      for (let i = 0; i < selectedCubes.length; i++) {
        totalHeight += selectedCubes[i].tileJSON.tile_height;
      }
      // Round to 2 decimal places 
      let medianHeight = Math.round((totalHeight/selectedCubes.length) * 100) / 100; 
      setHeight(Math.round(medianHeight));
      // Set decimal height
      // Round to 2 decimal places
      let decimalHeight = Math.round((medianHeight - Math.floor(medianHeight)) * 100) / 100;
      setDecimalHeight(decimalHeight);
      setOldHeight(medianHeight);
      setMaxHeight(2*Math.ceil(medianHeight-minHeight));
    }
  }, [selectedCubes]);


  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  const handleChangeHeight = (event, newValue) => {
    // Combine decimal and whole number
    let newHeight = 0
    if (event.target.name === "tile-height-decimal") {
      newHeight = height + newValue;
    }
    else if (event.target.name === "tile-height") {
      newHeight = newValue;
    }

    if (mode === "discrete") {
      
      let delta = newHeight - oldHeight;
      for (let i = 0; i < selectedCubes.length; i++) {
        let newHeight = (selectedCubes[i].tileJSON.tile_height + delta);
        // convert to 2 decimal places
        newHeight = Math.round(newHeight * 100) / 100;
        selectedCubes[i].updateHeight(newHeight);
      }
    }
    else {
      for (let i = 0; i < selectedCubes.length; i++) {
        selectedCubes[i].updateHeight(newHeight);
      }
    }
    setOldHeight(newHeight);
    if (event.target.name === "tile-height") {
      setHeight(newValue);
    }
    else if (event.target.name === "tile-height-decimal") {
      setDecimalHeight(newValue);
    }
  };

  const handleChangeMaxHeight = (amount) => {
    if (maxHeight + amount < minHeight) {
      return;
    }
    setMaxHeight(maxHeight + amount);
  };

  const handleChangeMinHeight = (amount) => {
    if (minHeight + amount > maxHeight) {
      return;
    }
    setMinHeight(minHeight + amount);
  };

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className="drawer-menu-header">
        <Paper>
          <Typography
            variant="h6"
            color={"text.pimary"}
            sx={{ margin: "10px" }}
          >
            Tile Configuration
          </Typography>
        </Paper>
      </Box>
      <Box className="drawer-menu-height">
        <Box className="drawer-menu-tile-config">
          <Paper>
            <ButtonGroup
              className="drawer-menu-slider-config"
              size="small"
              aria-label="Small button group"
            >
              <IconButton
                key="left2"
                color="primary"
                onClick={() => handleChangeMaxHeight(-5)}
              >
                {" "}
                <KeyboardDoubleArrowLeftIcon />{" "}
              </IconButton>
              <IconButton
                key="left1"
                color="primary"
                onClick={() => handleChangeMaxHeight(-1)}
              >
                {" "}
                <KeyboardArrowLeftIcon />{" "}
              </IconButton>
              <Typography>Max: {maxHeight}</Typography>
              <IconButton
                key="right1"
                color="primary"
                onClick={() => handleChangeMaxHeight(1)}
              >
                {" "}
                <KeyboardArrowRightIcon />{" "}
              </IconButton>
              <IconButton
                key="right2"
                color="primary"
                onClick={() => handleChangeMaxHeight(5)}
              >
                {" "}
                <KeyboardDoubleArrowRightIcon />{" "}
              </IconButton>
            </ButtonGroup>
          </Paper>
          <Box className="drawer-menu-height-adjustments">
            <Paper className="drawer-menu-height-slider">
              <Slider
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: "slider-vertical",
                  },
                  paddingBottom: "20px",
                }}
                orientation="vertical"
                min={minHeight}
                max={maxHeight}
                value={height}
                name="tile-height"
                defaultValue={1}
                aria-label="Tile Height"
                valueLabelDisplay="auto"
                onChange={(event, newValue) => {
                  handleChangeHeight(event, newValue);
                }}
                onKeyDown={preventHorizontalKeyboardNavigation}
              />
              <Typography 
                sx={{
                  paddingTop: "10px",
                }}
                id="vertical-slider" gutterBottom fontSize={10}>
                {height}
              </Typography>
            </Paper>
            <Paper className="drawer-menu-height-slider">
              <Slider
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: "slider-vertical",
                  },
                  paddingBottom: "20px",
                }}
                orientation="vertical"
                min={0}
                max={.99}
                value={decimalHeight}
                name="tile-height-decimal"
                defaultValue={0}
                step={.01}
                aria-label="Tile Height Decimal"
                valueLabelDisplay="auto"
                onChange={(event, newValue) => {
                  handleChangeHeight(event, newValue);
                }}
                onKeyDown={preventHorizontalKeyboardNavigation}
              />
              <Typography 
                sx={{
                  paddingTop: "10px",
                }}
                id="vertical-slider" gutterBottom fontSize={10}>
                {decimalHeight}
              </Typography>
            </Paper>
          <Box>
              <Box
                sx={{
                  height: "125px",
                  padding: "auto",
                }}
              >
            <ToggleButtonGroup
              value={mode}
              exclusive
              orientation="vertical"
              onChange={(event, newMode) => setMode(newMode)}
              aria-label="text alignment"
            >
              <ToggleButton value="uniform" aria-label="left aligned">
                <ViewWeekIcon
                  color="primary"
                />
              </ToggleButton>
              <ToggleButton value="discrete" aria-label="centered">
                <BarChartIcon
                  color="primary"
                />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
            <Paper>
              <ButtonGroup
                className="drawer-menu-slider-delta"
                size="small"
                aria-label="Small button group"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: "10px",
                  }}
                >
                  <IconButton
                    key="left2"
                    color="primary"
                    onClick={(event) => handleChangeHeight(event, 1)}
                  >
                    {" "}
                    <KeyboardArrowUpIcon />{" "}
                  </IconButton>
                  <Typography>+1</Typography>
                </Box>
                <Divider color="primary" />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: "10px",
                  }}
                >
                  <IconButton
                    key="left2"
                    color="primary"
                    onClick={(event) => handleChangeHeight(event, -1)}
                  >
                    {" "}
                    <KeyboardArrowDownIcon />{" "}
                  </IconButton>
                  <Typography>-1</Typography>
                </Box>
              </ButtonGroup>
            </Paper>
          </Box>
          </Box>
          <Paper>
            <ButtonGroup
              className="drawer-menu-slider-config"
              size="small"
              aria-label="Small button group"
            >
              <IconButton
                key="left2"
                color="primary"
                onClick={() => handleChangeMinHeight(-5)}
              >
                {" "}
                <KeyboardDoubleArrowLeftIcon />{" "}
              </IconButton>
              <IconButton
                key="left1"
                color="primary"
                onClick={() => handleChangeMinHeight(-1)}
              >
                {" "}
                <KeyboardArrowLeftIcon />{" "}
              </IconButton>
              <Typography>Min: {minHeight}</Typography>
              <IconButton
                key="right1"
                color="primary"
                onClick={() => handleChangeMinHeight(1)}
              >
                {" "}
                <KeyboardArrowRightIcon />{" "}
              </IconButton>
              <IconButton
                key="right2"
                color="primary"
                onClick={() => handleChangeMinHeight(5)}
              >
                {" "}
                <KeyboardDoubleArrowRightIcon />{" "}
              </IconButton>
            </ButtonGroup>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
