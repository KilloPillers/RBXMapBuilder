// Description: This file contains the Tile class which is used to represent a tile in the scene.
// The Tile class is used by the TileConfig component to display and edit tile properties.
// The Tile class is also used by the Scene component to render the tiles in the scene.
// The Tile class contains a tileJSON property which stores the tile data in JSON format.

import * as THREE from "three";

import { init } from "../Shaders/edgeFinder";

const BLOOM_SCENE = 1;
const ACTION_TILE_COLOR = new THREE.Vector4(1, 0, 0, 1);
const DEPLOY_TILE_COLOR = new THREE.Vector4(0, 0, 1, 1);
const INSPECTED_TILE_COLOR = new THREE.Vector4(1, 165 / 255, 0, 1);
// Grey
const DEFAULT_TILE_COLOR = new THREE.Vector4(0.5, 0.5, 0.5, 1);

const SELECTED_TILE_COLOR = new THREE.Vector4(0, 1, 0, 1);

export default class Tile extends THREE.Object3D {
	constructor(tileJSON) {
		super();
		if (!tileJSON) {
			console.error("Invalid tileJSON: ", tileJSON);
			return;
		}
		this.tileJSON = tileJSON;
		this.is_selected = false;
		this.is_inspected = false;
		this.has_unit = false; // Flag is set to false initially so that addUnit can be called
		this.unitModelRef = null;
		this.unitModel = null;
		this.config = {
			width: 0.05,
			alpha: true,
			invert: false,
			mode: 0,
			wave: 0,
			exp: 1,
			dynamicFgColor: DEFAULT_TILE_COLOR,
			scaleFactor: 1,
		};
		this.geometry = new THREE.BoxGeometry();
		this.cube = init(
			this.geometry,
			THREE.Mesh,
			THREE.ShaderMaterial,
			THREE.Float32BufferAttribute,
			this.config
		);
		this.cube.userData.tile = this;
		this.add(this.cube);
		this.textSprite = null;
		this.unitModel = null;
	}

	getMesh() {
		return this.cube;
	}

	createTextTexture(
		text,
		font = "30px Arial",
		color = "white",
		bgColor = "transparent"
	) {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		context.font = font;
		const textMetrics = context.measureText(text);
		canvas.width = textMetrics.width + 20;
		canvas.height = parseInt(font, 10) + 20;

		context.font = font;
		if (bgColor !== "transparent") {
			context.fillStyle = bgColor;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		context.fillStyle = color;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(text, canvas.width / 2, canvas.height / 2);
		return new THREE.CanvasTexture(canvas);
	}

	createTextSprite(text) {
		const texture = this.createTextTexture(text);
		const spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
		});
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(1, 1, 1); // Scale the sprite
		return sprite;
	}

	updateHeight(height) {
		const scaledDownHeight = height / 5;

		this.cube.scale.y = scaledDownHeight;
		this.cube.position.y = scaledDownHeight / 2;

		this.tileJSON.tile_height = height;
		if (
			this.cube &&
			this.cube.material &&
			this.cube.material.uniforms
		) {
			this.cube.material.uniforms.scaleFactor.value = height;
		} else {
			console.error(
				"Uniforms or scaleFactor is not properly initialized"
			);
		}
		this.cube.material.uniforms.scaleFactor.value = height;

		if (this.textSprite) {
			this.remove(this.textSprite);
		}

		this.textSprite = this.createTextSprite(height.toString());
		this.textSprite.position.set(
			this.cube.position.x,
			scaledDownHeight + 0.5,
			this.cube.position.z
		);
		this.unitModel &&
			this.unitModel.position.set(
				this.cube.position.x - 0.75,
				scaledDownHeight + 0.5,
				this.cube.position.z - 1.75
			);
		this.add(this.textSprite);
	}

	updatePosition(x, z) {
		this.cube.position.x = x;
		this.cube.position.z = z;
	}

	swapTileJSON(newTileJSON) {
		// This function is used to swap the tileJSON object with a new one
		// This is useful when the tile is being moved to a new position
		// and the tileJSON object needs to be updated WITHOUT updating the tileJSON.x and tileJSON.y
		const prvX = this.tileJSON.tile_position[0];
		const prvY = this.tileJSON.tile_position[1];
		//this.tileJSON = { ...newTileJSON }; // Copy the newTileJSON object
		this.tileJSON.event_id = newTileJSON.event_id;
		this.tileJSON.has_unit = newTileJSON.has_unit;
		this.tileJSON.is_action_tile = newTileJSON.is_action_tile;
		this.tileJSON.is_deploy_position =
			newTileJSON.is_deploy_position;
		this.tileJSON.tile_height = newTileJSON.tile_height;
		this.tileJSON.tile_name = newTileJSON.tile_name;
		this.tileJSON.tile_position = [prvX, prvY];
		this.tileJSON.unit = newTileJSON.unit;
		this.resetTile();
	}

	resetTile() {
		// This function initialized the tile based on the tileJSON object
		this.updateColor();
		this.updateHeight(this.tileJSON.tile_height);
		if (this.tileJSON.has_unit) {
			this.addUnit();
		} else {
			this.removeUnit();
		}
		if (this.tileJSON.is_deploy_position) {
			this.setDeployPosition(true);
		}
		if (this.tileJSON.is_action_tile) {
			this.setActionTile(true);
		}
	}

	updateColor() {
		let colorHex;

		if (this.is_inspected) {
			colorHex = INSPECTED_TILE_COLOR;
		} else if (this.is_selected) {
			colorHex = SELECTED_TILE_COLOR;
		} else if (this.tileJSON.is_action_tile) {
			colorHex = ACTION_TILE_COLOR;
		} else if (this.tileJSON.is_deploy_position) {
			colorHex = DEPLOY_TILE_COLOR;
		} else {
			colorHex = DEFAULT_TILE_COLOR;
		}
		this.cube.material.uniforms.dynamicFgColor.value = colorHex;
		if (colorHex !== DEFAULT_TILE_COLOR) {
			this.cube.layers.enable(BLOOM_SCENE);
		} else {
			this.cube.layers.disable(BLOOM_SCENE);
		}
	}

	updateDeployPosition() {
		this.tileJSON.is_deploy_position =
			!this.tileJSON.is_deploy_position;
		this.updateColor();
	}

	updateActionTile() {
		this.tileJSON.is_action_tile = !this.tileJSON.is_action_tile;
		this.updateColor();
	}

	addUnit() {
		if (!this.unitModelRef) {
			console.error("Invalid unitModelRef: ", unitModelRef);
			return;
		}
		if (this.has_unit) {
			// Unit already exists on this tile do nothing
			return;
		}
		this.tileJSON.has_unit = true;
		this.has_unit = true;
		const scaledDownHeight = this.tileJSON.tile_height / 5;

		// Clone the model Group
		const unitGroup = this.unitModelRef.clone();

		// Apply translation to the unit group
		unitGroup.position.set(
			this.cube.position.x - 0.75,
			scaledDownHeight + 0.5,
			this.cube.position.z - 1.75
		);

		this.unitModel = unitGroup;
		unitGroup.name = "unitModel";
		this.add(unitGroup);
	}

	removeUnit() {
		const unit = this.getObjectByName("unitModel");
		if (unit) {
			this.remove(unit);
			this.tileJSON.has_unit = false;
			this.has_unit = false;
		}
	}

	setDeployPosition(isDeployPosition) {
		this.tileJSON.is_deploy_position = isDeployPosition;
		this.updateColor();
	}

	setActionTile(isActionTile) {
		this.tileJSON.is_action_tile = isActionTile;
		this.updateColor();
	}

	setTransparent(isTransparent) {
		if (isTransparent) {
			this.cube.material.transparent = true;
			this.cube.material.opacity = 0.5;
		} else {
			this.cube.material.transparent = false;
			this.cube.material.opacity = 1;
		}
	}
}
