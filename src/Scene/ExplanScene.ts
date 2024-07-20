const { regClass } = Laya;
import { ExplanSceneBase } from "./ExplanScene.generated";

@regClass()
export class ExplanScene extends ExplanSceneBase {
    onAwake(): void {
        this.back.on(Laya.Event.CLICK, this, this.closeScene);
    }

    private closeScene(): void {
        Laya.Scene.close("Scene/explan.ls");
        Laya.Scene.open("Scene/start.ls");
    }
}
