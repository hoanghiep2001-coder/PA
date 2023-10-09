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

  // array


  // state
  initPoint_A_Pos: cc.Vec2 = null;
  currentPoint_C_Pos: cc.Vec2 = null;
  currentPos: cc.Vec2 = null;
  BreakPoint: cc.Vec2 = null;

  isPlayBgSound: boolean = false;
  isCollideBreakPoint: boolean = false;
  isTurnBack: boolean = false;

  GraphicsBoudingBox: cc.Rect = null;

  FlagLeft: number = null;
  FlagHorizontal: number = null;


  protected onLoad(): void {
    cc.director.getPhysicsManager().enabled = true;
    let collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true;

    this.TryAgainBtn.active = false;
    this.NextBtn.active = false;
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
  }


  private handleActiveSoundIronSource(): void {
    if (this.isPlayBgSound) return;

    this.isPlayBgSound = true;
    cc.audioEngine.play(this.AudioManager.bgSound, true, 1);
  }


  private onHideMaskTouchMove(e: cc.Touch): void {
    this.handleRotateHand();
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
    }

    // check collide left
    else if (this.Point_C.getBoundingBox().intersects(this.Fence_Left.getBoundingBox())) {
      this.hanldeCheckCollideLeft(touchPos)
    }

    // check collide point to break
    else if (this.Point_C.getBoundingBox().intersects(this.FenceFoot.getBoundingBox())) {
      if(this.isTurnBack) {
        this.isTurnBack = false;
        this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
        this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
        return;
      }

      this.Graphics.clear();
      this.handleDrawLine(this.Graphics, this.initPoint_A_Pos, this.BreakPoint);
      this.isCollideBreakPoint = true;
      
    }

    // check if hand longer the break point
    else if (this.Point_C.y < this.BreakPoint.y && this.Point_C.x > this.BreakPoint.x) {
      this.Graphics.clear();
      this.handleDrawLine(this.Graphics, this.initPoint_A_Pos, this.BreakPoint);
      this.isCollideBreakPoint = true;
    }

    // move PointC - Hand to the direction
    else {
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private handleSetPosPointC_2(touchPos: cc.Vec2): void {
    // check collide bot
    if (this.Point_C.getBoundingBox().intersects(this.Fence_Bottom.getBoundingBox())
    ) {
      this.hanldeCheckCollideBot(touchPos);
    } else if(this.Point_C.x < this.BreakPoint.x) {
      this.isCollideBreakPoint = false;
      this.isTurnBack = true;
    } else {
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
    if (!this.FlagHorizontal) this.FlagHorizontal = touchPos.x;
    this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;


    if (
      touchPos.x < this.FlagHorizontal
    ) {
      this.FlagHorizontal = null;
      this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
      this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;
    }
  }


  private handleRotateHand(): void {
    const xC = this.Point_C.x;
    const yC = this.Point_C.y;
    this.currentPoint_C_Pos = new cc.Vec2(xC, yC);

    let directionVector: cc.Vec2;
    this.isCollideBreakPoint 
    ? directionVector = this.currentPoint_C_Pos.sub(this.BreakPoint) 
    : directionVector = this.currentPoint_C_Pos.sub(this.initPoint_A_Pos);

    const rotationRadians = Math.atan2(directionVector.y, directionVector.x);
    const rotationDegrees = cc.misc.radiansToDegrees(rotationRadians);

    this.Point_C.angle = rotationDegrees + 30;
  }


  private onHideMaskTouchEnd(): void {

  }


  private handleShowInstallBtn(result: boolean): void {
    result ? this.NextBtn.active = true : this.TryAgainBtn.active = true;
  }


  private handleDrawLine(graphics: cc.Graphics, startPos: cc.Vec2, endPos: cc.Vec2) {
    if(!this.isCollideBreakPoint) {
      this.Graphics.clear();
      this.Graphics_2.clear();
    } else {
      this.Graphics_2.clear();
    }

    graphics.lineWidth = 5;
    graphics.moveTo(startPos.x, startPos.y);
    graphics.lineTo(endPos.x, endPos.y);
    graphics.stroke();

  }


  protected update(dt: number): void {

  }

}
