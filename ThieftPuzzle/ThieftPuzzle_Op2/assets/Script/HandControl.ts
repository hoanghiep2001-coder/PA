import { JoyStick } from "./JoyStick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(JoyStick)
  JoyStick: JoyStick = null;

  @property(cc.Node)
  Line: cc.Node = null;

  // state
  handDirectionMove: string = "stop";

  protected start(): void {

  }

  private directionMove(value: number | null) {
    let result: string = "";
    if (value === null) {
      return (result = "stop");
    } else {
      if (-25 <= value && value < 0) return (result = "top");
      if (0 <= value && value < 25) return (result = "top");
      if (25 <= value && value < 90) return (result = "top-right");
      if (-90 <= value && value < -25) return (result = "top-left");


      if (90 <= value && value < 135) return (result = "right");
      if (-135 <= value && value < -90) return (result = "left");


      if (165 <= value && value < 180) return (result = "bottom");
      if (-180 <= value && value < -165) return (result = "bottom");
      if (135 <= value && value < 180) return (result = "bottom-right");
      if (-180 <= value && value < -135) return (result = "bottom-left");
    }
  }

  protected update(dt: number): void {
    this.handDirectionMove = this.directionMove(this.JoyStick.angleMove);
    switch (this.handDirectionMove) {
      case "stop":
        break;

      case "top":
        this.node.angle = cc.misc.lerp(this.node.angle, 90, 0.2);
        break;
      case "top-right":
        this.node.angle = cc.misc.lerp(this.node.angle, 45, 0.2);
        break;
      case "top-left":
        this.node.angle = cc.misc.lerp(this.node.angle, 135, 0.2);
        break;

      case "left":
        this.node.angle = cc.misc.lerp(this.node.angle, 180, 0.2);
        break;
      case "right":
        this.node.angle = cc.misc.lerp(this.node.angle, 0, 0.2);
        break;

      case "bottom-right":
        this.node.angle = cc.misc.lerp(this.node.angle, -45, 0.2);
        break;
      case "bottom":
        this.node.angle = cc.misc.lerp(this.node.angle, -90, 0.2);
        break;
      case "bottom-left":
        this.node.angle = cc.misc.lerp(this.node.angle, -135, 0.2);
        break;

      default:
        break;
    }

  }

}
