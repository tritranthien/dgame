import { autoloadSpritesheets } from "./utils/autoloadSpritesheets";
import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600},
            debug: true
        }
    },
};

let player;
let keys;
let isAttacking;
let isLeft;
let fireEffect;
let speed = 100;
let moving = false;
let grounded;
let attackHitBox;
function preload() {
    autoloadSpritesheets(this);
    this.load.image('darkstone', 'tilesets/darkstone/Tileset.png');
    this.load.tilemapTiledJSON('demo', 'maps/demo.tmj');
}
function create() {
    player = this.physics.add.sprite(400, 100, 'Firewizard.Idle');
    player.body.setSize(32, 64);
    player.body.setOffset(32, 64); 
    player.setCollideWorldBounds(true);
    const map = this.make.tilemap({ key: 'demo' });
    const tileset = map.addTilesetImage('darkstone', 'darkstone');
    const layer = map.createLayer('demo', tileset);
    layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player, layer);
    fireEffect = this.physics.add.sprite(player.x + 25, player.y + 25, 'Firewizard.Charge');
    fireEffect.setScale(2);
    fireEffect.setVisible(false);
    fireEffect.body.setAllowGravity(false);
    fireEffect.body.setEnable(false);
    attackHitBox = this.physics.add.sprite(player.x + 25, player.y + 25, null);
    attackHitBox.body.setSize(64, 32);
    attackHitBox.body.setOffset(32, 64); 
    attackHitBox.body.setAllowGravity(false);
    attackHitBox.body.setEnable(false);
    attackHitBox.setVisible(false);
    // this.physics.add.overlap(fireEffect, enemyGroup, damageEnemy, null, this);
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('Firewizard.Idle', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('Firewizard.Attack_1', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0
    });
    this.anims.create({
        key: 'attack2',
        frames: this.anims.generateFrameNumbers('Firewizard.Attack_2', { start: 0, end: 3 }),
        frameRate: 16,
        repeat: 0
    });
    this.anims.create({
        key: 'chargeEffect',
        frames: this.anims.generateFrameNumbers('Firewizard.Charge', { start: 0, end: 11 }),
        frameRate: 20,
        repeat: 0
    });
    this.anims.create({
        key: 'attack3',
        frames: this.anims.generateFrameNumbers('Firewizard.Flame_jet', { start: 0, end: 13 }),
        frameRate: 13,
        repeat: 0,
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('Firewizard.Walk', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1,
    });
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('Firewizard.Run', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('Firewizard.Jump', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: 0,
    });
    keys = this.input.keyboard.addKeys('A,S,D,SPACE,LEFT,RIGHT,SHIFT');
    player.on('animationcomplete', (animation, frame) => {
        if (['attack1', 'attack2', 'attack3'].includes(animation.key)) {
            player.play('idle', true);
            if (fireEffect) {
                fireEffect.body.setEnable(false);
                fireEffect.setVisible(false);
            }
            attackHitBox.body.setEnable(false);
            isAttacking = false;
        }
    });
}

function update() {
    grounded = player.body.blocked.down || player.body.onFloor();
    if (isAttacking) {
        return;
    }    
    if (
    grounded &&
        !isAttacking
    ) {
        if (moving) {
            if (keys.SHIFT.isDown) {
                player.play('run', true);
            } else {
                player.play('walk', true);
            }
        }
        else {
            player.play('idle', true);
        }
    }
    if (!moving && player.body.touching.down && ['walk','run'].includes(player.anims.currentAnim?.key)) {
        player.play('idle', true);
    }
    if (Phaser.Input.Keyboard.JustDown(keys.A)) {
        player.play('attack1');
        fireEffect.y = player.y + 25;
        if (isLeft) {
            fireEffect.setFlipX(true);
            fireEffect.x = player.x - 25;
        } else {
            fireEffect.setFlipX(false);
            fireEffect.x = player.x + 25;
        }
        fireEffect.setVisible(true);
        fireEffect.body.setEnable(true);
        fireEffect.body.setSize(45, 38); 
        fireEffect.play('chargeEffect');
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.S)) {
        player.play('attack2');
        attackHitBox.y = player.y + 25;
        attackHitBox.body.setSize(50, 20);
        if (isLeft) {
            attackHitBox.x = player.x - 30;
        } else {
            attackHitBox.x = player.x + 30;
        }
        attackHitBox.body.setEnable(true);
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.D)) {
        player.play('attack3');
        attackHitBox.y = player.y + 25;
        attackHitBox.body.setSize(50, 75);
        if (isLeft) {
            attackHitBox.x = player.x - 40;
        } else {
            attackHitBox.x = player.x + 40;
        }
        attackHitBox.body.setEnable(true);
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && grounded) {
        player.play('jump');
        player.setVelocityY(-300);
    }
    if (keys.SHIFT.isDown) {
        speed = 200;
    } else {
        speed = 100;
    }
    if (keys.LEFT.isDown && !isAttacking) {
        player.setVelocityX(-speed);
        isLeft = true;
        player.setFlipX(true);
        player.setOffset(64, 64);
        moving = true;
    } else if (keys.RIGHT.isDown &&!isAttacking) {
        player.setVelocityX(speed);
        isLeft = false;
        player.setFlipX(false);
        player.setOffset(32, 64);
        moving = true;
    } else {
        player.setVelocityX(0);
        moving = false;
    }
}
function damageEnemy(fireEffect, enemy) {
    if (fireEffect.visible && fireEffect.body.enable) {
        enemy.takeDamage(10);
    }
}
new Phaser.Game(config);
