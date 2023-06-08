import Phaser from 'phaser';

var roadGroup;
var sceneryObj;
var cursors;
var player;
var attackOne;
var attackTwo;
var bullets;
var zombies;
var playerLastDirection = 1;
var background1;
var background2;
var mainCameras;
var rightBoundaryBase = 2;
var lastRightCamerasCoordinate = 0;
var lastRightBackground;
var lastLeftBackground;
export default class playScene extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {

    }

    create ()
    {
        //获取屏幕尺寸
        var sceneWidth = this.cameras.main.width;
        var sceneHeight = this.cameras.main.height;
        background1 = this.add.tileSprite(0, 0, 576,324, 'sky');
        background2 = this.add.tileSprite(sceneWidth, 0, 576,324, 'sky');
        lastRightBackground = background2;
        lastLeftBackground = background1;
        background1.setScale(sceneWidth / 576, sceneHeight / 324).setOrigin(0,0)
        background2.setScale(sceneWidth / 576, sceneHeight / 324).setOrigin(0,0)
        background1.setTilePosition(0,0)
        background2.setTilePosition(0,0)
        //创建临时提示
        this.add.text(300,300,'目前是开发阶段的Demo      操作说明：W A S D 控制方向，J键攻击',{fontSize: '48px'})
        // 设置相机的滚动因子
        mainCameras = this.cameras.main.setScroll(-0.3, 0);
        //相机缩放
        mainCameras.zoom = 1
        //相机边界
        mainCameras.setBounds(0,0,Infinity,1080)
        //设置此场景重力
        this.physics.world.gravity.y = 1000;
        //创建路
        roadGroup = this.physics.add.staticGroup();
        //创建景物
        sceneryObj = this.physics.add.staticGroup();
        this.createGrassRoads();
        //创建玩家
        player = this.physics.add.sprite(100,900,'player').setSize(130,110);
        player.setBounce(0.1)
        // player.setCollideWorldBounds(true)
        //创建人物移动键盘监听
        cursors = this.input.keyboard;
        //创建人物攻击①键盘监听
        attackOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        //相机跟随
        mainCameras.startFollow(player,true,1,0)
        mainCameras.setFollowOffset(0,0)
        //碰撞检测
        this.physics.add.collider(player,roadGroup)
        //创建子弹组
        bullets = this.physics.add.group()
        this.physics.add.collider(bullets,roadGroup)
        //丧尸组
        zombies = this.physics.add.group()
        this.physics.add.collider(zombies,roadGroup)
        this.physics.add.collider(zombies,bullets)
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
            player.setVelocityX(-460);
            playerLastDirection = -1
        }
        else if (cursors.addKey('D').isDown)
        {
            player.setVelocityX(460);
            playerLastDirection = 1
        }
        else
        {
            player.setVelocityX(0);
        }

        if (cursors.addKey('W').isDown && player.body.touching.down)
        {
            player.setVelocityY(-530);
        }

        if (cursors.addKey('S').isDown && !player.body.touching.down)
        {
            player.setVelocityY(+930);
        }

        if (attackOne.isDown) {
            //子弹速度
            var bulletSpeed = 3200;
            //玩家单位向量
            var unitVector = player.body.velocity.clone().normalize();
            var bullet = bullets.create(player.x,player.y,'player').setScale(0.2,0.2);
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
        this.adjustmentBackground()


        //检测死亡
        this.detectDeath();
    }

    createZombie() {
        var x = player.x + 1920
        zombies.create(x,600,'zombie').setScale(2).setSize(100,200).setDrag(2300,200)
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
        roadGroup.create(0,1150,'grassPlatformLeft').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
        for (let i = 1; i < 200; i++) {
            roadGroup.create(i * 200,1150,'grassPlatformMiddle').setSize(210,64).setOrigin(0,1).setScale(3.1).setOffset(40,-150)
            sceneryObj.create(i * 2000,650,'houseOne').setScale(6)
        }
    }

    /**
     * 检测死亡
     */
    detectDeath() {
        //当玩家Y坐标大于1100时死亡
        if (player.y >= 1100) {
            this.scene.restart()
        }
    }

}
