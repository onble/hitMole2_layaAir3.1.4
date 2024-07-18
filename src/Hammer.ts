const { regClass, property } = Laya;

@regClass()
export class Hammer extends Laya.Script {
    declare owner: Laya.Sprite;
    private animatorController: Laya.Animator2D;
    private static instance: Hammer;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        this.animatorController = this.owner.getComponent(Laya.Animator2D);
    }

    constructor() {
        super();
        if (Hammer.instance == undefined) {
            Hammer.instance = this;
        }
    }

    public static getInstance() {
        if (!Hammer.instance) {
            Hammer.instance = new Hammer();
        }
        return Hammer.instance;
    }

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    //onStart(): void {}

    //手动调用节点销毁时执行
    //onDestroy(): void {}

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onUpdate(): void {}

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}

    // 开始使用
    onStart(): void {
        // 隐藏鼠标
        Laya.Mouse.hide();
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    // 结束使用
    end(): void {
        Laya.Mouse.show();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }

    MouseDown(evt: Laya.Event): void {
        console.log("MouseDown");
        this.animatorController.play("hit", 0, 1);
        // this.animatorController.setParamsBool("hitting", true);
    }
    onMouseMove(evt: Laya.Event): void {
        this.owner.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }
}
