import Phaser from 'phaser';
import logo from './assets/YansGames.png'
import player from './assets/players/soul.png'
import player01 from './assets/players/langKnifeGirl_01.png'
import bullets from './assets/laserSprites/26.png'
import redHealth from './assets/states/health/redHealth.jpg'
import greenHealth from './assets/states/health/greenHealth.jpg'
import attackObj from './assets/attackObj.png'
import playScene from './scenes/playScene'

var playerHealthMax;
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //加载图
        this.load.image('bullets',bullets);
        this.load.image('attackObj',attackObj);
        //加载精灵
        this.load.spritesheet('logo',logo,{frameWidth: 896 , frameHeight: 896})
        this.load.spritesheet('player',player,{frameWidth: 225 , frameHeight: 300})
        this.load.spritesheet('player01',player01,{frameWidth: 250 , frameHeight: 200})
        //加载血量图
        this.load.image('redHealth',redHealth);
        this.load.image('greenHealth',greenHealth);
        //加载场景
        this.scene.add('playScene',playScene,false);
    }
      
    create ()
    {
        // this.scene.start('playScene')
        var logo = this.physics.add.sprite(960,380,'logo');
        this.anims.create({
            key:'startLogo1',
            frames: this.anims.generateFrameNumbers('logo',{start: 0,end : 4}),
            frameRate:1,
            repeat: 0,
        })
        this.anims.create({
            key:'startLogo2',
            frames: this.anims.generateFrameNumbers('logo',{start: 5,end : 9}),
            frameRate:1,
            repeat: 0,
        })
        logo.play('startLogo1')
        this.time.delayedCall(4000,() => {
            logo.x = 960;
            logo.y = 180;
            logo.play('startLogo2')
        })
        //玩家初始血量
        playerHealthMax = 100
        this.time.delayedCall(1000,() => {
            console.log('血量' + playerHealthMax)
            this.scene.start('playScene',{playerHealthMax: playerHealthMax})
        })
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'u_must_live',
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    plugins: {
        scene: [{
            key: 'SpinePlugin',
            plugin: window.SpinePlugin,
            sceneKey: 'spine'
        }]
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 30 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
