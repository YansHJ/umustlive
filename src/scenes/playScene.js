import Phaser from 'phaser';
import stone1 from '../assets/mapOne/objects/stones/1.png'
import stone2 from '../assets/mapOne/objects/stones/2.png'
import stone3 from '../assets/mapOne/objects/stones/3.png'
import stone4 from '../assets/mapOne/objects/stones/4.png'
import stone5 from '../assets/mapOne/objects/stones/5.png'
import stone6 from '../assets/mapOne/objects/stones/6.png'
import bushes1 from '../assets/mapOne/objects/bushes/1.png'
import bushes2 from '../assets/mapOne/objects/bushes/2.png'
import bushes3 from '../assets/mapOne/objects/bushes/3.png'
import bushes4 from '../assets/mapOne/objects/bushes/4.png'
import bushes5 from '../assets/mapOne/objects/bushes/5.png'
import bushes6 from '../assets/mapOne/objects/bushes/6.png'
import tree1 from '../assets/mapOne/objects/trees/1.png'
import tree2 from '../assets/mapOne/objects/trees/2.png'
import tree3 from '../assets/mapOne/objects/trees/3.png'
import tree4 from '../assets/mapOne/objects/trees/4.png'
import tree5 from '../assets/mapOne/objects/trees/5.png'
import tree6 from '../assets/mapOne/objects/trees/6.png'

//路面组
var roadGroup;
//景物组
var sceneryObj;
//键盘
var cursors;
//玩家本身
var player;
//玩家基础速度
var playerBaseSpeed ;
//攻击键①
var attackOne;
//攻击键②
var attackTwo;
//子弹组
var bullets;
//丧尸组
var zombies;
//玩家最终朝向
var playerLastDirection = 1;
//背景1
var background1;
//背景2
var background2;
//主相机
var mainCameras;
//右边界基础倍数
var rightBoundaryBase = 2;
//相机右边界最后坐标
var lastRightCamerasCoordinate = 0;
//最后右背景
var lastRightBackground;
//最后左背景
var lastLeftBackground;
//重力
var gravity = 1000;
//路面基础间距
var RoadBaseSpacing = 195;
//路面基础X坐标
var RoadLastXBase = 0;
//路面最后生成Y高度
var RoadLastYBase = 1050;

export default class playScene extends Phaser.Scene
{
    /**
     * 初始化场景数值
     */
    init(){
        //玩家最后朝向
        playerLastDirection = 1;
        //屏幕右边界基础倍数
        rightBoundaryBase = 2;
        //相机右边界最后坐标位置
        lastRightCamerasCoordinate = 0;
        //重力值
        gravity = 1000;
        //路面基础间距
        RoadBaseSpacing = 195;
        //路面基础X坐标
        RoadLastXBase = 0;
        //路面最后生成Y高度
        RoadLastYBase = 1050;
        //玩家基础速度
        playerBaseSpeed = 500;
    }
    constructor ()
    {
        super();
    }

    preload ()
    {
        //加载石头
        this.load.image('stone1',stone1);
        this.load.image('stone2',stone2);
        this.load.image('stone3',stone3);
        this.load.image('stone4',stone4);
        this.load.image('stone5',stone5);
        this.load.image('stone6',stone6);
        //加载灌木丛
        this.load.image('bushes1',bushes1);
        this.load.image('bushes2',bushes2);
        this.load.image('bushes3',bushes3);
        this.load.image('bushes4',bushes4);
        this.load.image('bushes5',bushes5);
        this.load.image('bushes6',bushes6);
        //加载树
        this.load.image('tree1',tree1);
        this.load.image('tree2',tree2);
        this.load.image('tree3',tree3);
        this.load.image('tree4',tree4);
        this.load.image('tree5',tree5);
        this.load.image('tree6',tree6);

    }

    create ()
    {
        //初始化数据
        this.init();
        //获取屏幕尺寸
        var sceneWidth = this.cameras.main.width;
        var sceneHeight = this.cameras.main.height;
        //创建背景1，2
        background1 = this.add.tileSprite(0, 0, 576,324, 'sky');
        background2 = this.add.tileSprite(sceneWidth, 0, 576,324, 'sky');
        //设置两个背景的左右位置
        lastRightBackground = background2;
        lastLeftBackground = background1;
        //设置背景缩放比例
        background1.setScale(sceneWidth / 576, sceneHeight / 324).setOrigin(0,0)
        background2.setScale(sceneWidth / 576, sceneHeight / 324).setOrigin(0,0)
        background1.setTilePosition(0,0)
        background2.setTilePosition(0,0)
        //创建临时提示
        this.add.text(300,200,'目前是开发阶段的Demo    操作说明：W A S D 控制方向，J键攻击',{fontSize: '48px'})
        this.add.text(300,300,'下阶段计划：完善游戏性(机制,攻击,人物和怪物模型等)',{fontSize: '48px'})
        // 设置相机的滚动因子
        mainCameras = this.cameras.main.setScroll(-0.3, 0);
        //相机缩放
        mainCameras.zoom = 1
        //相机边界（左上下固定，右边无限）
        mainCameras.setBounds(0,0,Infinity,1080)
        //设置此场景重力
        this.physics.world.gravity.y = gravity;
        //创建路
        roadGroup = this.physics.add.staticGroup();
        //创建景物
        sceneryObj = this.physics.add.staticGroup();
        this.createGrassRoads();
        //创建玩家
        player = this.physics.add.sprite(100,800,'player').setSize(100,130);
        player.setBounce(0.1)
        this.createPlayerAnim();
        // player.setCollideWorldBounds(true)
        //创建人物移动键盘监听
        cursors = this.input.keyboard;
        //创建人物攻击①键盘监听
        attackOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        //相机X轴跟随玩家
        mainCameras.startFollow(player,true,1,0)
        mainCameras.setFollowOffset(0,0)
        //碰撞检测（玩家，道路）
        this.physics.add.collider(player,roadGroup)
        //创建子弹组
        bullets = this.physics.add.group()
        //碰撞检测（子弹，道路）
        this.physics.add.collider(bullets,roadGroup)
        //丧尸组
        zombies = this.physics.add.group()
        //碰撞检测（丧尸，道路）
        this.physics.add.collider(zombies,roadGroup)
        //碰撞检测（丧尸，子弹）
        this.physics.add.collider(zombies,bullets)
        //接触检测
        this.physics.add.collider(zombies,player)
        this.physics.add.overlap(player,zombies,() =>{
            player.anims.play('playerUnderAttack',true)
        },null,this)
        //定时创建丧尸
        this.time.addEvent({
            delay: 5000,
            callback: this.createZombie,
            loop: true
        })
    }


    update(time, delta) {
        if (cursors.addKey('A').isDown)
        {
            player.setVelocityX(-playerBaseSpeed);
            player.anims.play('playerA',true)
            playerLastDirection = -1
        }
        else if (cursors.addKey('D').isDown)
        {
            player.setVelocityX(playerBaseSpeed);
            player.anims.play('playerD',true)
            playerLastDirection = 1

        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('playerStand',true)
        }

        if (cursors.addKey('W').isDown && player.body.touching.down)
        {
            player.setVelocityY(-playerBaseSpeed - 50);
            player.anims.play('playerStand',false)
        }

        if (cursors.addKey('S').isDown && !player.body.touching.down)
        {
            player.setVelocityY(+playerBaseSpeed + 200);
            player.anims.play('playerStand',false)
        }
        //子弹创建
        if (attackOne.isDown) {
            player.anims.play('playerJ',true)
            //子弹速度
            var bulletSpeed = 3200;
            //玩家单位向量
            var unitVector = player.body.velocity.clone().normalize();
            var bullet = bullets.create(player.x,player.y,'bullets').setScale(0.2,0.2);
            if (unitVector.x === 0){
                bullet.setVelocity(playerLastDirection * bulletSpeed,0);
            } else {
                bullet.setVelocity(unitVector.x * bulletSpeed,unitVector.y * bulletSpeed);
            }
            bullet.setBounce(0.5)
            attackOne.reset()
        }

        // 根据相机的滚动位置调整背景图像的位置
        // 背景图像的滚动速度与相机滚动因子相关
        background1.tilePositionX = this.cameras.main.scrollX * 0.3;
        background2.tilePositionX = this.cameras.main.scrollX * 0.3;
        //根据玩家坐标生成背景图
        this.adjustmentBackground()


        //检测死亡
        this.detectDeath();
    }

    /**
     * 创建丧尸
     */
    createZombie() {
        var x = player.x + 1920
        zombies.create(x,600,'zombie').setScale(1).setSize(100,200).setDrag(2300,200)
    }

    /**
     * 检测相机边界，并实时挪动背景
     */
    adjustmentBackground() {
        var rightX = mainCameras.worldView.right;
        //玩家单位向量
        var unitVector = player.body.velocity.clone().normalize();
        if (unitVector.x > 0 && rightX >= (rightBoundaryBase * mainCameras.width) - 10) {
            if (lastLeftBackground === background1) {
                background1.x = rightBoundaryBase * mainCameras.width
                rightBoundaryBase ++;
                lastRightBackground = background1;
                lastLeftBackground = background2;
                lastRightCamerasCoordinate = background1.x
            } else {
                background2.x = rightBoundaryBase * mainCameras.width
                rightBoundaryBase ++;
                lastRightBackground = background2;
                lastLeftBackground = background1;
                lastRightCamerasCoordinate = background2.x
            }
        } else if (unitVector.x < 0 && rightX <= lastRightCamerasCoordinate) {
            if (lastRightBackground === background1) {
                background1.x = (rightBoundaryBase -3 ) * mainCameras.width
                rightBoundaryBase --;
                lastRightBackground = background2;
                lastLeftBackground = background1;
                lastRightCamerasCoordinate = background2.x
            } else {
                background2.x = (rightBoundaryBase -3 ) * mainCameras.width
                rightBoundaryBase --;
                lastRightBackground = background1;
                lastLeftBackground = background2;
                lastRightCamerasCoordinate = background1.x
            }
        }
    }

    /**
     * 创建生成草地路面
     */
    createGrassRoads () {
        //基础间距
        RoadBaseSpacing = 195;
        //基础X坐标
        RoadLastXBase = 0;
        //最后生成Y高度
        RoadLastYBase = 1150;
        //地台高度差
        var platformHeightDifference = 100;
        //创建路面
        roadGroup.create(RoadLastXBase,1150,'grassPlatformLeft').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
        RoadLastXBase ++;
        for (RoadLastXBase; RoadLastXBase < 10; RoadLastXBase++) {
            roadGroup.create(RoadLastXBase * RoadBaseSpacing,1150,'grassPlatformMiddle').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
        }
        roadGroup.create((RoadLastXBase) * RoadBaseSpacing,1150,'grassPlatformRight').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
        RoadLastXBase = RoadLastXBase + 1;
        for (let i = 1; i < 50; i++) {
            //随机Y轴值
            var y = 0;
            while ((RoadLastYBase - y) > platformHeightDifference) {
                y = Phaser.Math.Between(500,1150);
            }
            RoadLastYBase = y;
            //多长的路
            var howLong = Phaser.Math.Between(1,10);
            roadGroup.create(RoadLastXBase * RoadBaseSpacing,y,'grassPlatformLeft').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
            for (let j = RoadLastXBase + 1; j < howLong + RoadLastXBase; j++) {
                roadGroup.create(j * RoadBaseSpacing,y,'grassPlatformMiddle').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
            }
            roadGroup.create((howLong + RoadLastXBase)* RoadBaseSpacing,y,'grassPlatformRight').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
            RoadLastXBase = RoadLastXBase + howLong + 1;
            //创建树
            if (howLong >= 2 && Phaser.Math.Between(0,1) === 0) {
                var treesName ;
                var treesY = RoadLastYBase - 240;
                var treesScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        treesName = 'tree1';
                        treesY = RoadLastYBase - 520;
                        treesScale = 3;break;
                    case 2:
                        treesName = 'tree2';
                        treesY = RoadLastYBase - 480;
                        treesScale = 5;break;
                    case 3:
                        treesName = 'tree3';
                        treesY = RoadLastYBase - 540;
                        treesScale = 6;break;
                    case 4:
                        treesName = 'tree4';
                        treesY = RoadLastYBase - 530;
                        treesScale = 3;break;
                    case 5:
                        treesName = 'tree5'
                        treesY = RoadLastYBase - 450
                        treesScale = 4;break;
                    case 6:
                        treesName = 'tree6';
                        treesY = RoadLastYBase - 450;
                        treesScale = 4
                        break;
                }
                //差值
                var treesDifference;
                if (howLong >= 10) {
                    treesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,9 * RoadBaseSpacing)
                } else if (howLong >= 8) {
                    treesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,7 * RoadBaseSpacing)
                } else if (howLong >= 6){
                    treesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,5 * RoadBaseSpacing)
                } else if (howLong >= 4){
                    treesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,3 * RoadBaseSpacing)
                } else if (howLong >= 2){
                    treesDifference = Phaser.Math.Between(RoadBaseSpacing,1.5 * RoadBaseSpacing)
                }
                //创建树
                sceneryObj.create(RoadLastXBase * RoadBaseSpacing - treesDifference
                    ,treesY
                    ,treesName)
                    .setScale(treesScale)
            }
            //创建灌木丛
            if (howLong >= 2 && Phaser.Math.Between(0,1) === 0) {
                var bushesName ;
                var bushesY = RoadLastYBase - 240;
                var bushesScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        bushesName = 'bushes1';
                        bushesY = RoadLastYBase - 270;break;
                    case 2:
                        bushesName = 'bushes2';
                        bushesY = RoadLastYBase - 230;
                        bushesScale = 4;break;
                    case 3:
                        bushesName = 'bushes3';
                        bushesY = RoadLastYBase - 205;
                        bushesScale = 6;break;
                    case 4:
                        bushesName = 'bushes4';
                        bushesY = RoadLastYBase - 275;
                        bushesScale = 5;break;
                    case 5:
                        bushesName = 'bushes5'
                        bushesY = RoadLastYBase - 310;break;
                    case 6:
                        bushesName = 'bushes6';
                        bushesY = RoadLastYBase - 250;
                        break;
                }
                //差值
                var bushesDifference;
                if (howLong >= 8) {
                    bushesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,7 * RoadBaseSpacing)
                } else if (howLong >= 6){
                    bushesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,5 * RoadBaseSpacing)
                } else if (howLong >= 4){
                    bushesDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,3 * RoadBaseSpacing)
                } else if (howLong >= 2){
                    bushesDifference = Phaser.Math.Between(RoadBaseSpacing,1.5 * RoadBaseSpacing)
                }
                //创建灌木
                sceneryObj.create(RoadLastXBase * RoadBaseSpacing - bushesDifference
                    ,bushesY
                    ,bushesName)
                    .setScale(bushesScale)
            }
            //生成房子背景
            if (howLong >= 6 && Phaser.Math.Between(0,1) === 0) {
                sceneryObj.create(RoadLastXBase * RoadBaseSpacing - Phaser.Math.Between(2 * RoadBaseSpacing,5 * RoadBaseSpacing)
                    ,y - 500
                    ,'houseOne')
                    .setScale(6)
            }
            //创建石头
            if (howLong >= 4 && Phaser.Math.Between(0,1) === 0) {
                var stoneName ;
                var stoneY = RoadLastYBase - 240;
                var stoneScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        stoneName = 'stone1';
                        stoneY = RoadLastYBase - 258;break;
                    case 2:
                        stoneName = 'stone2';
                        stoneY = RoadLastYBase - 295;
                        stoneScale = 4;break;
                    case 3:
                        stoneName = 'stone3';
                        stoneY = RoadLastYBase - 240;
                        stoneScale = 5;break;
                    case 4:
                        stoneName = 'stone4';
                        stoneY = RoadLastYBase - 280;
                        stoneScale = 5;break;
                    case 5:
                        stoneName = 'stone5'
                        stoneY = RoadLastYBase - 260;break;
                    case 6:
                        stoneName = 'stone6'
                        stoneY = RoadLastYBase - 260;break;
                }
                //差值
                var stoneDifference;
                if (howLong >= 8) {
                    stoneDifference = Phaser.Math.Between(5.5 * RoadBaseSpacing,7 * RoadBaseSpacing)
                } else {
                    stoneDifference = Phaser.Math.Between(1.5 * RoadBaseSpacing,4 * RoadBaseSpacing)
                }
                //创建石头
                sceneryObj.create(RoadLastXBase * RoadBaseSpacing - stoneDifference
                    ,stoneY
                    ,stoneName)
                    .setScale(stoneScale)
            }
        }
        console.log('终点：' + RoadLastXBase * RoadBaseSpacing)
    }

    createPlayerAnim() {
        this.anims.create({
            key: 'playerD',
            frames: this.anims.generateFrameNumbers('player',{start: 5, end: 8}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'playerA',
            frames: this.anims.generateFrameNumbers('player',{start: 8, end: 5}),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'playerJ',
            frames: this.anims.generateFrameNumbers('player',{start: 9, end: 11}),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key: 'playerStand',
            frames: this.anims.generateFrameNumbers('player',{start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'playerUnderAttack',
            frames: this.anims.generateFrameNumbers('player',{start: 4, end: 4}),
            frameRate: 12,
            repeat: -1
        })
    }

    /**d
     * 检测死亡
     */
    detectDeath() {
        //当玩家Y坐标大于1100时死亡（跌落）
        if (player.y >= 1100) {
            this.scene.restart()
        }
    }

}
