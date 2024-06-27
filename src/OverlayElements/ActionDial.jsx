import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import Box from '@mui/material/Box';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { ThemeProvider } from '@mui/material/styles';
import { MenuTheme } from '../Themes/MenuTheme';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/api/fs';
import CodePreview from './CodePreview'; 
import { MyContext } from '../MyContext';



export default function ActionDial() {
  const { mapData, updateMap } = React.useContext(MyContext);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <CodeIcon />, name: 'Code', onClick: handleOpen },
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
    <ThemeProvider theme={MenuTheme}>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'absolute',
              bottom: 16, 
              left: 16,
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            color={'#5F5F5F'}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <Fade in={open}>
        <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        sx={{
          display: 'flex',
          p: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        container={() => rootRef.current}
      >
            <CodePreview/>
        </Modal>
      </Fade>
    </ThemeProvider>
  );
}
