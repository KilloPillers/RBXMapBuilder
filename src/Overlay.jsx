import * as React from 'react';
import ActionDial from './OverlayElements/ActionDial'; 
import DrawerMenu from './OverlayElements/DrawerMenu';

export default function Overlay() {
  return (
    <div className="overlay">
      <ActionDial/> 
      <DrawerMenu/>
    </div>
  );
}

