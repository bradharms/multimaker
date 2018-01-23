const Phaser = require('phaser/dist/phaser');
const Player = require('./player');

new Phaser.Game({
  
  type: Phaser.WEBGL,
  width: 400,
  height: 225,
  physics: {
    // @todo: Switch to 'matter' so we can use sloped tiles
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: {
        y: 450
      }
    }
  },
  
  scene: new class extends Phaser.Scene {
    preload() {
      window.scene = this;
      const AS = '../projects/antispace';
      
      const AS_SP = `${AS}/sprites`;
      this.load.atlas('charles', `${AS_SP}/charles.png`, `${AS_SP}/charles.json`);
      
      const AS_AN = `${AS}/animations`;
      this.load.animation('charlesAnim', `${AS_AN}/charles.json`);
      
      const AS_TS = `${AS}/tiles`;
      this.load.image('tileset00', `${AS_TS}/tsNAZ.png`);
      
      const AS_M = `${AS}/maps`;
      this.load.tilemapTiledJSON('room000', `${AS_M}/room000.json`);
    }
    create() {
      this.cursors = this.input.keyboard.createCursorKeys();
      
      this.player = new Player(this, 100, 50);
      
      this.tm = this.add.tilemap('room000');
      this.ts = this.tm.addTilesetImage('tileset00');
      this.layer = this.tm.createStaticLayer(0, this.ts, 0, 0);
      this.layer.setCollisionBetween(64,128);
      
      this.physics.add.collider(this.player.sprite, this.layer);
      
      this.cameras.main.setBounds(0, 0, this.tm.widthInPixels, this.tm.heightInPixels);
      this.cameras.main.startFollow(this.player.sprite);
    }

    update() {
      this.player.update(this.getInputs());
    }

    getInputs() {
      const { cursors: {
        left: { isDown: left },
        right: { isDown: right },
        up: { isDown: up },
        down: { isDown: down },
        space: { isDown: jump }
      } } = this;
      return {
        left: left && !right,
        right: right && !left,
        up: up && !down,
        down: down && !up,
        jump
      };
    }
  }
});

