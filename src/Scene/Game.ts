const { regClass } = Laya;
import { Mole } from "../Mole";
import { GameBase } from "./Game.generated";

@regClass()
export class Game extends GameBase {
    // 用来记录所有地鼠
    private moles: Array<Mole>;
    // 地鼠的总数
    private moleNum: number = 9;
    constructor() {
        super();
        Laya.stage.bgColor = "#ffcccc";
    }

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        // 对节点操作，不能在场景的constructor，要在这个生命周期进行
        this.moles = new Array<Mole>();
        for (let i: number = 0; i < this.moleNum; i++) {
            const box: Laya.Box = this.getChildByName("item" + i) as Laya.Box;
            const mole: Mole = new Mole(
                box.getChildByName("normal") as Laya.Image,
                box.getChildByName("hit") as Laya.Image,
                21
            );
            this.moles.push(mole);
        }
        Laya.timer.loop(1000, this, this.onLoop);
    }
    onLoop(): void {
        const index: number = Math.floor(Math.random() * this.moleNum);
        this.moles[index].show();
    }
}
