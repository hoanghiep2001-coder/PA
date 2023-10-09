
const { ccclass, property } = cc._decorator;

@ccclass("JoyStick")
export class JoyStick extends cc.Component {
  @property(cc.Node)
  stick: cc.Node = null;
  @property(cc.Node)
  Point_C: cc.Node = null;


  @property
  public max_r: number = 54;
  public isTouch: boolean = false;

  public angleMove: number | null = null;

  start() {}
  onLoad() {
    this.stick.setPosition(0, 0, 0);
    this.Point_C.on(cc.Node.EventType.TOUCH_START, this.stickMove, this);
    this.Point_C.on(cc.Node.EventType.TOUCH_MOVE, this.stickMove, this);
    this.Point_C.on(cc.Node.EventType.TOUCH_CANCEL, this.stickEnd, this);
    this.Point_C.on(cc.Node.EventType.TOUCH_END, this.stickEnd, this);
  }

  private stickMove(event: cc.Touch) {
    this.isTouch = true;
    const screenPos = event.getLocation();
    let pos = this.convertToLocalLocation(screenPos);
    const length = pos.mag();
    if (length > this.max_r) {
      pos = pos.multiplyScalar(this.max_r / length);
    }
    this.stick.x = pos.x;
    this.stick.y = pos.y;
  }

  private stickEnd(event: cc.Touch) {
    this.isTouch = false;
    this.stick.setPosition(0, 0, 0);
  }

  private convertToLocalLocation(value: cc.Vec2) {
    const localX: number = value.x - 160 - this.node.x;
    const localY: number = value.y - 240 - this.node.y;
    const result = new cc.Vec2(localX, localY);
    return result;
  }

  update(deltaTime: number) {
    if (this.isTouch) {
      const clone = this.stick.getPosition();
      const angle = cc.Vec2.angle(cc.v2(clone.x, clone.y), cc.v2(0, 100));
      if (clone.x < 0) {
        this.angleMove = cc.misc.radiansToDegrees(-angle);
      } else {
        this.angleMove = cc.misc.radiansToDegrees(angle);
      }
    } else {
      this.angleMove = null;
    }
  }
}
