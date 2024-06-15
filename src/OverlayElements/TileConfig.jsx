import * as React from "react";
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
import "./DrawerMenu.css";

const buttons = [];

export default function TileConfig({ mapData, updateMap, selectedCubes }) {
  const [maxHeight, setMaxHeight] = React.useState(10);
  const [minHeight, setMinHeight] = React.useState(-1);

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  const handleChange = (event, newValue) => {
    for (let i = 0; i < selectedCubes.length; i++) {
      selectedCubes[i].updateHeight(newValue);
    }
  };

  const handleChangeHeightDelta = (delta) => {
    for (let i = 0; i < selectedCubes.length; i++) {
      selectedCubes[i].updateHeightDelta(delta);
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
                }}
                orientation="vertical"
                min={minHeight}
                max={maxHeight}
                defaultValue={1}
                aria-label="Tile Height"
                valueLabelDisplay="auto"
                onChange={handleChange}
                onKeyDown={preventHorizontalKeyboardNavigation}
              />
              <Typography id="vertical-slider" gutterBottom fontSize={10}>
                Height
              </Typography>
            </Paper>
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
                    onClick={() => handleChangeHeightDelta(1)}
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
                    onClick={() => handleChangeHeightDelta(-1)}
                  >
                    {" "}
                    <KeyboardArrowDownIcon />{" "}
                  </IconButton>
                  <Typography>-1</Typography>
                </Box>
              </ButtonGroup>
            </Paper>
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
