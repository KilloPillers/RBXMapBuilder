import * as React from 'react';
import ActionDial from './OverlayElements/ActionDial'; 
import DrawerMenu from './OverlayElements/DrawerMenu';

export default function Overlay({ mapData, updateMap, selectedCubes }) {
  return (
    <div className="overlay">
      <ActionDial mapData={mapData} updateMap={updateMap} selectedCubes={selectedCubes}/>
      <DrawerMenu mapData={mapData} updateMap={updateMap} selectedCubes={selectedCubes}/>
    </div>
  );
}

