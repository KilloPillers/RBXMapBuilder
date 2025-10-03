import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MyContext } from "../MyContext";
import "./DrawerMenu.css";

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

export default function UnitConfig() {
  const { mapData, updateMap, selectedCubes, unitModelRef, inspectedTile } =
    React.useContext(MyContext);

  const [unitName, setUnitName] = useState("");
  const [unitLevel, setUnitLevel] = useState("");
  const [classId, setClassId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [personality, setPersonality] = useState("RandomAction");
  const [deathEvent, setDeathEvent] = useState("nil");
  const [maxHP, setMaxHP] = useState("");
  const [maxSp, setMaxSP] = useState("");
  const [unitAtk, setUnitAtk] = useState("");
  const [unitDef, setUnitDef] = useState("");
  const [unitSpd, setUnitSpd] = useState("");
  const [unitHit, setUnitHit] = useState("");
  const [unitInt, setUnitInt] = useState("");
  const [unitRes, setUnitRes] = useState("");
  const [skill1, setSkill1] = useState("");
  const [skill2, setSkill2] = useState("");
  const [skill3, setSkill3] = useState("");
  const [skill4, setSkill4] = useState("");
  const [passive1, setPassive1] = useState("");
  const [passive2, setPassive2] = useState("");
  const [passive3, setPassive3] = useState("");

  const [key, setKey] = useState(0);

  const handleDelete = () => {
    if (selectedCubes.length === 0) {
      return;
    }
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.tileJSON.unit = defaultUnitData;
      cube.removeUnit();
    }
  };

  useEffect(() => {
    if (inspectedTile) {
      const unit = inspectedTile.tileJSON.unit;
      setUnitName(unit.unitName);
      setUnitLevel(unit.unitLevel);
      setClassId(unit.classId);
      setUnitId(unit.unitId);
      setPersonality(unit.personality);
      setDeathEvent(unit.deathEvent);
      setMaxHP(unit.maxHP);
      setMaxSP(unit.maxSP);
      setUnitAtk(unit.Atk);
      setUnitDef(unit.Def);
      setUnitSpd(unit.Spd);
      setUnitHit(unit.Hit);
      setUnitInt(unit.Int);
      setUnitRes(unit.Res);
      setSkill1(unit.skills[0]);
      setSkill2(unit.skills[1]);
      setSkill3(unit.skills[2]);
      setSkill4(unit.skills[3]);
      setPassive1(unit.passives[0]);
      setPassive2(unit.passives[1]);
      setPassive3(unit.passives[2]);
      setKey((prevKey) => prevKey + 1); // Force re-render
    }
  }, [inspectedTile]);

  const handleSave = () => {
    const unitData = {
      unitName: unitName,
      unitLevel: unitLevel,
      classId: classId,
      unitId: unitId,
      personality: personality,
      deathEvent: deathEvent,
      maxHP: maxHP,
      maxSP: maxSp,
      Atk: unitAtk,
      Def: unitDef,
      Spd: unitSpd,
      Hit: unitHit,
      Int: unitInt,
      Res: unitRes,
      skills: [skill1, skill2, skill3, skill4],
      passives: [passive1, passive2, passive3],
    };

    if (selectedCubes.length === 0) {
      return;
    }
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      const unit = cube.tileJSON.unit;
      if (unit) {
        cube.tileJSON.unit = unitData;
        cube.addUnit(unitModelRef.current);
      }
    }
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
            Unit Configuration
          </Typography>
        </Paper>
      </Box>
      <Box className="drawer-menu-unit-config" key={key}>
        <Paper>
          <Typography
            variant="h6"
            color={"text.pimary"}
            sx={{ margin: "10px" }}
          >
            Unit Profile
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="unit-name"
              label="Unit Name"
              variant="outlined"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
            <TextField
              id="unit-level"
              label="Unit Level"
              variant="outlined"
              value={unitLevel}
              onChange={(e) => setUnitLevel(e.target.value)}
            />
            <TextField
              id="class-id"
              label="Class ID"
              variant="outlined"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            />
            <TextField
              id="unit-id"
              label="Unit ID"
              variant="outlined"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
            />
            <TextField
              id="personality"
              label="Personality"
              variant="outlined"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
            />
            <TextField
              id="death-event"
              label="Death Event"
              variant="outlined"
              value={deathEvent}
              onChange={(e) => setDeathEvent(e.target.value)}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography
            variant="h6"
            color={"text.pimary"}
            sx={{ margin: "10px" }}
          >
            Unit Stats
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="max-hp"
              label="Max HP"
              variant="outlined"
              value={maxHP}
              onChange={(e) => setMaxHP(e.target.value)}
            />
            <TextField
              id="max-sp"
              label="Max SP"
              variant="outlined"
              value={maxSp}
              onChange={(e) => setMaxSP(e.target.value)}
            />
            <TextField
              id="unit-atk"
              label="Atk"
              variant="outlined"
              value={unitAtk}
              onChange={(e) => setUnitAtk(e.target.value)}
            />
            <TextField
              id="unit-def"
              label="Def"
              variant="outlined"
              value={unitDef}
              onChange={(e) => setUnitDef(e.target.value)}
            />
            <TextField
              id="unit-Spd"
              label="Spd"
              variant="outlined"
              value={unitSpd}
              onChange={(e) => setUnitSpd(e.target.value)}
            />
            <TextField
              id="unit-Hit"
              label="Hit"
              variant="outlined"
              value={unitHit}
              onChange={(e) => setUnitHit(e.target.value)}
            />
            <TextField
              id="unit-Int"
              label="Int"
              variant="outlined"
              value={unitInt}
              onChange={(e) => setUnitInt(e.target.value)}
            />
            <TextField
              id="unit-Res"
              label="Res"
              variant="outlined"
              value={unitRes}
              onChange={(e) => setUnitRes(e.target.value)}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography
            variant="h6"
            color={"text.pimary"}
            sx={{ margin: "10px" }}
          >
            Unit Skills
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="skill-1"
              label="Skill 1"
              variant="outlined"
              value={skill1}
              onChange={(e) => setSkill1(e.target.value)}
            />
            <TextField
              id="skill-2"
              label="Skill 2"
              variant="outlined"
              value={skill2}
              onChange={(e) => setSkill2(e.target.value)}
            />
            <TextField
              id="skill-3"
              label="Skill 3"
              variant="outlined"
              value={skill3}
              onChange={(e) => setSkill3(e.target.value)}
            />
            <TextField
              id="skill-4"
              label="Skill 4"
              variant="outlined"
              value={skill4}
              onChange={(e) => setSkill4(e.target.value)}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography
            variant="h6"
            color={"text.pimary"}
            sx={{ margin: "10px" }}
          >
            Unit Passives
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="passive-1"
              label="Passive 1"
              variant="outlined"
              value={passive1}
              onChange={(e) => setPassive1(e.target.value)}
            />
            <TextField
              id="passive-2"
              label="Passive 2"
              variant="outlined"
              value={passive2}
              onChange={(e) => setPassive2(e.target.value)}
            />
            <TextField
              id="passive-3"
              label="Passive 3"
              variant="outlined"
              value={passive3}
              onChange={(e) => setPassive3(e.target.value)}
            />
          </FormGroup>
          <Divider />
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: "25px",
        }}
      >
        <Button variant="contained" color="success" onClick={handleSave}>
          Save Unit
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete Unit
        </Button>
      </Box>
    </ThemeProvider>
  );
}
