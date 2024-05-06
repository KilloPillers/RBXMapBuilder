import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import "./DrawerMenu.css"

export default function TileConfig({ mapData, updateMap }) {
  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }


  return (
    <ThemeProvider theme={MenuTheme}>
      <Box className='drawer-menu-header'>
        <Paper>
          <Typography variant='h6' color={'text.pimary'} sx={{margin: '10px'}}>
            Tile Configuration
          </Typography>
        </Paper>
      </Box>
      <Box className='drawer-menu-tile-config'>
          <Box>
            <Paper className='drawer-menu-height-slider'>
              <Slider
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: 'slider-vertical',
                  },
                }}
                orientation="vertical"
                defaultValue={30}
                aria-label="Temperature"
                valueLabelDisplay="auto"
                onKeyDown={preventHorizontalKeyboardNavigation}
              />
              <Typography id="vertical-slider" gutterBottom fontSize={10}>
                Height
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper className='drawer-menu-deploy-action'>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Deploy Position"
                />
                <Divider />
                <FormControlLabel
                  control={<Checkbox/>}
                  label="Action Position"
                />
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
