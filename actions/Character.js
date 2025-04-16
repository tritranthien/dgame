export class Character {
    prefix = 'Firewizard';
    player;
    keys;
    isAttacking;
    isLeft;
    fireEffect;
    speed = 100;
    moving = false;
    grounded;
    attackHitBox;
    _init(scene) {
        const prefix = this.prefix;
        player = this.physics.add.sprite(400, 100, `${prefix}.Idle`);
        player.body.setSize(32, 64);
        player.body.setOffset(32, 64); 
        player.setCollideWorldBounds(true);
        fireEffect = this.physics.add.sprite(player.x + 25, player.y + 25, `${prefix}.Charge`);
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
        scene.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(`${prefix}.Idle`, { start: 0, end: 6 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'attack1',
            frames: this.anims.generateFrameNumbers(`${prefix}.Attack_1`, { start: 0, end: 3 }),
            frameRate: 6,
            repeat: 0
        });
        scene.anims.create({
            key: 'attack2',
            frames: this.anims.generateFrameNumbers(`${prefix}.Attack_2`, { start: 0, end: 3 }),
            frameRate: 16,
            repeat: 0
        });
        scene.anims.create({
            key: 'chargeEffect',
            frames: this.anims.generateFrameNumbers(`${prefix}.Charge`, { start: 0, end: 11 }),
            frameRate: 20,
            repeat: 0
        });
        scene.anims.create({
            key: 'attack3',
            frames: this.anims.generateFrameNumbers(`${prefix}.Flame_jet`, { start: 0, end: 13 }),
            frameRate: 13,
            repeat: 0,
        });
        scene.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(`${prefix}.Walk`, { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1,
        });
        scene.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers(`${prefix}.Run`, { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1,
        });
        scene.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(`${prefix}.Jump`, { start: 4, end: 7 }),
            frameRate: 8,
            repeat: 0,
        });
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
    getPlayer() {
        return this.player; 
    }
    setPlayer(player) {
        this.player = player; 
    }
}