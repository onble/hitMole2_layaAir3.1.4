const { regClass } = Laya;
import { GameStartBase } from "./GameStart.generated";

@regClass()
export class GameStart extends GameStartBase {
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        // 下面的代码会让屏幕出现白边
        // 下面控制屏幕显示居中
        // 设置不缩放
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOSCALE;
        // 设置高度居中
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        // 设置水平居中
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        // 设置屏幕自动横屏
        // Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        this.startBtn.on(Laya.Event.CLICK, this, this.startGame);
    }
    startGame() {
        // 跳转场景
        Laya.Scene.open("Game.ls", true);
    }
}
