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
        this.timerBar.value = 1;
        this.score = 0;

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
        Laya.timer.loop(1000, this, this.onLoop);
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
    gameOver(): void {
        Laya.timer.clear(this, this.onLoop);
        // 隐藏锤子
        this.hammer.visible = false;
        Hammer.getInstance().end();
        console.log("游戏结束!");
    }
    setScore(type: number): void {
        this.score += type == 1 ? -100 : 100;
        if (this.score < 0) this.score = 0;
        this.updateScoreUI();
    }
    updateScoreUI(): void {
        const data: any = {};
        let temp: number = this.score;
        for (let i: number = 9; i >= 0; i--) {
            data["item" + i] = { index: Math.floor(temp % 10) };
            temp /= 10;
        }
        this.scoreNums.dataSource = data;
    }
}
