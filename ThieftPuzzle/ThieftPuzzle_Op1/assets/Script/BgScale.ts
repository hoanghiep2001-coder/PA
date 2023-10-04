const {ccclass, property} = cc._decorator;

@ccclass("BgScale")
export default class BgScale extends cc.Component {
    protected update(dt: number): void {
        this.setFitSize();
    }

    setFitSize(): void {
        let bgWidth: number = this.node.width;
        let screen_width: number = cc.winSize.width;
        let screen_height: number = cc.winSize.height;
        if (screen_width != bgWidth) {
          this.node.width = screen_width;
          this.node.height = screen_height;
        }
        if (screen_width < screen_height) {
          this.node.width = screen_width + 100;
        }
      }
}
