import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MyContext } from "../MyContext";
import { MenuTheme } from "../Themes/MenuTheme";
import { ThemeProvider } from "@mui/material/styles";
import "./MapCreateModal.css";

const defaultUnitData = {
  unitLevel: "",
  unitName: "",
  classID: "",
  unitID: "",
  personality: "RandomAction",
  deathEvent: "nil",
  maxHP: "",
  maxSP: "",
  Atk: "",
  Def: "",
  Spd: "",
  Hit: "",
  Int: "",
  Res: "",
  skills: ["", "", "", ""],
  passives: ["", "", ""],
};

const MapCreateModal = forwardRef((props, ref) => {
  const { mapData, updateMap } = useContext(MyContext);
  const widthRef = useRef(null);
  const heightRef = useRef(null);

  async function createMap(width, height) {
    let ButtonGrid = [];
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < height; j++) {
        let tile = {
          has_unit: false,
          unit: defaultUnitData,
          tile_height: 1,
          tile_position: [i, j],
          is_deploy_position: false,
          is_action_tile: false,
          tile_name: "",
          event_id: "",
        };
        row.push(tile);
      }
      ButtonGrid.push(row);
    }
    const jsonData = {
      width: width,
      height: height,
      ButtonGrid: ButtonGrid,
    };
    updateMap(jsonData);
  }

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className="map-create-modal">
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1em",
            paddingTop: "30px",
            width: "20em",
          }}
        >
          <Button
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
            }}
            variant="contained"
            onClick={() => {
              props.handleClose();
            }}
          >
            X
          </Button>
          <Typography variant="h5" component="h2">
            Map Creation
          </Typography>
          <Typography variant="body2" component="p" color="warning">
            Creating a new map will erase the current map. Be sure to save your
            current map before creating a new one.
          </Typography>
          <TextField
            variant="outlined"
            id="width"
            type="number"
            label="Width"
            inputRef={widthRef}
          />
          <TextField
            variant="outlined"
            id="height"
            type="number"
            label="Height"
            inputRef={heightRef}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (widthRef.current.value && heightRef.current.value) {
                // check if values are numbers
                if (
                  isNaN(widthRef.current.value) ||
                  isNaN(heightRef.current.value)
                ) {
                  alert("Please enter a number for width and height.");
                  return;
                }
                createMap(widthRef.current.value, heightRef.current.value);
                props.handleClose();
              }
            }}
          >
            Create Map
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
});

export default MapCreateModal;
