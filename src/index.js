import Phaser from 'phaser';
import logo from './assets/YansGames.png'
import roadSix from './assets/mapOne/background/Layers/6.png'
import roadEight from './assets/mapOne/background/Layers/8.png'
import player from './assets/player.png'
import sky from './assets/mapOne/background/Background.png'
import grassPlatformLeft from './assets/mapTwo/Tiles/Ground_grass_0041_tile.png'
import grassPlatformMiddle from './assets/mapTwo/Tiles/Ground_grass_0042_tile.png'
import grassPlatformRight from './assets/mapTwo/Tiles/Ground_grass_0040_tile.png'
import houseOne from './assets/mapOne/objects/9 House/1.png'
import zombie from './assets/zombie.png'
import playScene from './scenes/playScene'

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //加载图
        this.load.image('roadSix',roadSix);
        this.load.image('roadEight',roadEight);
        this.load.image('sky',sky);
        this.load.image('grassPlatformLeft',grassPlatformLeft);
        this.load.image('grassPlatformMiddle',grassPlatformMiddle);
        this.load.image('grassPlatformRight',grassPlatformRight);
        this.load.image('houseOne',houseOne);
        this.load.image('zombie',zombie);
        //加载精灵
        this.load.spritesheet('logo',logo,{frameWidth: 896 , frameHeight: 896})
        this.load.spritesheet('player',player,{frameWidth: 224 , frameHeight: 224})
        //加载场景
        this.scene.add('playScene',playScene,false);
    }
      
    create ()
    {
        this.scene.start('playScene')
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
        this.time.delayedCall(7000,() => {
            this.scene.start('playScene')
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
