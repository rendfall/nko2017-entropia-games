import Phaser from 'phaser';

import { SPRITES_CONFIG } from '../config';

export default class AbstractSprite extends Phaser.Sprite {
    spriteName = null;
    spritesheetPath = null;
    initialTile = null;
    currentTile = null;
    nextTile = null;
    animationSpeed = 0;
    isWalkingAnimation = false;
    collisions = null;
    walkingDirection = null;
    walkingSpeed = 0;
    isMoving = false;
    tilemap = null;
    keyPressState = {
        up: false,
        right: false,
        down: false,
        left: false
    };

    constructor(game, tilemap, spriteName) {
        super(game, 0, 0, spriteName);
        this.tilemap = tilemap;
        this.spriteName = spriteName;
    }

    addBasicAnimation() {
        let { STILL_DOWN, STILL_UP, STILL_SIDE } = SPRITES_CONFIG.animations;
        let { WALKING_DOWN, WALKING_UP, WALKING_SIDE } = SPRITES_CONFIG.animations;

        this.animations.add(STILL_DOWN, [0]);
        this.animations.add(STILL_UP, [2]);
        this.animations.add(STILL_SIDE, [4]);
        this.animations.add(WALKING_DOWN, [0, 1], this.animationSpeed, true);
        this.animations.add(WALKING_UP, [2, 3], this.animationSpeed, true);
        this.animations.add(WALKING_SIDE, [4, 5], this.animationSpeed, true);
    }

    setupIdleAnimation() {
        let { UP, RIGHT, DOWN, LEFT } = SPRITES_CONFIG.directions;
        let { STILL_DOWN, STILL_UP, STILL_SIDE } = SPRITES_CONFIG.animations;

        switch(this.walkingDirection) {
            case UP:
                this.animations.play(STILL_UP);
                break;

            case RIGHT:
                this.scale.x = -1;
                this.animations.play(STILL_SIDE);
                break;

            case DOWN:
                this.animations.play(STILL_DOWN);
                break;

            case LEFT:
                this.scale.x = 1;
                this.animations.play(STILL_SIDE);
                break;
        }
        this.animations.stop();
    }

    setupWalkingAnimation() {
        let { UP, RIGHT, DOWN, LEFT } = SPRITES_CONFIG.directions;
        let { WALKING_DOWN, WALKING_UP, WALKING_SIDE } = SPRITES_CONFIG.animations;

        switch (this.walkingDirection) {
            case UP:
                this.animations.play(WALKING_UP);
                break;

            case RIGHT:
                this.scale.x = -1;
                this.animations.play(WALKING_SIDE);
                break;

            case DOWN:
                this.animations.play(WALKING_DOWN);
                break;

            case LEFT:
                this.scale.x = 1;
                this.animations.play(WALKING_SIDE);
                break;
        }
    }

    setupAnimation() {
        if (this.isWalkingAnimation) {
            this.setupWalkingAnimation();
        } else {
            this.setupIdleAnimation();
        }
    }

    move() {
        if (!this.isMoving) return;

        let { UP, RIGHT, DOWN, LEFT } = SPRITES_CONFIG.directions;

        switch (this.walkingDirection) {
            case UP:
                this.y -= this.walkingSpeed;
                break;

            case RIGHT:
                this.x += this.walkingSpeed;
                break;

            case DOWN:
                this.y += this.walkingSpeed;
                break;

            case LEFT:
                this.x -= this.walkingSpeed;
                break;
        }
    }

    getCurrentTile() {
        let spriteX = this.x - (SPRITES_CONFIG.anchor.X * SPRITES_CONFIG.spriteSize);
        let spriteY = this.y - SPRITES_CONFIG.spriteSize;
        return {
            x: spriteX / SPRITES_CONFIG.spriteSize,
            y: spriteY / SPRITES_CONFIG.spriteSize
        };
    }

    updateNextTile() {
        if (!this.currentTile) {
            console.warn('AbstractSprite:updateNextTile - Strange... There is no currentTile');
            return;
        }

        let { UP, RIGHT, DOWN, LEFT } = SPRITES_CONFIG.directions;

        switch (this.walkingDirection) {
            case UP:
                this.nextTile = { x: this.currentTile.x, y: this.currentTile.y - 1 };
                break;

            case RIGHT:
                this.nextTile = { x: this.currentTile.x + 1, y: this.currentTile.y };
                break;

            case DOWN:
                this.nextTile = { x: this.currentTile.x, y: this.currentTile.y + 1 };
                break;

            case LEFT:
                this.nextTile = { x: this.currentTile.x - 1, y: this.currentTile.y };
                break;
        }
    }

    getTileX(x) {
        return (SPRITES_CONFIG.anchor.X * SPRITES_CONFIG.spriteSize) + (x * SPRITES_CONFIG.spriteSize);
    }

    getTileY(y) {
        return (SPRITES_CONFIG.anchor.Y * SPRITES_CONFIG.spriteSize) + (y * SPRITES_CONFIG.spriteSize);
    }

    isOnTile() {
        let spriteX = this.x + (SPRITES_CONFIG.anchor.X * SPRITES_CONFIG.spriteSize);
        let spriteY = this.y;
        return (spriteX % SPRITES_CONFIG.spriteSize === 0)
            && (spriteY % SPRITES_CONFIG.spriteSize === 0);
    }
}
