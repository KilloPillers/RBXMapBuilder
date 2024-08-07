import { useContext, useState, useRef } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import Box from "@mui/material/Box";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CodeIcon from "@mui/icons-material/Code";
import SaveIcon from "@mui/icons-material/Save";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import { open } from "@tauri-apps/api/dialog";
import { save } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/api/fs";
import { readTextFile } from "@tauri-apps/api/fs";
import CodePreview from "./CodePreview";
import { MyContext } from "../MyContext";
import MapCreateModal from "./MapCreateModal";

export default function ActionDial() {
  const { mapData, updateMap } = useContext(MyContext);
  const [openCodePreview, setOpenCodePreview] = useState(false);
  const [openMapCreateModal, setOpenMapCreateModal] = useState(false);
  const rootRef = useRef(null);
  const handleOpenCodePreview = () => setOpenCodePreview(true);
  const handleCloseCodePreview = () => setOpenCodePreview(false);
  const handleOpenMapCreateModal = () => setOpenMapCreateModal(true);
  const handleCloseMapCreateModal = () => setOpenMapCreateModal(false);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const actions = [
    { icon: <CodeIcon />, name: "Code", onClick: handleOpenCodePreview },
    { icon: <SaveIcon />, name: "Save", onClick: handleSave },
    { icon: <FileOpenIcon />, name: "Open", onClick: openMap },
    {
      icon: <NoteAddIcon />,
      name: "Create",
      onClick: handleOpenMapCreateModal,
    },
  ];

  async function openMap() {
    try {
      const filePath = await open({
        directory: false,
        defaultPath: await appDir(),
        filters: [{ name: "Map File", extensions: ["json"] }],
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

  async function handleSave() {
    try {
      const defaultPath = `${await appDir()}/untitled.json`;
      const filePath = await save({
        defaultPath: defaultPath,
        description: "Save Map File",
        filters: [{ name: "Map File", extensions: ["json"] }],
      });
      if (filePath === undefined) {
        return;
      }
      const jsonData = JSON.stringify(mapData);
      await writeTextFile(filePath, jsonData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ThemeProvider theme={MenuTheme}>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", bottom: 16, left: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            color={"#5F5F5F"}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <Fade in={openCodePreview}>
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          sx={{
            display: "flex",
            p: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          container={() => rootRef.current}
          onMouseUp={(e) => {
            stopPropagation(e);
          }}
        >
          <CodePreview
            open={openCodePreview}
            handleClose={handleCloseCodePreview}
          />
        </Modal>
      </Fade>
      <Fade in={openMapCreateModal}>
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          onClose={handleCloseMapCreateModal}
          open
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          sx={{
            display: "flex",
            p: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          container={() => rootRef.current}
          onMouseUp={(e) => {
            stopPropagation(e);
          }}
        >
          <MapCreateModal handleClose={handleCloseMapCreateModal} />
        </Modal>
      </Fade>
    </ThemeProvider>
  );
}
