
const { ccclass, property } = cc._decorator;

@ccclass("JoyStick")
export class JoyStick extends cc.Component {
  @property(cc.Node)
  stick: cc.Node = null;

  @property
  public max_r: number = 27;
  public isTouch: boolean = false;

  public angleMove: number | null = null;

  start() {}
  onLoad() {
    this.stick.setPosition(0, 0, 0);
    this.node.on(cc.Node.EventType.TOUCH_START, this.stickMove, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.stickMove, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stickEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.stickEnd, this);
  }

  private stickMove(event: cc.Touch) {
    this.isTouch = true;
    const screenPos = event.getLocation();
    let pos = this.stick.convertToNodeSpaceAR(screenPos);
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
    const localX: number = value.x - 160 - this.node.getPosition().x;
    const localY: number = value.y - 240 - this.node.getPosition().y;
    const result = new cc.Vec3(localX, localY, 0);
    return result;
  }

  update(deltaTime: number) {
    if (this.isTouch) {
      const clone = this.stick.getPosition();
      const angle = cc.Vec3.angle(cc.v3(clone.x, clone.y, 0), cc.v3(0, 100, 0));
      if (clone.x < 0) {
        this.angleMove = -angle;
      } else {
        this.angleMove = angle;
      }
    } else {
      this.angleMove = null;
    }
  }
}
