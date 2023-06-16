import Phaser from 'phaser';
import logo from './assets/YansGames.png'
import unlockReverse from './assets/unlockReverse.png'
import player from './assets/players/soul.png'
import player01 from './assets/players/langKnifeGirl_01.png'
import bullets from './assets/laserSprites/26.png'
import redHealth from './assets/states/health/redHealth.jpg'
import greenHealth from './assets/states/health/greenHealth.jpg'
import attackObj from './assets/attackObj.png'
import leftBtn from './assets/buttons/leftBtn.png'
import rightBtn from './assets/buttons/rightBtn.png'
import upBtn from './assets/buttons/upBtn.png'
import downBtn from './assets/buttons/downBtn.png'
import aimBtn from './assets/buttons/aimBtn.png'
import voidBtn from './assets/buttons/voidBtn.png'
import playScene from './scenes/playScene'
import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";

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
        this.load.image('unlockReverse',unlockReverse);
        //加载精灵
        this.load.spritesheet('logo',logo,{frameWidth: 896 , frameHeight: 896})
        this.load.spritesheet('player',player,{frameWidth: 225 , frameHeight: 300})
        this.load.spritesheet('player01',player01,{frameWidth: 250 , frameHeight: 200})
        //加载血量图
        this.load.image('redHealth',redHealth);
        this.load.image('greenHealth',greenHealth);
        //加载按钮图
        this.load.image('leftBtn',leftBtn);
        this.load.image('rightBtn',rightBtn);
        this.load.image('upBtn',upBtn);
        this.load.image('downBtn',downBtn);
        this.load.image('aimBtn',aimBtn);
        this.load.image('voidBtn',voidBtn);
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
        //检测屏幕方向
        this.text = this.add.text(600, 100, '请设置你的手机为横屏', { font: '96px Courier', fill: '#00ff00', align: 'center' })
            .setOrigin(0.5);
        this.add.image(1170,90,'unlockReverse')
        this.checkOriention(this.scale.orientation);
        this.scale.on('orientationchange', this.checkOriention, this);
    }

    checkOriention (orientation)
    {
        if (orientation === Phaser.Scale.PORTRAIT)
        {
            this.text.setVisible(true);
        }
        else if (orientation === Phaser.Scale.LANDSCAPE)
        {
            this.time.delayedCall(1000,() => {
                this.scene.start('playScene',{playerHealthMax: playerHealthMax})
            })
            this.text.setVisible(false);
        }
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
        global: [{
            key: 'rexVirtualJoyStick',
            plugin: VirtualJoyStickPlugin,
            start: true
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
