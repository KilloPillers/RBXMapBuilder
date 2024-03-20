import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/api/fs';



export default function ActionDial({ mapData, updateMap }) {
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <FileOpenIcon />, name: 'Open', onClick: openMap },
  ];

  async function openMap() {
    try {
      const filePath = await open({
        directory: false,
        defaultPath: await appDir(),
        filters: [{ name: 'Map File', extensions: ['json'] }] 
      });
      if (filePath === undefined) {
        return;
      }
      const fileContent = await readTextFile(filePath);
      const jsonData = JSON.parse(fileContent);
      updateMap(jsonData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      sx={{ position: 'absolute', bottom: 16, left: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
}

