const { regClass } = Laya;
import Contains from "../pub/Contains";
import { ConfSceneBase } from "./ConfScene.generated";

@regClass()
export class ConfScene extends ConfSceneBase {
    onAwake(): void {
        this.epb.on(Laya.Event.CLICK, this, this.closeScene);
        this.msc.on(Laya.Event.CLICK, this, this.isPlayMsc);
        this.snd.on(Laya.Event.CLICK, this, this.isPlaySnd);
        this.initSnd();
    }
    private closeScene(): void {
        Laya.Scene.open("Scene/start.ls");
    }

    //是否播放背景音乐
    private isPlayMsc(): void {
        if (this.msc.index == 1) {
            this.msc.index = 0;
            Contains.isPlyMsc = false;
            Laya.SoundManager.stopMusic();
        } else {
            this.msc.index = 1;
            Contains.isPlyMsc = true;
            Laya.SoundManager.playMusic("resources/music/bgMsc.mp3");
        }
    }

    //是否播放音效
    private isPlaySnd(): void {
        if (this.snd.index == 1) {
            this.snd.index = 0;
            Contains.isPlySnd = false;
        } else {
            this.snd.index = 1;
            Contains.isPlySnd = true;
        }
    }

    //初始化播放状态
    private initSnd(): void {
        if (Contains.isPlyMsc) {
            this.msc.index = 1;
        } else {
            this.msc.index = 0;
        }
        if (Contains.isPlySnd) {
            this.snd.index = 1;
        } else {
            this.snd.index = 0;
        }
    }
}
