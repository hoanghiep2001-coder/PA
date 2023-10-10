import GamePlay from "./GamePlay";

const {ccclass, property} = cc._decorator;

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
            this.setHorizontal();
        } else {
            this.isRotate = false;
            this.setVertical();
        }
    }

    private setHorizontal(): void {
        if(cc.view.getFrameSize().height / cc.view.getFrameSize().width < 0.65) {
            // Iphone 6 / 6 plus / 7 / 7 Plus / X
            this.setHorizontalForIpX();
        } else {
            this.setHorizontalForTablet();
        }
    }

    private setHorizontalForIpX(): void {
        if(this.HORIZONTAL_IPX === this.device) {
            return;
        }
        this.device = this.HORIZONTAL_IPX;

        this.GamePlay.Text_TestIQ.x = -280;
        this.GamePlay.Text_TestIQ.y = 120;

        this.GamePlay.Text_Drag.x = 280;
        this.GamePlay.Text_Drag.y = 120;

        this.GamePlay.BtnContainer.y = -190;
        this.GamePlay.BtnContainer.scale = 0.9;
    }

    private setHorizontalForTablet(): void {
        if(this.HORIZONTAL_TABLET === this.device) {
            return;
        }

        this.device = this.HORIZONTAL_TABLET;

        this.GamePlay.Text_TestIQ.x = -220;
        this.GamePlay.Text_TestIQ.y = 120;
        this.GamePlay.Text_TestIQ.scale = 0.22;
        
        this.GamePlay.Text_Drag.x = 220;
        this.GamePlay.Text_Drag.y = 120;
        this.GamePlay.Text_Drag.scale = 0.25;

        this.GamePlay.bag.x = 52;
        this.GamePlay.Girl_Default.x = 86;
        this.GamePlay.Girl_Win.x = 86;
        this.GamePlay.Point_Girl.x = 91;

        this.GamePlay.BtnContainer.y = -190;
        this.GamePlay.BtnContainer.scale = 0.9;
        
    }

    private setVertical(): void {
        if (cc.view.getFrameSize().width / cc.view.getFrameSize().height < 0.5) {
            this.setIphoneX();
        } else {
            this.setMobile();
        }
    }

    private setIphoneX(): void {
        if(this.VERTICAL_IPX === this.device) {
            return;
        }

        this.device = this.VERTICAL_IPX;

        this.GamePlay.Text_TestIQ.x = 0;
        this.GamePlay.Text_TestIQ.y = 240;

        this.GamePlay.Text_Drag.x = 0;
        this.GamePlay.Text_Drag.y = -270;

        this.GamePlay.BtnContainer.y = -205;
        this.GamePlay.BtnContainer.scale = 1;
    }

    private setMobile(): void {
        if(this.VERTICAL_MOBILE === this.device) {
            return;
        }

        this.device = this.VERTICAL_MOBILE;

        if(cc.view.getFrameSize().height / cc.view.getFrameSize().width > 1.5) {
            // if (cc.view.getFrameSize().width / cc.view.getFrameSize().height >= 0.6 && cc.view.getFrameSize().width / cc.view.getFrameSize().height < 0.62) {
            //     // mobile mode applovin
          
            //     return;
            // }

            // Iphone 6 / 6 Plus / 7 / 7 Plus   
            this.GamePlay.Text_TestIQ.x = 0;
            this.GamePlay.Text_TestIQ.y = 240;

            this.GamePlay.Text_Drag.x = 0;
            this.GamePlay.Text_Drag.y = -255;

            this.GamePlay.BtnContainer.y = -205;
            this.GamePlay.BtnContainer.scale = 1;
        } else {
            this.GamePlay.Text_TestIQ.x = 0;
            this.GamePlay.Text_TestIQ.y = 210;
            this.GamePlay.Text_TestIQ.scale = 0.2;

            this.GamePlay.Text_Drag.x = 0;
            this.GamePlay.Text_Drag.y = -205;
            this.GamePlay.Text_Drag.scale = 0.25;

            this.GamePlay.bag.x = 87;
            this.GamePlay.Girl_Default.x = 121;
            this.GamePlay.Girl_Win.x = 121;
            this.GamePlay.Point_Girl.x = 125;

            this.GamePlay.BtnContainer.y = -190;
            this.GamePlay.BtnContainer.scale = 0.9;
        }
    }

    protected update(dt: number): void {
        this.handleRotate();
    }
}
