// Description: This file contains the Tile class which is used to represent a tile in the scene.
// The Tile class is used by the TileConfig component to display and edit tile properties.
// The Tile class is also used by the Scene component to render the tiles in the scene.
// The Tile class contains a dataJSON property which stores the tile data in JSON format.

import * as THREE from 'three';

import { init } from '../Shaders/edgeFinder' 

const ACTION_TILE_COLOR = new THREE.Vector4(1, 0, 0, 1);
const DEPLOY_TILE_COLOR = new THREE.Vector4(0, 0, 1, 1);
// Grey
const DEFAULT_TILE_COLOR = new THREE.Vector4(0.5, 0.5, 0.5, 1); 

const SELECTED_TILE_COLOR = new THREE.Vector4(0, 1, 0, 1);

export default class Tile extends THREE.Object3D { 
	constructor(dataJSON) {
		super();
		if (!dataJSON) {
			console.error("Invalid dataJSON");
			return;
		}
		this.dataJSON = dataJSON;
		this.is_selected = false;
		this.config = {
			width: 0.05,
			alpha: true, 
			invert: false, 
			mode: 0, 
			wave: 0, 
			exp: 1, 
			dynamicFgColor: DEFAULT_TILE_COLOR,
			scaleFactor: dataJSON.tile_height ,
		};
		this.geometry = new THREE.BoxGeometry();
		this.cube = init(this.geometry, THREE.Mesh, THREE.ShaderMaterial, THREE.Float32BufferAttribute, this.config);
		
		// Set the scale and position of the cube.
		//
		//this.cube.position.y = dataJSON.tile_height/2;
		//this.cube.scale.set(1, dataJSON.tile_height, 1);
		
		this.cube.userData.tile = this;
	}

	updateHeight(height) {

		//this.cube.geometry.scale(1, 1/this.cube.scale.y, 1);
		this.cube.scale.y = height;
		this.cube.position.y = height/2;
		//this.cube.geometry.translate(0, height/2, 0);
		
		this.dataJSON.tile_height = height;
		if (this.cube && this.cube.material && this.cube.material.uniforms) {
		    this.cube.material.uniforms.scaleFactor.value = height;
		} else {
		    console.error('Uniforms or scaleFactor is not properly initialized');
		}
		this.cube.material.uniforms.scaleFactor.value = height;
	}

	updatePosition(x, z) {
		this.cube.position.x = x;
		this.cube.position.z = z;
	}

	updateColor() {
		let colorHex;
		if (this.dataJSON.is_action_tile) {
			colorHex = ACTION_TILE_COLOR;
		} else if (this.dataJSON.is_deploy_position) {
			colorHex = DEPLOY_TILE_COLOR;
		} else if (this.is_selected) {
			colorHex = SELECTED_TILE_COLOR;
		}
		else {
			colorHex = DEFAULT_TILE_COLOR;
		}
		this.cube.material.uniforms.dynamicFgColor.value = colorHex;	
	}
	
	updateDeployPosition() {
		this.dataJSON.is_deploy_position = !this.dataJSON.is_deploy_position;
		this.updateColor();
	}

	updateActionTile() {
		this.dataJSON.is_action_tile = !this.dataJSON.is_action_tile;
		this.updateColor();
	}
}

