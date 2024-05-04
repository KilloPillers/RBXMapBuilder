import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import Divider from '@mui/material/Divider';
import './DrawerMenu.css';

import { IconButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import CodeIcon from '@mui/icons-material/Code';

export default function DrawerMenu({ mapData, updateMap }) {
  const [open, setOpen] = useState(false);  
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
            color='primary'>
            </IconButton>
          </Paper>
          <Divider />
          <Paper>
            <IconButton 
              children={<PeopleIcon/>}
              color='primary'>
            </IconButton>
          </Paper>
          <Divider />
          <Paper>
            <IconButton 
              children={<CodeIcon/>}
              color='primary'>
            </IconButton>
          </Paper>
        </Box>
        <Box
          className="drawer-menu"
        >
          <h2>Menu</h2>
          <Divider />
          <h3>Map Settings</h3>
          <p>Width: {mapData.width}</p>
          <p>Height: {mapData.height}</p>
          <Divider />
          <h3>Map Actions</h3>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
