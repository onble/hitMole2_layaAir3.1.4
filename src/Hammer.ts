const { regClass, property } = Laya;

@regClass()
export class Hammer extends Laya.Script {
    declare owner: Laya.Sprite;
    private animatorController: Laya.Animator2D;
    private using: boolean = false;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        this.animatorController = this.owner.getComponent(Laya.Animator2D);
    }

    constructor() {
        super();
    }

    // 开始使用
    public onStart(): void {
        if (this.using == false) {
            this.using = true;
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            // 调用一次鼠标移动，让锤子出现后立马定位到鼠标所在位置
            this.onMouseMove();
            // 隐藏鼠标
            // Laya.Mouse.hide();
            this.owner.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        } else {
            this.continueUsing();
        }
    }
    // 结束使用
    end(): void {
        this.using = false;
        Laya.Mouse.show();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    // 暂停使用锤子
    public pauseUsing(): void {
        this.owner.visible = false;
        Laya.Mouse.show();
    }
    // 继续使用锤子
    public continueUsing(): void {
        // this.onMouseMove();
        Laya.Mouse.hide();
        this.owner.visible = true;
    }

    MouseDown(): void {
        this.animatorController.play("hit", 0, 1);
        // this.animatorController.setParamsBool("hitting", true);
    }
    onMouseMove(): void {
        this.owner.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }
}
