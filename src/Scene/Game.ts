const { regClass } = Laya;
import { Mole } from "../Mole";
import { GameBase } from "./Game.generated";

@regClass()
export class Game extends GameBase {
    private mole: Mole;
    constructor() {
        super();
        Laya.stage.bgColor = "#ffcccc";
    }

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        this.mole = new Mole(this.normal, this.hit, 21);
        Laya.timer.loop(2000, this, this.onLoop);
    }
    onLoop(): void {
        this.mole.show();
    }
}
