import * as React from 'react';
import "./ToolBar.css";
import { ThemeProvider } from "@mui/material/styles";
import { MenuTheme } from "../Themes/MenuTheme";
import { MyContext } from "../MyContext";
import Paper from "@mui/material/Paper";
import SearchIcon from '@mui/icons-material/Search';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToolBar() {
  const { tool, setTool } = React.useContext(MyContext); 

  const stopPropagation = (e) => {
  e.stopPropagation();
  }

  const handleTool = (event, newTool) => {
    setTool(newTool);
  };

  return (
    <ThemeProvider theme={MenuTheme}>
        <Paper className="toolbar">
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={handleTool}
          aria-label="text tool"
          size="small"
          color="primary"
          onMouseDown={(e) => {
            stopPropagation(e);
          }}
        >
          <ToggleButton value="inspect" aria-label="left aligned"
          >
            <SearchIcon
              color={tool === "inspect" ? "secondary" : "primary"}
            />
          </ToggleButton>
          <ToggleButton value="select" aria-label="centered"
          >
            <HighlightAltIcon 
              color={tool === "select" ? "secondary" : "primary"}
            />
          </ToggleButton>
          <ToggleButton value="move" aria-label="right aligned"
          >
            <OpenWithIcon 
              color={tool === "move" ? "secondary" : "primary"}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </ThemeProvider>
  );
}
