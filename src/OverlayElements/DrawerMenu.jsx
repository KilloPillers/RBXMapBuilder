import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import './DrawerMenu.css';


export default function DrawerMenu({ mapData, updateMap }) {
  const [open, setOpen] = useState(false);  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box
      className="drawer-menu-container" 
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <Box className="drawer-menu-side-panel">
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
  );
}

