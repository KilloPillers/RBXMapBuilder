import * as React from 'react';
import ActionDial from './OverlayElements/ActionDial'; 
import DrawerMenu from './OverlayElements/DrawerMenu';
import ToolBar from './OverlayElements/ToolBar';

export default function Overlay() {
  return (
    <div className="overlay">
      <ToolBar/>
      <ActionDial/> 
      <DrawerMenu/>
    </div>
  );
}

