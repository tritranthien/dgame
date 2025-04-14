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
            gravity: { y: 300 }, // Trọng lực, thay đổi giá trị để điều chỉnh tốc độ rơi
            debug: false // Tắt debug nếu không cần
        }
    },
};

const game = new Phaser.Game(config);

let player;
let flaming;
let keys;
let ground;
let isAttacking;
let fireEffect;
const speed = 100;
let moving = false;
function preload() {
    autoloadSpritesheets(this);
}
function create() {
    player = this.physics.add.sprite(400, 300, 'Firewizard.Idle');
    player.setCollideWorldBounds(true); // Đảm bảo player không ra ngoài màn hình

    // Thêm nền cho player đứng
    ground = this.physics.add.staticGroup(); // Tạo một nhóm vật thể static (không di chuyển)
    ground.create(380, 500, 'ground'); 
    this.physics.add.collider(player, ground);
    fireEffect = this.add.sprite(player.x + 25, player.y + 25, 'Firewizard.Charge');
    flaming = this.physics.add.sprite(416, 300, 'Firewizard.Flame_jet');
    this.physics.add.collider(flaming, ground);
    flaming.setVisible(false);
    fireEffect.setScale(2);
    fireEffect.setVisible(false);
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('Firewizard.Idle', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('Firewizard.Attack_1', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: 0
    });
    this.anims.create({
        key: 'attack2',
        frames: this.anims.generateFrameNumbers('Firewizard.Attack_2', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: 0
    });
    this.anims.create({
        key: 'chargeEffect',
        frames: this.anims.generateFrameNumbers('Firewizard.Charge', { start: 0, end: 11 }),
        frameRate: 24,
        repeat: 0
    });
    this.anims.create({
        key: 'attack3',
        frames: this.anims.generateFrameNumbers('Firewizard.Flame_jet', { start: 0, end: 13 }),
        frameRate: 24,
        repeat: 0,
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('Firewizard.Walk', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1,
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('Firewizard.Jump', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: 0,
    });
    keys = this.input.keyboard.addKeys('A,S,D,SPACE,LEFT,RIGHT');
    player.on('animationcomplete', (animation, frame) => {
        if (['attack1', 'attack2', 'attack3'].includes(animation.key)) {
            flaming.setVisible(false);
            player.setVisible(true);
            player.setTexture('Firewizard.Idle');
            player.setFrame(0);
            if (fireEffect) fireEffect.setVisible(false);
            isAttacking = false;
        }
    });
    flaming.on('animationcomplete', (animation, frame) => {
        if (['attack1', 'attack2', 'attack3'].includes(animation.key)) {
            flaming.setVisible(false);
            player.setVisible(true);
            player.setTexture('Firewizard.Idle');
            player.setFrame(0);
            if (fireEffect) fireEffect.setVisible(false);
            isAttacking = false;
        }
    });
}

function update() {
    if (isAttacking) {
        return;
    }
    if (
        !player.anims.isPlaying &&
        !isAttacking &&
        player.body.touching.down
    ) {
        player.play('idle');
    }
    if (
    moving &&
    player.body.touching.down &&
        !isAttacking &&
        player.anims.currentAnim?.key !== 'walk'
    ) {
        player.play('walk', true);
    }
    if (!moving && player.body.touching.down && player.anims.currentAnim?.key === 'walk') {
        player.play('idle', true);
        player.setFrame(0);
    }
    if (Phaser.Input.Keyboard.JustDown(keys.A)) {
        player.setTexture('Firewizard.Attack_1');
        player.play('attack1');
        fireEffect.x = player.x + 25;
        fireEffect.y = player.y + 25;
        fireEffect.setVisible(true);
        fireEffect.play('chargeEffect');
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.S)) {
        player.setTexture('Firewizard.Attack_2');
        player.play('attack2');
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.D)) {
        player.setVisible(false);
        flaming.setVisible(true);
        flaming.play('attack3');
        isAttacking = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && player.body.touching.down) {
        player.setTexture('Firewizard.Jump');
        player.play('jump');
        player.setVelocityY(-200);
        isAttacking = true;
    }
    if (keys.LEFT.isDown || keys.A.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true); // Quay mặt sang trái
        moving = true;
    } else if (keys.RIGHT.isDown || keys.D.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false); // Quay mặt sang phải
        moving = true;
    } else {
        player.setVelocityX(0);
        moving = false;
    }
    if (player.body.touching.down && player.anims.currentAnim.key === 'jump') {
        player.setTexture('Firewizard.Idle');
        // player.play('idle');
        isAttacking = false;
    }
}
