import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import Divider from '@mui/material/Divider';
import './DrawerMenu.css';

import TileConfig from './TileConfig';

import { IconButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import CodeIcon from '@mui/icons-material/Code';
import LayersIcon from '@mui/icons-material/Layers';
import UnitConfig from './UnitConfig';

export default function DrawerMenu({ mapData, updateMap }) {
  const [open, setOpen] = useState(false); 
  const [menu, setMenu] = useState('unit-config'); // ['unit-config', 'tile-config'
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box
        className="drawer-menu-container" 
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <Box className="drawer-menu-side-panel">
          <Paper>
            <IconButton 
              children={<GridViewIcon/>}
              color='primary'
              onClick={() => setMenu('tile-config')}
            />
          </Paper>
          <Divider />
          <Paper>
            <IconButton 
              children={<PeopleIcon/>}
              color='primary'
              onClick={() => setMenu('unit-config')}
            />
          </Paper>
          <Divider />
          <Paper>
            <IconButton 
              children={<CodeIcon/>}
              color='primary'>
            </IconButton>
          </Paper>
          <Divider />
          <Paper>
            <IconButton 
              children={<LayersIcon/>}
              color='primary'>
            </IconButton>
          </Paper>
        </Box>
        <Box
          className="drawer-menu"
        >
          {menu === 'unit-config' && 
            <UnitConfig mapData={mapData} updateMap={updateMap} />
          }
          {menu === 'tile-config' && 
            <TileConfig mapData={mapData} updateMap={updateMap} />
          }
        </Box>
      </Box>
    </ThemeProvider>
  );
}
