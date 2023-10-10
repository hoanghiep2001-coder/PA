import AudioManager from "./AudioManager";
import { GameController } from "./GameController";

const { ccclass, property } = cc._decorator;

@ccclass("GamePlay")
export default class GamePlay extends cc.Component {

  @property(AudioManager)
  AudioManager: AudioManager = null;
  @property(GameController)
  GameController: GameController = null;


  // Node
  @property(cc.Node)
  Bg_Vertical: cc.Node = null;
  @property(cc.Node)
  Bg_Horizontal: cc.Node = null;

  @property(cc.Node)
  HideMask: cc.Node = null;
  @property(cc.Node)
  Point_C: cc.Node = null;
  @property(cc.Node)
  bag: cc.Node = null;
  @property(cc.Node)
  hand_HiddenPoint: cc.Node = null;
  @property(cc.Node)
  Point_A: cc.Node = null;
  @property(cc.Node)
  Point_B: cc.Node = null;
  @property(cc.Graphics)
  Graphics: cc.Graphics = null;
  @property(cc.Graphics)
  Graphics_2: cc.Graphics = null;

  @property(cc.Node)
  Point_Girl: cc.Node = null;
  @property(cc.Node)
  Girl_Default: cc.Node = null;
  @property(cc.Node)
  Girl_Win: cc.Node = null;

  @property(cc.Node)
  Fence_Top: cc.Node = null;
  @property(cc.Node)
  Fence_Left: cc.Node = null;
  @property(cc.Node)
  Fence_Bottom: cc.Node = null;
  @property(cc.Node)
  FenceFoot: cc.Node = null;

  @property(cc.Node)
  BtnContainer: cc.Node = null;
  @property(cc.Node)
  TryAgainBtn: cc.Node = null;
  @property(cc.Node)
  NextBtn: cc.Node = null;
  @property(cc.Node)
  Text_Drag: cc.Node = null;
  @property(cc.Node)
  Text_TestIQ: cc.Node = null;
  @property(cc.Node)
  Hand_CTA: cc.Node = null;
  @property(cc.Node)
  Hint_OpenGame: cc.Node = null;

  // array


  // state
  initPoint_A_Pos: cc.Vec2 = null;
  currentPoint_C_Pos: cc.Vec2 = null;
  currentPos: cc.Vec2 = null;
  BreakPoint: cc.Vec2 = null;

  isPlayBgSound: boolean = false;
  isCollideBreakPoint: boolean = false;
  isTurnBack: boolean = false;
  erasing: boolean = false;
  isCollidePointOnly: boolean = false;
  isTurnBack1: boolean = false;
  isTurnBack2: boolean = false;

  GraphicsBoudingBox: cc.Rect = null;

  FlagLeft: number = null;
  FlagHorizontal: number = null;


  protected onLoad(): void {
    cc.director.getPhysicsManager().enabled = true;
    let collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true;

    this.TryAgainBtn.active = false;
    this.NextBtn.active = false;
    this.Hand_CTA.active = false;

    this.Girl_Win.active = false;
  }


  protected start(): void {
    const posX = this.Point_A.x;
    const posY = this.Point_A.y;
    this.initPoint_A_Pos = new cc.Vec2(posX, posY);
    this.BreakPoint = new cc.Vec2(this.FenceFoot.x, this.FenceFoot.y);

    this.HandleGamePlay();
    this.RegisterEvent();

    // ironsource
    // this.hideMask.on(cc.Node.EventType.TOUCH_START, this.handleActiveSoundIronSource, this);
  }


  private HandleGamePlay(): void {
    this.Hint_OpenGame.getComponent(cc.Animation).play("Hint_OpenSceneAnim");
  }


  private RegisterEvent(): void {
    this.Point_C.on(cc.Node.EventType.TOUCH_START, this.onHideMaskTouchStart, this);
    this.Point_C.on(cc.Node.EventType.TOUCH_MOVE, this.onHideMaskTouchMove, this)
    this.Point_C.on(cc.Node.EventType.TOUCH_END, this.onHideMaskTouchEnd, this);
    this.Point_C.on(cc.Node.EventType.TOUCH_CANCEL, this.onHideMaskTouchEnd, this);

    this.TryAgainBtn.on(cc.Node.EventType.TOUCH_START, this.GameController.installHandle, this);
    this.NextBtn.on(cc.Node.EventType.TOUCH_START, this.GameController.installHandle, this);
  }


  private onHideMaskTouchStart(e: cc.Touch): void {
    this.currentPos = e.getLocation();
    this.Point_B.active = false;
    this.Hint_OpenGame.active = false;
    this.Text_Drag.active = false;
  }


  private handleActiveSoundIronSource(): void {
    if (this.isPlayBgSound) return;

    this.isPlayBgSound = true;
    cc.audioEngine.play(this.AudioManager.bgSound, true, 1);
  }


  private onHideMaskTouchMove(e: cc.Touch): void {
    this.Point_C.angle = this.handleRotateHand();
    if (!this.isCollideBreakPoint) {
      this.handleSetPosPointC(e.getLocation());
      this.handleDrawLine(this.Graphics, this.initPoint_A_Pos, this.currentPoint_C_Pos);
    } else {
      this.handleSetPosPointC_2(e.getLocation());
      this.handleDrawLine(this.Graphics_2, this.BreakPoint, this.currentPoint_C_Pos);
    }
    this.currentPos = e.getLocation();
  }


  private handleSetPosPointC(touchPos: cc.Vec2): void {

    // check collide top
    if (this.Point_C.getBoundingBox().intersects(this.Fence_Top.getBoundingBox())
    ) {
      this.handleCheckCollideTop(touchPos);
      return;
    }

    // check collide left
    else if (this.Point_C.getBoundingBox().intersects(this.Fence_Left.getBoundingBox())) {

      this.hanldeCheckCollideLeft(touchPos);
      return;
    }

    // check collide girl
    else if (this.Point_C.getBoundingBox().intersects(this.Point_Girl.getBoundingBox())) {

      this.hanldeCheckCollideGirl(touchPos);
      return;
    }

    // check if hand longer the break point
    else if (this.Point_C.y < this.BreakPoint.y && this.Point_C.x > this.BreakPoint.x) {
      this.Graphics.clear();
      this.handleDrawLine(this.Graphics, this.initPoint_A_Pos, this.BreakPoint);
      this.isCollideBreakPoint = true;
      return;
    }

    // move PointC - Hand to the direction
    else {
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private handleSetPosPointC_2(touchPos: cc.Vec2): void {
    // check collide bot
    if (this.Point_C.getBoundingBox().intersects(this.Fence_Bottom.getBoundingBox())) {
      this.hanldeCheckCollideBot(touchPos);
      return;
    }

    // check collide girl
    else if (this.Point_C.getBoundingBox().intersects(this.Point_Girl.getBoundingBox())) {

      this.hanldeCheckCollideGirl(touchPos);
      return;
    }

    else if (this.Point_C.x < this.BreakPoint.x) {
      this.isCollideBreakPoint = false;
      this.isTurnBack = true;
      this.isCollidePointOnly = true;
      return;
    }

    else {
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private handleCheckCollideTop(touchPos: cc.Vec2): void {
    if (!this.FlagHorizontal) this.FlagHorizontal = touchPos.y;
    this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;


    if (
      touchPos.y > this.FlagHorizontal
    ) {
      this.FlagHorizontal = null;
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private hanldeCheckCollideLeft(touchPos: cc.Vec2): void {
    if (!this.FlagLeft) this.FlagLeft = touchPos.x;
    this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;


    if (
      touchPos.x < this.FlagLeft
    ) {
      this.FlagLeft = null;
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private hanldeCheckCollideBot(touchPos: cc.Vec2): void {
    if (!this.FlagHorizontal) {
      this.FlagHorizontal = touchPos.y;
    }
    this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;

    if (
      touchPos.y < this.FlagHorizontal
    ) {
      this.FlagHorizontal = null;
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private hanldeCheckCollideGirl(touchPos: cc.Vec2): void {
    this.lose();
  }


  private handleRotateHand(): number {
    let directionVector: cc.Vec2;
    this.isCollideBreakPoint
      ? directionVector = this.currentPoint_C_Pos.sub(this.BreakPoint)
      : directionVector = this.currentPoint_C_Pos.sub(this.initPoint_A_Pos);

    const rotationRadians = Math.atan2(directionVector.y, directionVector.x);
    const rotationDegrees = cc.misc.radiansToDegrees(rotationRadians);
    return rotationDegrees + 30;
  }


  private onHideMaskTouchEnd(): void {
    if (this.Point_C.getBoundingBox().intersects(this.bag.getBoundingBox())) {
      this.win();
    }
  }


  private lose(): void {
    this.Point_C.off(cc.Node.EventType.TOUCH_MOVE);
    this.Point_C.off(cc.Node.EventType.TOUCH_START);

    this.Graphics.fillColor = cc.Color.RED;
    this.Graphics.strokeColor = cc.Color.RED;
    this.Graphics_2.fillColor = cc.Color.RED;
    this.Graphics_2.strokeColor = cc.Color.RED;

    this.handleShowInstallBtn(false);
  }


  private win(): void {
    this.Point_C.off(cc.Node.EventType.TOUCH_MOVE);
    this.Point_C.off(cc.Node.EventType.TOUCH_START);

    let newPos = new cc.Vec3(this.BreakPoint.x, this.BreakPoint.y, 0);
    this.isTurnBack1 = true;

    cc.tween(this.Point_C)
      .to(0.2, { position: newPos })
      .call(() => {
        this.isTurnBack1 = false;
        this.Graphics_2.node.active = false;
        this.handlePlayTween2();
      })
      .start();
  }


  private handlePlayTween2(): void {
    let newPos = new cc.Vec3(this.initPoint_A_Pos.x, this.initPoint_A_Pos.y, 0);
    this.Point_C.angle = -60;
    this.isTurnBack2 = true;
    cc.tween(this.Point_C)
      .to(0.3, { position: newPos })
      .call(() => {
        this.Graphics.node.active = false;
        this.handleShowInstallBtn(true);
      })
      .start();
  }


  private handleShowInstallBtn(result: boolean): void {
    this.Hand_CTA.active = true;
    this.BtnContainer.getComponent(cc.Animation).play("Button_ScaleAnim");
    result ? this.NextBtn.active = true : this.TryAgainBtn.active = true;

    // mtg & applovin
    this.HideMask.on(cc.Node.EventType.TOUCH_START, this.GameController.installHandle, this);
  }


  private handleDrawLine(graphics: cc.Graphics, startPos: cc.Vec2, endPos: cc.Vec2) {
    if (!this.isCollideBreakPoint) {
      this.Graphics.clear();
      this.Graphics_2.clear();
    } else {
      this.drawLine1();
      this.Graphics_2.clear();
    }

    graphics.lineWidth = 5;
    graphics.moveTo(startPos.x, startPos.y);
    graphics.lineTo(endPos.x, endPos.y);
    graphics.stroke();
  }


  private drawLine1(): void {
    this.Graphics.clear();

    this.Graphics.lineWidth = 5;
    this.Graphics.moveTo(this.initPoint_A_Pos.x, this.initPoint_A_Pos.y);
    this.Graphics.lineTo(this.BreakPoint.x, this.BreakPoint.y);
    this.Graphics.stroke();

  }


  protected update(dt: number): void {
    const xC = this.Point_C.x;
    const yC = this.Point_C.y;
    this.currentPoint_C_Pos = new cc.Vec2(xC, yC);

    if (this.isTurnBack1) {
      this.bag.x = this.Point_C.x;
      this.bag.y = this.Point_C.y;
      this.handleDrawLine(this.Graphics_2, this.BreakPoint, this.currentPoint_C_Pos)
    }

    if (this.isTurnBack2) {
      this.isCollideBreakPoint = false;
      this.bag.x = this.Point_C.x;
      this.bag.y = this.Point_C.y;
      this.handleDrawLine(this.Graphics, this.initPoint_A_Pos, this.currentPoint_C_Pos)
    }
  }

}
