import GamePlay from "./GamePlay";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Responsive extends cc.Component {

    @property(GamePlay)
    GamePlay: GamePlay = null;


    // state
    device: string = "";
    isRotate: boolean = false;

    HORIZONTAL_IPX: string = "horizontal_IPX";
    HORIZONTAL_TABLET: string = "horizontal_Tablet";
    VERTICAL_IPX: string = "vertical_IPX";
    VERTICAL_MOBILE: string = "vertical_Mobile";

    protected onLoad(): void {

    }

    protected start(): void {

    }

    private handleRotate(): void {
        if (cc.view.getFrameSize().width > cc.view.getFrameSize().height) {
            this.isRotate = true;
            this.GamePlay.isRotate = true;
            this.setHorizontal();
        } else {
            this.isRotate = false;
            this.GamePlay.isRotate = false;
            this.setVertical();
        }
    }

    private setHorizontal(): void {
        if (cc.view.getFrameSize().height / cc.view.getFrameSize().width < 0.65) {
            // Iphone 6 / 6 plus / 7 / 7 Plus / X
            this.setHorizontalForIpX();
        } else {
            this.setHorizontalForTablet();
        }
    }

    private setHorizontalForIpX(): void {
        if (this.HORIZONTAL_IPX === this.device) {
            return;
        }
        this.device = this.HORIZONTAL_IPX;

        this.configHorizontal();

        this.GamePlay.Text_TestIQ.x = 0;
        this.GamePlay.Text_TestIQ.y = 200;

        this.GamePlay.Text_Drag.x = 0;
        this.GamePlay.Text_Drag.y = -200;
    }

    private setHorizontalForTablet(): void {
        if (this.HORIZONTAL_TABLET === this.device) {
            return;
        }

        this.device = this.HORIZONTAL_TABLET;

        this.configHorizontal();

        this.GamePlay.Bg.scale = 0.5;

        this.GamePlay.Text_TestIQ.x = 0;
        this.GamePlay.Text_TestIQ.y = 180;
        this.GamePlay.Text_TestIQ.scale = 0.22;

        this.GamePlay.Text_Drag.x = 0;
        this.GamePlay.Text_Drag.y = -200;
        this.GamePlay.Text_Drag.scale = 0.23;


    }

    private setVertical(): void {
        if (cc.view.getFrameSize().width / cc.view.getFrameSize().height < 0.5) {
            this.setIphoneX();
        } else {
            this.setMobile();
        }
    }

    private setIphoneX(): void {
        if (this.VERTICAL_IPX === this.device) {
            return;
        }

        this.device = this.VERTICAL_IPX;

        this.configVertical();

        this.GamePlay.Text_TestIQ.x = 0;
        this.GamePlay.Text_TestIQ.y = 240;

        this.GamePlay.Text_Drag.x = 0;
        this.GamePlay.Text_Drag.y = -270;
    }

    private setMobile(): void {
        if (this.VERTICAL_MOBILE === this.device) {
            return;
        }

        this.device = this.VERTICAL_MOBILE;

        if (cc.view.getFrameSize().height / cc.view.getFrameSize().width > 1.5) {
            if (cc.view.getFrameSize().width / cc.view.getFrameSize().height >= 0.6 && cc.view.getFrameSize().width / cc.view.getFrameSize().height < 0.62) {
                // mobile mode applovin

                this.configVertical();

                this.GamePlay.Text_TestIQ.x = 0;
                this.GamePlay.Text_TestIQ.y = 220;
                this.GamePlay.Text_TestIQ.scale = 0.23;

                this.GamePlay.Text_Drag.x = 0;
                this.GamePlay.Text_Drag.y = -235;

                return;
            }

            // Iphone 6 / 6 Plus / 7 / 7 Plus   

            this.configVertical();

            this.GamePlay.Text_TestIQ.x = 0;
            this.GamePlay.Text_TestIQ.y = 240;

            this.GamePlay.Text_Drag.x = 0;
            this.GamePlay.Text_Drag.y = -255;

        } else {
            this.GamePlay.Bg.scale = 0.55;

            this.configVertical();

            this.GamePlay.Text_TestIQ.x = 0;
            this.GamePlay.Text_TestIQ.y = 210;
            this.GamePlay.Text_TestIQ.scale = 0.2;

            this.GamePlay.Text_Drag.x = 0;
            this.GamePlay.Text_Drag.y = -205;
            this.GamePlay.Text_Drag.scale = 0.25;
        }
    }


    private configVertical(): void {
        // ---------------- config
        this.GamePlay.checkPoint_2.active = false;
        this.GamePlay.Fence2.active = false;
        this.GamePlay.reset();

        this.GamePlay.Bg.scale = 0.45;

        this.GamePlay.thief_Container.x = 0;
        this.GamePlay.thief_Container.y = 0;

        this.GamePlay.Point_A.x = -96;
        this.GamePlay.Point_A.y = 100;
        this.GamePlay.Point_B.x = -99;
        this.GamePlay.Point_B.y = 98;
        this.GamePlay.Point_C.x = -75;
        this.GamePlay.Point_C.y = 95;

        const posX = this.GamePlay.Point_A.x;
        const posY = this.GamePlay.Point_A.y;
        this.GamePlay.initPoint_A_Pos = new cc.Vec2(posX, posY);

        this.GamePlay.checkPoint_1.x = -100;

        this.GamePlay.Fence.x = -18.18;
        this.GamePlay.Fence_Top.x = -11;
        this.GamePlay.Fence_Top.width = 140;
        this.GamePlay.FenceFoot.x = -92;
        this.GamePlay.Fence_Left.x = -79;
        this.GamePlay.Fence_Bottom.x = -18;

        this.GamePlay.BreakPoint = new cc.Vec2(this.GamePlay.FenceFoot.x, this.GamePlay.FenceFoot.y);

        this.GamePlay.bag.x = 66;
        this.GamePlay.Girl_Default.x = 100;
        this.GamePlay.Girl_Win.x = 100;
        this.GamePlay.Point_Girl.x = 104;


        this.GamePlay.Hint_Horizontal.active = false;

        if (!this.GamePlay.isEndGame) {
            this.GamePlay.Hint_OpenGame.active = true;
            this.GamePlay.Hint_OpenGame.getComponent(cc.Animation).play("Hint_OpenSceneAnim");
        }

        // ----------------- 
    }


    private configHorizontal(): void {
        // --------- config
        this.GamePlay.checkPoint_2.active = true;
        this.GamePlay.Fence2.active = true;
        this.GamePlay.reset();

        this.GamePlay.Bg.scale = 0.55;

        this.GamePlay.thief_Container.x = -105;
        this.GamePlay.thief_Container.y = -29;

        this.GamePlay.Point_A.x = -201;
        this.GamePlay.Point_A.y = 71;
        this.GamePlay.Point_B.x = -204;
        this.GamePlay.Point_B.y = 69;
        this.GamePlay.Point_C.x = -180;
        this.GamePlay.Point_C.y = 66;

        const posX = this.GamePlay.Point_A.x;
        const posY = this.GamePlay.Point_A.y;
        this.GamePlay.initPoint_A_Pos = new cc.Vec2(posX, posY);

        this.GamePlay.checkPoint_1.x = -190;

        this.GamePlay.Fence.x = -111;
        this.GamePlay.Fence_Top.x = -14;
        this.GamePlay.Fence_Top.width = 320;
        this.GamePlay.FenceFoot.x = -184;
        this.GamePlay.Fence_Left.x = -171;
        this.GamePlay.Fence_Bottom.x = -110;

        this.GamePlay.BreakPoint = new cc.Vec2(this.GamePlay.FenceFoot.x, this.GamePlay.FenceFoot.y);

        this.GamePlay.bag.x = 165;
        this.GamePlay.Girl_Default.x = 199;
        this.GamePlay.Girl_Win.x = 199;
        this.GamePlay.Point_Girl.x = 203;

        this.GamePlay.Hint_OpenGame.active = false;
        if (!this.GamePlay.isEndGame) {
            this.GamePlay.Hint_Horizontal.active = true;
            this.GamePlay.Hint_Horizontal.getComponent(cc.Animation).play("Hint_Horizontal");
        }
        // -------------
    }


    protected update(dt: number): void {
        this.handleRotate();
    }
}
