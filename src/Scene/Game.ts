const { regClass } = Laya;
import { Hammer } from "../Hammer";
import { Mole } from "../Mole";
import Contains from "../pub/Contains";
import { GameBase } from "./Game.generated";

@regClass()
export class Game extends GameBase {
    // 用来记录所有地鼠
    private moles: Array<Mole>;
    // 地鼠的总数
    private moleNumber: number = 9;
    // 记录分数
    private score: number = 0;
    // 设定需要游玩多少秒结束时间进度
    private playRoundTime: number = 90;
    // 游戏开始的倒计时2,1,0
    private gameStartCountdown: number = 2;
    // 倒计时文字的缩放系数 TODO:观察用sin函数的效果
    private countdownNumbeScaleDelta: number = 1;
    // 过关所需的分数
    private aimScore: number;
    // 不同地鼠的奖励
    private reward: Array<Function> = [
        (score: number) => {
            return score * 1.2;
        },
        (score: number) => {
            return score + 100;
        },
        (score: number) => {
            return score + 500;
        },
        (score: number) => {
            return score - 100;
        },
        (score: number) => {
            return score * 0.5;
        },
    ];
    // 是否暂停
    private isPause: boolean = false;

    constructor() {
        super();
        Laya.stage.bgColor = "#ffcccc";
    }

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        // 给游戏暂停按钮添加点击事件
        this.PauseButton.on(Laya.Event.CLICK, this, this.PauseButtonHandle);
        // 给音量播放按钮添加点击事件
        this.SoundButton.on(Laya.Event.CLICK, this, this.isPlayMsc);
        // 给关闭按钮添加点击事件
        this.CloseButton.on(Laya.Event.CLICK, this, this.backHome);
        // 给返回菜单按钮添加点击事件
        this.backButton.on(Laya.Event.CLICK, this, this.backHome);
        // 对节点操作，不能在场景的constructor，要在这个生命周期进行
        this.moles = new Array<Mole>();
        Laya.SoundManager.soundVolume = 0.5; // 设置全局音量为50%
        Laya.SoundManager.musicVolume = 0.5; // 设置全局音量为50%

        // 打击的回调 注意once 参数，要每次击中都进行回调
        const hitCallBackHd: Laya.Handler = Laya.Handler.create(
            this,
            this.setScore,
            null,
            false
        );
        for (let i: number = 0; i < this.moleNumber; i++) {
            const box: Laya.Box = this.getChildByName("item" + i) as Laya.Box;
            const mole: Mole = new Mole(
                box.getChildByName("normal") as Laya.Image,
                box.getChildByName("hit") as Laya.Image,
                box.getChildByName("scoreImg") as Laya.Image,
                0,
                hitCallBackHd
            );
            this.moles.push(mole);
        }

        // 显示倒计时3,2,1
        this.showCountDown();
    }
    onOpened(): void {
        // 开始计时器
        Laya.timer.resume();
        // 对声音进行初始化判断
        this.initSoundManager();
        // 倒计时的时候锤子就显示了
        this.hammerContinueUsing();
        // 新游戏将关卡数归1
        Contains.checkPoint = 1;
        // 渲染关卡数
        this.renderCheckpointNumbers();
        // 设置过关分数
        this.aimScore = Contains.passScore;
        this.renderPassScoreNumbers();

        this.showCountDown();
    }
    setScore(moleType: number): void {
        if (Contains.isPlySnd) {
            if (moleType < 4) {
                Laya.SoundManager.playSound("resources/music/hit1.mp3");
            } else {
                Laya.SoundManager.playSound("resources/music/hit2.mp3");
            }
        }
        this.score = this.reward[moleType - 1](this.score);
        //过关
        if (this.score >= this.aimScore) {
            // 隐藏锤子
            this.hammerPauseUsing();
            Laya.timer.pause();
            this.pass.visible = true;
            this.Start.visible = true;
            this.Start.on(Laya.Event.CLICK, this, this.next);
        }
        if (this.score < 0) {
            // 防止分数变成负数
            this.score = 0;
        }
        this.updateScore();
    }
    //游戏是否暂停
    private PauseButtonHandle(): void {
        // 进行取反操作
        this.isPause = !this.isPause;
        if (this.isPause) {
            // 暂停
            Laya.timer.pause();
            this.hammerPauseUsing();
        } else {
            Laya.timer.resume();
            this.hammerContinueUsing();
        }
        this.renderPauseButton();
    }
    // 渲染暂停按钮
    renderPauseButton() {
        if (this.isPause) {
            // 暂停了
            this.PauseButton.skin = "resources/ui/main/btn_start.png";
        } else {
            this.PauseButton.skin = "resources/ui/main/btn_pause.png";
        }
    }
    //是否播放音乐
    private isPlayMsc(): void {
        if (this.SoundButton.skin == "resources/ui/main/btn_sod_cl.png") {
            Contains.isPlyMsc = true;
            this.SoundButton.skin = "resources/ui/main/btn_sod_pl.png";
            Laya.SoundManager.playMusic("resources/music/bgMsc.mp3");
        } else {
            Contains.isPlyMsc = false;
            this.SoundButton.skin = "resources/ui/main/btn_sod_cl.png";
            Laya.SoundManager.stopMusic();
        }
    }
    // 回到首页
    backHome(): void {
        // 隐藏锤子
        this.hammerPauseUsing();
        // 清除定时任务
        Laya.timer.clearAll(this);
        Laya.Scene.open("Scene/start.ls");
    }
    //开始倒计时
    private showCountDown(): void {
        if (this.countdownNumbeScaleDelta < 0) {
            if (this.gameStartCountdown == 0) {
                Laya.timer.clear(this, this.showCountDown);
                this.startGame();
            }
            this.countdownNumbeScaleDelta = 1;
            this.countDown.index = --this.gameStartCountdown;
        } else {
            this.countDown.visible = true;
            this.countdownNumbeScaleDelta -= 0.02;
            const scaleValue: number = Math.sin(this.countdownNumbeScaleDelta);
            this.countDown.scale(scaleValue, scaleValue);
            Laya.timer.loop(1, this, this.showCountDown);
        }
    }
    // 开始游戏
    startGame(): void {
        // 设置时间进度条
        this.timerBar.value = 1;
        Laya.timer.loop(1000, this, this.changeProgressTime);
        Laya.timer.loop(Contains.showTime, this, this.showMole);
        // 将分数归零
        this.score = 0;
    }
    //设置当前过关分数
    private renderPassScoreNumbers(): void {
        let score = this.aimScore;
        const AimScoreData: any = {};
        for (let i = 4; i >= 0; --i) {
            AimScoreData["item" + i] = {
                index: Math.floor(score % 10),
            };
            score /= 10;
        }
        this.AimScore.dataSource = AimScoreData;
    }
    //下一关
    private next(): void {
        this.hammerContinueUsing();
        this.pass.visible = false;
        this.Start.visible = false;
        //更新过关分数
        this.aimScore *= 1.5;
        this.renderPassScoreNumbers();
        //更新地鼠显示时长
        if (Contains.showTime >= 500) {
            Contains.showTime *= 0.95;
        }
        //初始当前得分
        this.score = 0;
        this.updateScore();
        //更新当前关数
        Contains.checkPoint++;
        this.renderCheckpointNumbers();
        // 更新计时器
        Laya.timer.resume();
        // 更新倒计时进度条
        this.timerBar.value = 1;
    }
    //更新当前得分
    updateScore(): void {
        const ScoreNumsData: any = {};
        let tmp: number = this.score;
        for (let i = 6; i >= 0; i--) {
            ScoreNumsData["item" + i] = { index: Math.floor(tmp % 10) };
            tmp /= 10;
        }
        this.scoreNums.dataSource = ScoreNumsData;
    }
    // 游戏倒计时进度条
    changeProgressTime() {
        this.timerBar.value -= 1 / this.playRoundTime;
        if (this.timerBar.value <= 0) {
            // 清除所有的定时器
            Laya.timer.clearAll(this);
            this.GameOver.visible = true;
            this.backButton.visible = true;
        }
    }
    //显示地鼠
    showMole(): void {
        const index: number = Math.floor(Math.random() * this.moleNumber);
        this.moles[index].show();
    }
    //初始化播放图标
    private initSoundManager(): void {
        if (Contains.isPlyMsc) {
            Laya.SoundManager.playMusic("resources/music/bgMsc.mp3");
            this.SoundButton.skin = "resources/ui/main/btn_sod_pl.png";
        } else {
            this.SoundButton.skin = "resources/ui/main/btn_sod_cl.png";
            Laya.SoundManager.stopMusic();
        }
    }
    // 锤子暂停使用
    hammerPauseUsing() {
        // 隐藏锤子
        this.hammer.visible = false;
        // 显示鼠标
        Laya.Mouse.show();
    }
    // 继续使用锤子
    hammerContinueUsing() {
        // 隐藏鼠标
        Laya.Mouse.hide();
        // 给锤子重新定位
        this.hammer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        // 娴熟锤子
        this.hammer.visible = true;
    }
    // 渲染当前关卡数
    renderCheckpointNumbers() {
        let Levels: number = Contains.checkPoint;
        const checkpointData: any = {};
        for (let i = 1; i >= 0; --i) {
            checkpointData["item" + i] = { index: Math.floor(Levels % 10) };
            Levels /= 10;
        }
        this.checkpoint.dataSource = checkpointData;
    }
}
