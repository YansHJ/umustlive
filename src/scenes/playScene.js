import Phaser from 'phaser';
import stone1 from '../assets/mapOne/objects/stones/1_gray.png'
import stone2 from '../assets/mapOne/objects/stones/2_gray.png'
import stone3 from '../assets/mapOne/objects/stones/3_gray.png'
import stone4 from '../assets/mapOne/objects/stones/4_gray.png'
import stone5 from '../assets/mapOne/objects/stones/5_gray.png'
import stone6 from '../assets/mapOne/objects/stones/6_gray.png'
import bushes1 from '../assets/mapOne/objects/bushes/1_gray.png'
import bushes2 from '../assets/mapOne/objects/bushes/2_gray.png'
import bushes3 from '../assets/mapOne/objects/bushes/3_gray.png'
import bushes4 from '../assets/mapOne/objects/bushes/4_gray.png'
import bushes5 from '../assets/mapOne/objects/bushes/5_gray.png'
import bushes6 from '../assets/mapOne/objects/bushes/6_gray.png'
import tree1 from '../assets/mapOne/objects/trees/1_gray.png'
import tree2 from '../assets/mapOne/objects/trees/2_gray.png'
import tree3 from '../assets/mapOne/objects/trees/3_gray.png'
import tree4 from '../assets/mapOne/objects/trees/4_gray.png'
import tree5 from '../assets/mapOne/objects/trees/5_gray.png'
import tree6 from '../assets/mapOne/objects/trees/6_gray.png'
import doorOpen from '../assets/mapOne/objects/doorOpen.png'
import purpleArray from '../assets/mapOne/objects/purpleArray.png'
import purpleDiamond from '../assets/mapOne/objects/purpleDiamond.png'
import zombie from '../assets/mapOne/objects/girl1.png'

import knife1_1 from '../assets/weapons/knife1_1.png'
import staff1_1 from '../assets/weapons/staff1_1.png'

import grassPlatformLeft from "../assets/mapOne/tiles/left.png";
import grassPlatformMiddle from "../assets/mapOne/tiles/mid.png";
import grassPlatformRight from "../assets/mapOne/tiles/right.png";
import sky from "../assets/mapOne/background/Background_gray1.png";
import houseOne from "../assets/mapOne/objects/house/1_gray.png";
import cloudSmall from '../assets/mapOne/background/coluds_small.png'

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
//交互键
var interactiveKey;
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
//血量条图
var redHealth;
var greenHealth;
//玩家血量最大值
var playerHealthMax;
//玩家最大血量文本实体
var playerHealthMaxTextObj;
//玩家当前血量
var playerHealthNow;
//玩家当前血量文本对象
var playerHealthNowTextObj;
//玩家信息显示实体容器
var playerInfoContainer;
//玩家自身容器
var playerContainer;
//受伤标志
var hurtFlag;
//开门动画
var purpleArrayGroup;
var purpleArrayGroupIndex;
//提示文字
var textTips ;
//开局紫色水晶
var purpleDiamondObj;
//武器组
var weaponGroup;
export default class playScene extends Phaser.Scene
{
    /**
     * 初始化场景数值
     */
    initValue(){
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
        //受伤标志
        hurtFlag = false;
    }

    init(data) {
        playerHealthMax = this.sys.settings.data.playerHealthMax;
        playerHealthNow = this.sys.settings.data.playerHealthMax;
    }

    constructor ()
    {
        super();
    }

    preload ()
    {
        //加载地板
        this.load.image('sky',sky);
        this.load.image('houseOne',houseOne);
        this.load.image('grassPlatformLeft',grassPlatformLeft);
        this.load.image('grassPlatformMiddle',grassPlatformMiddle);
        this.load.image('grassPlatformRight',grassPlatformRight);
        this.load.image('cloudSmall',cloudSmall);
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
        //加载武器
        this.load.image('knife1_1',knife1_1);
        this.load.image('staff1_1',staff1_1);
        //加载序列
        this.load.spritesheet('doorOpen',doorOpen,{frameWidth: 96, frameHeight: 64})
        this.load.spritesheet('purpleArray',purpleArray,{frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('zombie',zombie,{frameWidth: 45 , frameHeight: 60})
        this.load.spritesheet('purpleDiamond',purpleDiamond,{frameWidth: 32 , frameHeight: 64})

    }

    create ()
    {
        //全屏
        // this.scale.startFullscreen()
        //初始化数据
        this.initValue();
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
        this.add.text(300,100,'目前是开发阶段的Demo    操作说明：W A S D 控制方向，J键攻击',{fontSize: '48px'})
        this.add.text(300,200,'6月12日更新: 完善怪物寻路,增加怪物模型,以及部分动画,增加玩家血量和受伤机制',{fontSize: '48px'})
        this.add.text(300,300,'下阶段计划：',{fontSize: '48px'})
        // 设置相机的滚动因子
        mainCameras = this.cameras.main.setScroll(-0.3, 0);
        //相机缩放
        mainCameras.zoom = 1
        //相机边界（左上下固定，右边无限）
        mainCameras.setBounds(0,0,Infinity,1080)
        //设置此场景重力
        this.physics.world.gravity.y = gravity;
        //创建怪物动画
        this.createMonsterAnim()
        //创建景物动画
        this.createSceneryAnim();
        //创建路
        roadGroup = this.physics.add.staticGroup();
        //创建景物
        sceneryObj = this.physics.add.staticGroup();
        this.createScenery();
        this.createGrassRoads();
        //创建玩家
        player = this.physics.add.sprite(100,800,'player')
            .setSize(100,130)
            .setDepth(1);
        //初始化玩家数据
        player.setData('haveWeapon',0)
        player.setData('weapon1',0)
        player.setData('weapon2',0)
        player.setBounce(0.1)
        //创建玩家动作动画
        this.createPlayerAnim();
        //创建角色血量显示
        playerInfoContainer = this.add.container()
        playerInfoContainer.add(this.add.text(30,45,'HP:',{fontSize: '32px'}))
        //血量值显示
        playerHealthNowTextObj = this.add.text(350,45,playerHealthNow + ' / ' + playerHealthMax,{fontSize: '32px'})
        playerInfoContainer.add(playerHealthNowTextObj)
        //红绿血条
        redHealth = this.add.image(100,50,'redHealth');
        redHealth.displayWidth = redHealth.displayWidth * 2
        redHealth.setOrigin(0,0);
        greenHealth = this.add.image(100,50,'greenHealth');
        greenHealth.displayWidth = greenHealth.displayWidth * 2
        greenHealth.setOrigin(0,0)
        playerInfoContainer.add(redHealth)
        playerInfoContainer.add(greenHealth)
        // player.setCollideWorldBounds(true)
        //创建人物移动键盘监听
        cursors = this.input.keyboard;
        //创建人物攻击①键盘监听
        attackOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        attackTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        interactiveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //相机X轴跟随玩家容器
        mainCameras.startFollow(player,true,0.05,0.05)
        mainCameras.setFollowOffset(0,0)
        //创建子弹组
        bullets = this.physics.add.group()
        //丧尸组
        zombies = this.physics.add.group()
        //武器组
        weaponGroup = this.add.group();
        //创建公共碰撞检测
        this.createCollider();
        //创建丧尸
        this.createZombie();
    }

    /**
     * 更新
     * @param time
     * @param delta
     */
    update(time, delta) {
        //玩家移动及动画
        if (!hurtFlag) {
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
        }
        //怪物巡逻
        this.monsterPatrol(delta)
        //武器检测
        if (player.getData('weapon1') === 0 && player.getData('weapon2') === 0 ) {
            player.setData('haveWeapon',0);
        } else {
            player.setData('haveWeapon',1);
        }
        //攻击1
        if (attackOne.isDown) {
            if (player.getData('haveWeapon') === 0) {
                textTips.setText('你当前没有武器')
            } else {
                player.anims.play('playerJ',true)
                //子弹速度
                var bulletSpeed = 800;
                //玩家单位向量
                var unitVector = player.body.velocity.clone().normalize();
                var bullet = bullets.create(player.x,player.y,'bullets').setScale(1,1).setSize(200,50);
                // bullet.body.allowGravity = false;
                if (unitVector.x === 0){
                    bullet.setVelocity(playerLastDirection * bulletSpeed,0);
                } else {
                    bullet.setVelocity(unitVector.x * bulletSpeed,unitVector.y * bulletSpeed);
                }
                bullet.setBounce(0.5)
            }
            attackOne.reset()
        }
        // 根据相机的滚动位置调整背景图像的位置
        // 背景图像的滚动速度与相机滚动因子相关
        background1.tilePositionX = this.cameras.main.scrollX * 0.3;
        background2.tilePositionX = this.cameras.main.scrollX * 0.3;
        //根据玩家坐标生成背景图
        this.adjustmentBackground()
        //实时更新武器组位置
        weaponGroup.getChildren().forEach(weapon => {
            weapon.x = player.x + weapon.getData('XWithPlayer');
            weapon.y = player.y + weapon.getData('YWithPlayer');
        })
        //玩家信息随相机更新移动
        playerInfoContainer.setPosition(this.cameras.main.scrollX,this.cameras.main.scrollY)
        //检测死亡
        this.detectDeath();
    }

    /**
     * 创建丧尸
     */
    createZombie() {
        var originX = 2000;
        var zombieNums = 60;
        var zombiesInterval = ((RoadLastXBase * Phaser.Math.Between(400,600)) / zombieNums) / 3;
        for (let i = 0; i < zombieNums; i++) {
            var x = Phaser.Math.Between(originX, originX + zombiesInterval);
            var zombie = zombies.create(x,500,'zombie').setScale(3).setSize(20,45).setDrag(2300,200);
            zombie.setData('health',100)
            zombie.setData('damage',10)
            zombie.setData('patrolPath',[originX,originX + zombiesInterval])
            zombie.setData('currentPathIndex', 0)
            // console.log(zombie)
            originX = originX + zombiesInterval;
        }
        console.log('最后生成位置：' + originX)
    }

    /**
     * 怪物巡逻
     */
    monsterPatrol(delta) {
        zombies.getChildren().forEach(function (zombie) {
            var currentPathIndex = zombie.getData('currentPathIndex');
            var patrolPath = zombie.getData('patrolPath');
            // console.log(patrolPath)
            if (Math.abs(zombie.x - patrolPath[currentPathIndex]) < 1) {
                if (currentPathIndex === 0) {
                    zombie.setData('currentPathIndex', 1)
                } else {
                    zombie.setData('currentPathIndex', 0)
                }
            }
            // console.log('currentPathIndex' + currentPathIndex)
            // 根据距离计算移动速度和方向
            var speed = 100; // 设置移动速度
            var direction = (zombie.x < patrolPath[currentPathIndex]) ? 1 : -1; // 确定移动方向
            // console.log('direction' + direction)
            // 移动怪物
            zombie.x += speed * direction * delta / 1000;
            if (direction === 1) {
                zombie.anims.play('zombieRunRight',true);
            } else {
                zombie.anims.play('zombieRunLeft',true);
            }
            if (zombie.y > 1150) {
                var purpleArray = purpleArrayGroup.getChildren()[Phaser.Math.Between(0,purpleArrayGroup.getLength() - 1)]
                purpleArray.x = zombie.x;
                purpleArray.y = 400;
                zombie.y = 500;
                purpleArray.anims.play('purpleArrayAnim',true)
                // 监听动画播放完成事件
                purpleArray.on('animationcomplete', () => {
                    // 动画播放完成后移除
                    purpleArray.x = -1000;
                    purpleArray.y = -1000;
                });
            }
        })
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
        //提示文字实时跟随玩家
        textTips.setPosition(player.x -160 ,player.y - 200)
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
        RoadLastYBase = 1050;
        //地台高度差
        var platformHeightDifference = 100;
        //创建路面
        roadGroup.create(RoadLastXBase,1050,'grassPlatformLeft').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
        RoadLastXBase ++;
        for (RoadLastXBase; RoadLastXBase < 10; RoadLastXBase++) {
            roadGroup.create(RoadLastXBase * RoadBaseSpacing,1050,'grassPlatformMiddle').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
        }
        roadGroup.create((RoadLastXBase) * RoadBaseSpacing,1050,'grassPlatformRight').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
        RoadLastXBase = RoadLastXBase + 1;
        for (let i = 1; i < 50; i++) {
            //随机Y轴值
            var y = 0;
            while ((RoadLastYBase - y) > platformHeightDifference) {
                y = Phaser.Math.Between(500,1050);
            }
            RoadLastYBase = y;
            //多长的路
            var howLong = Phaser.Math.Between(1,10);
            roadGroup.create(RoadLastXBase * RoadBaseSpacing,y,'grassPlatformLeft').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
            for (let j = RoadLastXBase + 1; j < howLong + RoadLastXBase; j++) {
                roadGroup.create(j * RoadBaseSpacing,y,'grassPlatformMiddle').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
            }
            roadGroup.create((howLong + RoadLastXBase)* RoadBaseSpacing,y,'grassPlatformRight').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-80)
            RoadLastXBase = RoadLastXBase + howLong + 1;
            //创建云朵
            if (Phaser.Math.Between(0,1) === 0) {
                var cloudName = 'cloudSmall';
                var cloudY = Phaser.Math.Between(50,500);
                var cloudScale = 2;
                //创建树
                sceneryObj.create(RoadLastXBase * (RoadBaseSpacing + 100 )
                    ,cloudY
                    ,cloudName)
                    .setScale(cloudScale)
            }
            //创建树
            if (howLong >= 2 && Phaser.Math.Between(0,1) === 0) {
                var treesName ;
                var treesY = RoadLastYBase - 180;
                var treesScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        treesName = 'tree1';
                        treesY = RoadLastYBase - 460;
                        treesScale = 3;break;
                    case 2:
                        treesName = 'tree2';
                        treesY = RoadLastYBase - 420;
                        treesScale = 5;break;
                    case 3:
                        treesName = 'tree3';
                        treesY = RoadLastYBase - 480;
                        treesScale = 6;break;
                    case 4:
                        treesName = 'tree4';
                        treesY = RoadLastYBase - 470;
                        treesScale = 3;break;
                    case 5:
                        treesName = 'tree5'
                        treesY = RoadLastYBase - 390
                        treesScale = 4;break;
                    case 6:
                        treesName = 'tree6';
                        treesY = RoadLastYBase - 390;
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
                var bushesY = RoadLastYBase - 180;
                var bushesScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        bushesName = 'bushes1';
                        bushesY = RoadLastYBase - 200;break;
                    case 2:
                        bushesName = 'bushes2';
                        bushesY = RoadLastYBase - 160;
                        bushesScale = 4;break;
                    case 3:
                        bushesName = 'bushes3';
                        bushesY = RoadLastYBase - 135;
                        bushesScale = 6;break;
                    case 4:
                        bushesName = 'bushes4';
                        bushesY = RoadLastYBase - 205;
                        bushesScale = 5;break;
                    case 5:
                        bushesName = 'bushes5'
                        bushesY = RoadLastYBase - 240;break;
                    case 6:
                        bushesName = 'bushes6';
                        bushesY = RoadLastYBase - 190;
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
                    ,y - 440
                    ,'houseOne')
                    .setScale(6)
            }
            //创建石头
            if (howLong >= 4 && Phaser.Math.Between(0,1) === 0) {
                var stoneName ;
                var stoneY = RoadLastYBase - 180;
                var stoneScale = 6;
                switch (Phaser.Math.Between(1,6)) {
                    case 1:
                        stoneName = 'stone1';
                        stoneY = RoadLastYBase - 190;break;
                    case 2:
                        stoneName = 'stone2';
                        stoneY = RoadLastYBase - 225;
                        stoneScale = 4;break;
                    case 3:
                        stoneName = 'stone3';
                        stoneY = RoadLastYBase - 170;
                        stoneScale = 5;break;
                    case 4:
                        stoneName = 'stone4';
                        stoneY = RoadLastYBase - 210;
                        stoneScale = 5;break;
                    case 5:
                        stoneName = 'stone5'
                        stoneY = RoadLastYBase - 190;break;
                    case 6:
                        stoneName = 'stone6'
                        stoneY = RoadLastYBase - 190;break;
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

    /**
     * 创建角色动画
     */
    createPlayerAnim() {
        this.anims.create({
            key: 'playerD',
            frames: this.anims.generateFrameNumbers('player',{start: 5, end: 8}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'playerA',
            frames: this.anims.generateFrameNumbers('player',{start: 9, end: 12}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'playerJ',
            frames: this.anims.generateFrameNumbers('player',{start: 13, end: 16}),
            frameRate: 3,
            repeat: -1
        })
        this.anims.create({
            key: 'playerStand',
            frames: this.anims.generateFrameNumbers('player',{start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'playerUnderAttack',
            frames: this.anims.generateFrameNumbers('player',{start: 4, end: 4}),
            frameRate: 12,
            repeat: -1
        })
    }

    /**
     * 创建景物动画
     */
    createSceneryAnim() {
        //开门动画
        this.anims.create({
            key: 'openDoor',
            frames: this.anims.generateFrameNumbers('doorOpen',{start: 0,end: 15}),
            frameRate: 12,
            repeat: -1
        })
        //紫色法阵动画
        this.anims.create({
            key: 'purpleArrayAnim',
            frames: this.anims.generateFrameNumbers('purpleArray',{start: 0,end: 15}),
            frameRate: 12,
            repeat: -1
        })
        //紫色水晶旋转动画
        this.anims.create({
            key: 'purpleDiamondAnim',
            frames: this.anims.generateFrameNumbers('purpleDiamond',{start: 0 ,end: 7}),
            frameRate: 6,
            repeat: -1
        })
    }

    /**
     * 创建怪物动画
     */
    createMonsterAnim() {
        //丧尸右走动画
        this.anims.create({
            key: 'zombieRunRight',
            frames: this.anims.generateFrameNumbers('zombie',{start: 12,end: 15}),
            frameRate: 12,
            repeat: -1
        })
        //丧尸左走动画
        this.anims.create({
            key: 'zombieRunLeft',
            frames: this.anims.generateFrameNumbers('zombie',{start: 4,end: 7}),
            frameRate: 12,
            repeat: -1
        })
    }

    /**
     * 创建景物精灵
     */
    createScenery() {
        //创建紫色法阵的精灵
        purpleArrayGroup = this.add.group();
        purpleArrayGroupIndex = 0;
        for (let i = 0; i < 10; i++) {
            purpleArrayGroup.create(-1000,-1000,'doorOpen').setScale(4);
        }
        //创建文字提示
        textTips = this.add.text(-1000,-1000,'' ,{fontSize: '48px'});
        textTips.setColor('#ff2929')
        //创建计时器移除文字提示
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                textTips.setText('')
            },
            loop:true
        })
        //创建开局获取武器的紫色水晶
        purpleDiamondObj = this.physics.add.staticSprite(800,860, 'purpleDiamond')
            .setScale(5)
            .setSize(120,240)
            .setOffset(-40,-100);
        purpleDiamondObj.anims.play('purpleDiamondAnim',true)
        //创建文字提示
        var purpleDiamondObjText = this.add.text(660,700,'靠近使用E键获取武器' ,{fontSize: '32px'});
        purpleDiamondObjText.setColor('#9b4aff')
    }

    /**
     * 处理怪物伤害
     * @param player
     * @param monster
     */
    monsterHurt(player,monster) {
        var damage = monster.getData('damage');
        this.playerHealthReduction(damage);
    }

    /**
     * 玩家血量扣减
     * @constructor
     */
    playerHealthReduction(damage) {
        //受伤标志
        hurtFlag = true;
        //扣减血量
        playerHealthNow = playerHealthNow - damage;
        playerHealthNowTextObj.setText(playerHealthNow + ' / ' + playerHealthMax)
        //计算比例
        greenHealth.displayWidth = 220 * (playerHealthNow / playerHealthMax);
        //击退动画
        player.setVelocityX(-400)
        player.setVelocityY(-400)
        this.time.delayedCall(500,() => {
            hurtFlag = false;
        })
    }

    /**
     * 公共碰撞检测创建
     */
    createCollider() {
        //碰撞检测（玩家，道路）
        this.physics.add.collider(player,roadGroup)
        //碰撞检测（子弹，道路）
        // this.physics.add.collider(bullets,roadGroup)
        //碰撞检测（丧尸，道路）
        this.physics.add.collider(zombies,roadGroup)
        //碰撞检测（丧尸，子弹）
        // this.physics.add.collider(zombies,bullets)
        //接触检测（玩家，紫色水晶）
        this.physics.add.overlap(player,purpleDiamondObj, this.getWeaponFromStart,null,this)
        //接触检测（玩家，丧尸）
        this.physics.add.overlap(player,zombies,this.monsterHurt,null,this)
        //接触检测（子弹，丧尸）
        this.physics.add.overlap(bullets,zombies,this.monsterDeath,null,this)
        //接触检测（子弹，道路）
        this.physics.add.overlap(bullets,roadGroup,this.bulletDeath,null,this)
    }

    /**
     * 接触水晶，获得武器
     */
    getWeaponFromStart() {
        //交互
        if (interactiveKey.isDown) {
            if (player.getData('weapon1') === 1) {
                textTips.setText('不可以重复获得')
                interactiveKey.reset()
            } else {
                player.setData('weapon1',1)
                textTips.setText('获得武器')
                weaponGroup.create(0,0,'staff1_1')
                    .setScale(0.5)
                    .setRotation(-45)
                    .setData('XWithPlayer',36)
                    .setData('YWithPlayer',15);
                interactiveKey.reset()
            }
        }
    }

    /**
     * 怪物死亡
     */
    monsterDeath(bullet,zombie) {
        bullet.disableBody(true,true);
        zombie.disableBody(true,true)
        bullets.remove(bullet)
        zombies.remove(zombie)
    }

    /**
     * 子弹消失
     */
    bulletDeath(bullet,road) {
        bullet.disableBody(true,true);
        bullets.remove(bullet)
    }

    /**d
     * 检测死亡
     */
    detectDeath() {
        //当玩家Y坐标大于1100时死亡（跌落）
        if (player.y >= 1100) {
            this.restartScene()
        }
        if (playerHealthNow <= 0) {
            this.restartScene()
        }
    }

    /**
     * 重置场景
     */
    restartScene() {
        this.scene.restart()
    }

}
