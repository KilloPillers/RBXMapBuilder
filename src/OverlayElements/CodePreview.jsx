import { useEffect, useState, useContext, forwardRef } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { MyContext } from "../MyContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MenuTheme } from "../Themes/MenuTheme";
import CheckIcon from "@mui/icons-material/Check";
import Link from "@mui/material/Link";
import "./CodePreview.css";

const CodePreview = forwardRef((props, ref) => {
  const { mapData, updateMap } = useContext(MyContext);
  const [codeType, setCodeType] = useState("Unit");
  const [codeString, setCodeString] = useState("");
  const [unitCode, setUnitCode] = useState("");
  const [mapCode, setMapCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateCode(mapData);
    setCodeString(unitCode);
    setCodeType("Unit");
  }, [props.open]);

  useEffect(() => {
    // ensure prism is loaded before attempting to highlight'
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [codeString]);

  function generateCode(mapData) {
    let deploy_positions = "";
    let action_tiles = "";
    let unit_tiles = [];
    let map_code = "local newheights = {};\n";
    map_code += "local mapXSize = " + mapData.width + ";\n";
    map_code += "local mapYSize = " + mapData.height + ";\n";

    for (let i = 1; i <= mapData.width; i++) {
      map_code += "newheights[" + i + "] = {";
      for (let j = 1; j <= mapData.height; j++) {
        if (mapData.ButtonGrid[i - 1][j - 1].is_deploy_position) {
          deploy_positions +=
            "table.insert(newmap.deployPositions, Vector2.new(" +
            i +
            ", " +
            j +
            "))\n";
        }
        if (mapData.ButtonGrid[i - 1][j - 1].is_action_tile) {
          let tile_name = mapData.ButtonGrid[i - 1][j - 1].tile_name;
          let event_id = mapData.ButtonGrid[i - 1][j - 1].event_id;

          action_tiles +=
            'table.insert(newmap.actiontiles, ActionTile.new("' +
            tile_name +
            '",' +
            event_id +
            ", Vector2.new(" +
            i +
            ", " +
            j +
            ")))\n";
        }
        if (mapData.ButtonGrid[i - 1][j - 1].has_unit) {
          let unit_tile = mapData.ButtonGrid[i - 1][j - 1];
          unit_tiles.push(unit_tile);
        }
        map_code += mapData.ButtonGrid[i - 1][j - 1].tile_height;
        if (j < mapData.height) {
          map_code += ",";
        }
      }
      map_code += "}\n";
    }
    map_code += "local newmap = GameMap.new(newheights, mapXSize, mapYSize)\n";
    map_code += deploy_positions;
    map_code += action_tiles;

    // Unit Code Below
    let unit_code = "";
    let header =
      "local classid = nil;\nlocal currUnitIndex = 1;\nlocal unitid = nil;\nlocal personality = nil;\nlocal enemyUnit = nil;\nlocal position = nil;\n";
    let unit_id_pos =
      "classid = {};\nunitid = {};\nposition = Vector2.new{};\n\nenemyUnit = Unit.new(position, 0,-1)\n";
    let tablecode =
      'enemyUnit.classid = classid\nenemyUnit.weapon = ClassLookup[classid]["WeaponType"];\nenemyUnit.range = ClassLookup[classid]["Move"];\nenemyUnit.class = ClassLookup[classid]["Name"];\nenemyUnit.rawStats = ClassLookup[classid]["StartingStats"]\nenemyUnit.img = ClassLookup[classid]["Image"];\nenemyUnit.unitIndex = currUnitIndex;\ncurrUnitIndex+=1;\nfor i,v in pairs(ClassLookup[classid]["ElementResists"]) do\n    enemyUnit[i] = v;\nend\n\n';
    let unit_stats =
      'enemyUnit.lvl = {}\nenemyUnit.rawStats.maxhp = {}\nenemyUnit.hp = {};\nenemyUnit.rawStats.maxsp = {}\nenemyUnit.sp = {};\nenemyUnit.rawStats.atk = {}\nenemyUnit.rawStats.def = {}\nenemyUnit.rawStats.spd = {}\nenemyUnit.rawStats.hit = {}\nenemyUnit.rawStats.int = {}\nenemyUnit.rawStats.res = {}\nenemyUnit.id = {};\nenemyUnit.name = "{}"\n';
    let footer =
      'personality = "{}"\nenemyUnit.personality = game:GetService("ServerStorage").AIPersonalities:FindFirstChild(personality);\nenemyUnit.deathevent = {};\n\nnewmap:PlaceUnit(enemyUnit,position.x,position.y);\n\n\n';
    unit_code += header;

    for (let i = 0; i < unit_tiles.length; i++) {
      let unit_tile = unit_tiles[i];
      let unit = unit_tile.unit;
      let position =
        "(" +
        (unit_tile.tile_position[0] + 1) +
        ", " +
        (unit_tile.tile_position[1] + 1) +
        ")";
      unit_code += unit_id_pos
        .replace("{}", unit.classID)
        .replace("{}", unit.unitID)
        .replace("{}", position);

      unit_code += tablecode;

      unit_code += unit_stats
        .replace("{}", unit.unitLevel)
        .replace("{}", unit.maxHP)
        .replace("{}", unit.maxHP)
        .replace("{}", unit.maxSP)
        .replace("{}", unit.maxSP)
        .replace("{}", unit.Atk)
        .replace("{}", unit.Def)
        .replace("{}", unit.Spd)
        .replace("{}", unit.Hit)
        .replace("{}", unit.Int)
        .replace("{}", unit.Res)
        .replace("{}", unit.unitID)
        .replace("{}", unit.unitName);

      for (let j = 0; j < unit.skills.length; j++) {
        if (unit.skills[j] !== "") {
          unit_code +=
            "table.insert(enemyUnit.skills," + unit.skills[j] + ")\n";
        }
      }

      unit_code += "\n";

      for (let k = 0; k < unit.passives.length; k++) {
        if (unit.passives[k] !== "") {
          unit_code +=
            "table.insert(enemyUnit.passives," + unit.passives[k] + ")\n";
        }
      }

      unit_code += "\n";
      unit_code += footer
        .replace("{}", unit.personality)
        .replace("{}", unit.deathEvent);
    }

    setUnitCode(unit_code);
    setMapCode(map_code);
  }

  return (
    <ThemeProvider theme={MenuTheme}>
      <Paper className="code-preview">
        <Paper className="code-button-group">
          <Button
            sx={{ margin: "1em" }}
            variant="contained"
            color="secondary"
            onClick={() => {
              props.handleClose();
            }}
          >
            Close
          </Button>
          <Button
            sx={{ margin: "1em" }}
            variant="contained"
            color="secondary"
            onClick={() => {
              setCodeString(mapCode);
              setCodeType("Map");
              if (window.Prism) {
                window.Prism.highlightAll();
              }
            }}
          >
            Map
          </Button>
          <Button
            sx={{ margin: "1em" }}
            variant="contained"
            color="secondary"
            onClick={() => {
              setCodeString(unitCode);
              setCodeType("Unit");
              if (window.Prism) {
                window.Prism.highlightAll();
              }
            }}
          >
            Unit
          </Button>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="caption" gutterBottom>
            {" "}
            {codeType} Code Preview{" "}
          </Typography>
          <Tooltip title="Copy code" arrow>
            <Link
              sx={{ cursor: "pointer" }}
              underline="none"
              onClick={() => {
                navigator.clipboard.writeText(codeString);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              {copied ? (
                <>
                  <CheckIcon sx={{ fontSize: 10 }} />
                  <Typography variant="caption" gutterBottom>
                    {" "}
                    Copied!{" "}
                  </Typography>
                </>
              ) : (
                <>
                  <ContentCopyIcon sx={{ fontSize: 10 }} />
                  <Typography variant="caption" gutterBottom>
                    {" "}
                    Copy code{" "}
                  </Typography>
                </>
              )}
            </Link>
          </Tooltip>
        </Paper>
        <pre>
          <code className="language-lua">{codeString}</code>
        </pre>
      </Paper>
    </ThemeProvider>
  );
});

export default CodePreview;
