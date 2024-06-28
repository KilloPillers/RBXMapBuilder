import * as React from 'react';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper'; 
import Button from '@mui/material/Button';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { MenuTheme } from '../Themes/MenuTheme';
import './CodePreview.css';

const testCodeString = `local classid = nil;
local currUnitIndex = 1;
local unitid = nil;
local personality = nil;
local enemyUnit = nil;
local position = nil;
classid = 21;
unitid = 4;
position = Vector2.new(1, 11);

enemyUnit = Unit.new(position, 0,-1)
enemyUnit.classid = classid
enemyUnit.weapon = ClassLookup[classid]["WeaponType"];
enemyUnit.range = ClassLookup[classid]["Move"];
enemyUnit.class = ClassLookup[classid]["Name"];
enemyUnit.rawStats = ClassLookup[classid]["StartingStats"]
enemyUnit.img = ClassLookup[classid]["Image"];
enemyUnit.unitIndex = currUnitIndex;
currUnitIndex+=1;
for i,v in pairs(ClassLookup[classid]["ElementResists"]) do
    enemyUnit[i] = v;
end

enemyUnit.lvl = 3
enemyUnit.rawStats.maxhp = 50
enemyUnit.hp = 50;
enemyUnit.rawStats.maxsp = 20
enemyUnit.sp = 20;
enemyUnit.rawStats.atk = 21
enemyUnit.rawStats.def = 16
enemyUnit.rawStats.spd = 14
enemyUnit.rawStats.hit = 15
enemyUnit.rawStats.int = 10
enemyUnit.rawStats.res = 10
enemyUnit.id = 4;
enemyUnit.name = "Rita"` 

const CodePreview = React.forwardRef((props, ref) => {
  const [codeType, setCodeType] = React.useState('Unit');
  const [codeString, setCodeString] = React.useState(testCodeString);
  
  useEffect(() => {
    // ensure prism is loade before attempting to highlight'
    if (window.Prism) {
      console.log('highlighting code');
      window.Prism.highlightAll();
    }
  }, []);

  return (
    <ThemeProvider theme={MenuTheme}>
      <Paper className="code-preview">
        <Paper className="code-button-group">
        <Button
          sx={{margin: '1em'}}
          variant="contained"
          color="secondary"
          onClick={() => {
              console.log('close button clicked')
              props.handleClose();
            }}
        >Close</Button>
        <Button
          sx={{margin: '1em'}}
          variant="contained"
          color="secondary"
        >Map</Button>
        <Button
          sx={{margin: '1em'}}
          variant="contained"
          color="secondary"
        >Unit</Button>
        </Paper>
        <h3>{codeType} Code Preview</h3>
        <pre>
          <code className="language-lua">
            {codeString}
          </code>
        </pre>
      </Paper>
    </ThemeProvider>
  )
});

export default CodePreview;
