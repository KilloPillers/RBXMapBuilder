import * as React from 'react';
import { useRef } from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { MyContext } from '../MyContext';
import "./DrawerMenu.css"


const defaultUnitData = {
                    "unitLevel": "",
                    "unitName": "",
                    "classID": "",
                    "unitID": "",
                    "personality": "RandomAction",
                    "deathEvent": "nil",
                    "maxHP": "",
                    "maxSP": "",
                    "Atk": "",
                    "Def": "",
                    "Spd": "",
                    "Hit": "",
                    "Int": "",
                    "Res": "",
                    "skills": [
                        "",
                        "",
                        "",
                        ""
                    ],
                    "passives": [
                        "",
                        "",
                        ""
                    ]
                }

export default function UnitConfig() {
  const { mapData, updateMap, selectedCubes, unitModelRef } = React.useContext(MyContext);
  const unitNameRef = useRef(null);
  const unitLevelRef = useRef(null);
  const classIdRef = useRef(null);
  const unitIdRef = useRef(null);
  const deathEventRef = useRef(null);
  const maxHpRef = useRef(null);
  const maxSpRef = useRef(null);
  const unitAtkRef = useRef(null);
  const unitDefRef = useRef(null);
  const unitSpdRef = useRef(null);
  const unitHitRef = useRef(null);
  const unitIntRef = useRef(null);
  const unitResRef = useRef(null);
  const skill1Ref = useRef(null);
  const skill2Ref = useRef(null);
  const skill3Ref = useRef(null);
  const skill4Ref = useRef(null);
  const passive1Ref = useRef(null);
  const passive2Ref = useRef(null);
  const passive3Ref = useRef(null);

  const handleDelete = () => {
    console.log('Delete unit');
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      cube.tileJSON.unit = defaultUnitData;
      cube.removeUnit();
    }
  };

  const handleSave = () => {
    const unitData = {
      unitName: unitNameRef.current.value,
      unitLevel: unitLevelRef.current.value,
      classId: classIdRef.current.value,
      unitId: unitIdRef.current.value,
      deathEvent: deathEventRef.current.value,
      maxHp: maxHpRef.current.value,
      maxSp: maxSpRef.current.value,
      unitAtk: unitAtkRef.current.value,
      unitDef: unitDefRef.current.value,
      unitSpd: unitSpdRef.current.value,
      unitHit: unitHitRef.current.value,
      unitInt: unitIntRef.current.value,
      unitRes: unitResRef.current.value,
      skills: {
        skill1: skill1Ref.current.value,
        skill2: skill2Ref.current.value,
        skill3: skill3Ref.current.value,
        skill4: skill4Ref.current.value,
      },
      passives: {
        passive1: passive1Ref.current.value,
        passive2: passive2Ref.current.value,
        passive3: passive3Ref.current.value,
      },
    };

    console.log(unitData);
    
    for (let i = 0; i < selectedCubes.length; i++) {
      const cube = selectedCubes[i];
      const unit = cube.tileJSON.unit;
      if (unit) {
        cube.unit = unitData;
        cube.addUnit(unitModelRef.current);
      }
    }

    //updateMap(mapData); // Not sure if this is necessary
  };

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className='drawer-menu-header'>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Unit Configuration
          </Typography>
        </Paper>
      </Box>
      <Box className='drawer-menu-unit-config'>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Unit Profile
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="unit-name"
              label="Unit Name"
              variant="outlined"
              defaultValue=""
              inputRef={unitNameRef}
            />
            <TextField
              id="unit-level"
              label="Unit Level"
              variant="outlined"
              defaultValue=""
              inputRef={unitLevelRef}
            />
            <TextField
              id="class-id"
              label="Class ID"
              variant="outlined"
              defaultValue=""
              inputRef={classIdRef}
            />
            <TextField
              id="unit-id"
              label="Unit ID"
              variant="outlined"
              defaultValue=""
              inputRef={unitIdRef}
            />
            <TextField
              id="death-event"
              label="Death Event"
              variant="outlined"
              defaultValue=""
              inputRef={deathEventRef}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Unit Stats
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="max-hp"
              label="Max HP"
              variant="outlined"
              defaultValue=""
              inputRef={maxHpRef}
            />
            <TextField
              id="max-sp"
              label="Max SP"
              variant="outlined"
              defaultValue=""
              inputRef={maxSpRef}
            />
            <TextField
              id="unit-atk"
              label="Atk"
              variant="outlined"
              defaultValue=""
              inputRef={unitAtkRef}
            />
            <TextField
              id="unit-def"
              label="Def"
              variant="outlined"
              defaultValue=""
              inputRef={unitDefRef}
            />
            <TextField
              id="unit-Spd"
              label="Spd"
              variant="outlined"
              defaultValue=""
              inputRef={unitSpdRef}
            />
            <TextField
              id="unit-Hit"
              label="Hit"
              variant="outlined"
              defaultValue=""
              inputRef={unitHitRef}
            />
            <TextField
              id="unit-Int"
              label="Int"
              variant="outlined"
              defaultValue=""
              inputRef={unitIntRef}
            />
            <TextField
              id="unit-Res"
              label="Res"
              variant="outlined"
              defaultValue=""
              inputRef={unitResRef}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Unit Skills
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="skill-1"
              label="Skill 1"
              variant="outlined"
              defaultValue=""
              inputRef={skill1Ref}
            />
            <TextField
              id="skill-2"
              label="Skill 2"
              variant="outlined"
              defaultValue=""
              inputRef={skill2Ref}
            />
            <TextField
              id="skill-3"
              label="Skill 3"
              variant="outlined"
              defaultValue=""
              inputRef={skill3Ref}
            />
            <TextField
              id="skill-4"
              label="Skill 4"
              variant="outlined"
              defaultValue=""
              inputRef={skill4Ref}
            />
          </FormGroup>
        </Paper>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Unit Passives
          </Typography>
          <Divider />
          <FormGroup>
            <TextField
              id="passive-1"
              label="Passive 1"
              variant="outlined"
              defaultValue=""
              inputRef={passive1Ref}
            />
            <TextField
              id="passive-2"
              label="Passive 2"
              variant="outlined"
              defaultValue=""
              inputRef={passive2Ref}
            />
            <TextField
              id="passive-3"
              label="Passive 3"
              variant="outlined"
              defaultValue=""
              inputRef={passive3Ref}
            />
          </FormGroup>
          <Divider />
        </Paper>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '25px',
        }}
      >
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSave}
        >
          Save Unit
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDelete}
        >
          Delete Unit
        </Button>
      </Box>
    </ThemeProvider>
  );
}

