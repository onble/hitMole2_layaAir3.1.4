const { regClass } = Laya;
import { Hammer } from "../Hammer";
import { Mole } from "../Mole";
import { GameBase } from "./Game.generated";

@regClass()
export class Game extends GameBase {
    // 用来记录所有地鼠
    private moles: Array<Mole>;
    // 地鼠的总数
    private moleNum: number = 9;
    // 记录分数
    private score: number;
    constructor() {
        super();
        Laya.stage.bgColor = "#ffcccc";
    }

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        // 对节点操作，不能在场景的constructor，要在这个生命周期进行
        this.moles = new Array<Mole>();

        // 打击的回调 注意once 参数，要每次击中都进行回调
        const hitCallBackHd: Laya.Handler = Laya.Handler.create(
            this,
            this.setScore,
            null,
            false
        );
        for (let i: number = 0; i < this.moleNum; i++) {
            const box: Laya.Box = this.getChildByName("item" + i) as Laya.Box;
            const mole: Mole = new Mole(
                box.getChildByName("normal") as Laya.Image,
                box.getChildByName("hit") as Laya.Image,
                box.getChildByName("scoreImg") as Laya.Image,
                21,
                hitCallBackHd
            );
            this.moles.push(mole);
        }
        this.hammer.visible = false;

        // 给游戏结束的按钮添加点击事件
        this.restartBtn.on(Laya.Event.CLICK, this, this.restartGame);
    }
    //第一次执行update之前执行，只会执行一次
    onOpened(): void {
        this.gameStart();
    }
    onLoop(): void {
        // 设置成需要减90个周期
        this.timerBar.value -= 1 / 90;
        if (this.timerBar.value <= 0) {
            this.gameOver();
            return;
        }
        const index: number = Math.floor(Math.random() * this.moleNum);
        this.moles[index].show();
    }
    /**
     * 开始游戏的时候将得分，进度条等数据进行重置
     */
    gameStart(): void {
        this.timerBar.value = 1;
        this.score = 0;
        // 刷新分数的UI显示
        this.updateScoreUI();
        this.hammer.visible = true;
        Laya.timer.loop(1000, this, this.onLoop);
    }
    gameOver(): void {
        Laya.timer.clear(this, this.onLoop);
        // 隐藏锤子
        this.hammer.visible = false;
        Hammer.getInstance().end();
        // 下面是控制显示的中轴线
        this.GameOver.centerX = 0;
        this.GameOver.centerY = 40;
        // 将游戏分数渲染到GameOver View中
        this.setScoreUI(this.score, this.scoreNumsSettlement);
        // 显示游戏结束的view
        this.GameOver.visible = true;
        console.log("游戏结束!");
    }
    setScore(type: number): void {
        this.score += type == 1 ? -100 : 100;
        if (this.score < 0) this.score = 0;
        this.updateScoreUI();
    }
    // 设置分数显示
    setScoreUI(score: number, scoreNums: Laya.Box): void {
        const data: any = {};
        let temp: number = this.score;
        for (let i: number = 9; i >= 0; i--) {
            data["item" + i] = { index: Math.floor(temp % 10) };
            temp /= 10;
        }
        scoreNums.dataSource = data;
    }
    // 这个可以被上面的函数取代
    updateScoreUI(): void {
        const data: any = {};
        let temp: number = this.score;
        for (let i: number = 9; i >= 0; i--) {
            data["item" + i] = { index: Math.floor(temp % 10) };
            temp /= 10;
        }
        this.scoreNums.dataSource = data;
    }
    restartGame() {
        // 跳转到游戏开始场景
        // 跳转场景
        Laya.Scene.open("GameStart.ls", true);
    }
}
