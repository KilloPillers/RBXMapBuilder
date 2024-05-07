import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import "./DrawerMenu.css"

export default function UnitConfig({ mapData, updateMap }) {

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
            />
            <TextField
              id="unit-level"
              label="Unit Level"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="class-id"
              label="Class ID"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-id"
              label="Unit ID"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="death-event"
              label="Death Event"
              variant="outlined"
              defaultValue=""
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
            />
            <TextField
              id="max-sp"
              label="Max SP"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-atk"

              label="Atk"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-def"
              label="Def"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-Spd"
              label="Spd"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-Hit"
              label="Hit"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-Int"
              label="Int"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="unit-Res"
              label="Res"
              variant="outlined"
              defaultValue=""
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
            />
            <TextField
              id="skill-2"
              label="Skill 2"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="skill-3"
              label="Skill 3"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="skill-4"
              label="Skill 4"
              variant="outlined"
              defaultValue=""
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
            />
            <TextField
              id="passive-2"
              label="Passive 2"
              variant="outlined"
              defaultValue=""
            />
            <TextField
              id="passive-3"
              label="Passive 3"
              variant="outlined"
              defaultValue=""
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
        <Button variant="contained" color="success">
          Save Unit
        </Button>
        <Button variant="contained" color="error">
          Delete Unit
        </Button>
      </Box>
    </ThemeProvider>
  );
}

