const { regClass } = Laya;
import { LoadingSceneBase } from "./LoadingScene.generated";

@regClass()
export class LoadingScene extends LoadingSceneBase {
    constructor() {
        super();
        // TODO:这里打包后预加载的操作还没有学会，需要进行尝试
    }
}
