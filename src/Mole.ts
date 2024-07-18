const { regClass, property } = Laya;
/**
 * 地鼠逻辑类
 * 状态：显示，停留，消失，受击
 */
@regClass()
export class Mole extends Laya.Script {
    declare owner: Laya.Sprite;

    // 正常时候地鼠的图片对象
    private normalState: Laya.Image;
    // 被打击时候地鼠的图片对象
    private hitState: Laya.Image;
    // 地鼠下蹲的Y值
    private downY: number;
    // 地鼠探头时候的Y值
    private upY: number;
    // 分数图片
    private scoreImg: Laya.Image;
    // 分数图片的最高点y值
    private scoreY: number;
    // 受击回调函数处理器
    private hitCallBackHd: Laya.Handler;

    // 当前地鼠是否已被激活
    private isActive: boolean;
    // 地鼠是否处于显示状态
    private isShow: boolean;
    // 地鼠是否处于受击状态
    private isHit: boolean;
    // 地鼠类型 1:蓝色地鼠 2:黄色海盗地鼠
    private type: number;

    constructor(
        normalState: Laya.Image,
        hitState: Laya.Image,
        scoreImg: Laya.Image,
        downY: number,
        hitCallBackHd: Laya.Handler
    ) {
        super();
        this.normalState = normalState;
        this.hitState = hitState;
        this.downY = downY;
        this.upY = this.normalState.y;
        this.hitCallBackHd = hitCallBackHd;
        this.scoreImg = scoreImg;
        this.scoreY = this.scoreImg.y;

        this.reset();
        // 给正常地鼠状态的图片添加点击事件
        this.normalState.on(Laya.Event.MOUSE_DOWN, this, this.hit);
    }

    @property(String)
    public text: string = "";

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    //onAwake(): void {}

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

    // 重置
    reset(): void {
        this.normalState.visible = false;
        this.hitState.visible = false;
        this.scoreImg.visible = false;
        this.isActive = false;
        this.isShow = false;
        this.isHit = false;
    }
    // 显示
    show(): void {
        if (this.isActive) return;
        this.isActive = true;
        this.isShow = true;
        // 下面使用随机数逻辑确定地鼠的种类
        this.type = Math.random() < 0.3 ? 1 : 2;
        this.normalState.skin =
            "resources/ui/mouse_normal_" + this.type + ".png";
        this.hitState.skin = "resources/ui/mouse_hit_" + this.type + ".png";
        this.scoreImg.skin = "resources/ui/score_" + this.type + ".png";
        this.normalState.y = this.downY;
        this.normalState.visible = true;
        Laya.Tween.to(
            this.normalState,
            { y: this.upY },
            500,
            Laya.Ease.backOut,
            Laya.Handler.create(this, this.showComplete)
        );
    }
    // 停留
    showComplete(): void {
        if (this.isShow && !this.isHit) {
            Laya.timer.once(2000, this, this.hide);
        }
    }
    // 消失
    hide(): void {
        if (this.isShow && !this.isHit) {
            this.isShow = false;
            Laya.Tween.to(
                this.normalState,
                { y: this.downY },
                300,
                Laya.Ease.backIn,
                Laya.Handler.create(this, this.reset)
            );
        }
    }
    // 受击
    hit(): void {
        if (this.isShow && !this.isHit) {
            this.isHit = true;
            this.isShow = false;
            Laya.timer.clear(this, this.hide);
            this.normalState.visible = false;
            this.hitState.visible = true;
            this.hitCallBackHd.runWith(this.type);
            Laya.timer.once(500, this, this.reset);
            this.showScore();
        }
    }
    // 显示得分飘字
    showScore(): void {
        this.scoreImg.y = this.scoreY + 30;
        this.scoreImg.scale(0, 0);
        this.scoreImg.visible = true;
        Laya.Tween.to(
            this.scoreImg,
            { y: this.scoreY, scaleX: 1, scaleY: 1 },
            300,
            Laya.Ease.backOut
        );
    }
}
