const { regClass } = Laya;
import { StartSceneBase } from "./StartScene.generated";
import Contains from "../pub/Contains";

@regClass()
export class StartScene extends StartSceneBase {
    constructor() {
        super();
        Laya.stage.bgColor = "#002d00";
    }
    onAwake(): void {
        this.startBtn.on(Laya.Event.CLICK, this, this.startGame);
        this.confBtn.on(Laya.Event.CLICK, this, this.confGame);
        this.explanBtn.on(Laya.Event.CLICK, this, this.explanGame);
        this.existBtn.on(Laya.Event.CLICK, this, this.existGame);
        if (Contains.isPlyMsc) {
            Laya.SoundManager.playMusic("resources/music/bgMsc.mp3");
        }
    }
    private startGame(): void {
        Laya.Scene.open("Scene/Game.ls");
    }

    private confGame(): void {
        Laya.Scene.open("Scene/conf.ls");
    }

    private explanGame(): void {
        Laya.Scene.open("Scene/explan.ls");
    }

    private existGame(): void {
        // TODO:下面这个退出在layaAir3.1.4中似乎不起作用
        window.close();
    }
}
