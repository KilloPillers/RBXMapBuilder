import * as React from 'react';
import ActionDial from './OverlayElements/ActionDial'; 
import DrawerMenu from './OverlayElements/DrawerMenu';

export default function Overlay({ mapData, updateMap }) {
  return (
    <div className="overlay">
      <ActionDial mapData={mapData} updateMap={updateMap}/>
      <DrawerMenu mapData={mapData} updateMap={updateMap}/>
    </div>
  );
}

