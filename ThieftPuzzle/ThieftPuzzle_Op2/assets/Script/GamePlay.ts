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

  @property(cc.Node)
  BtnContainer: cc.Node = null;
  @property(cc.Node)
  TryAgainBtn: cc.Node = null;
  @property(cc.Node)
  NextBtn: cc.Node = null;

  // array


  // state
  initPoint_A_Pos: cc.Vec2 = null;
  currentPos: cc.Vec2 = null;
  isPlayBgSound: Boolean = false;
  

  protected onLoad(): void {
    this.TryAgainBtn.active = false;
    this.NextBtn.active = false;
  }


  protected start(): void {
    const posX = this.Point_A.x;
    const posY = this.Point_A.y;
    this.initPoint_A_Pos = new cc.Vec2(posX, posY);

    this.HandleGamePlay();
    this.RegisterEvent();
    

    // ironsource
    // this.hideMask.on(cc.Node.EventType.TOUCH_START, this.handleActiveSoundIronSource, this);
  }


  private HandleGamePlay(): void {

  }


  private RegisterEvent(): void {
    this.HideMask.on(cc.Node.EventType.TOUCH_START, this.onHideMaskTouchStart, this);
    this.HideMask.on(cc.Node.EventType.TOUCH_MOVE, this.onHideMaskTouchMove, this)
    this.HideMask.on(cc.Node.EventType.TOUCH_END, this.onHideMaskTouchEnd, this);
    this.HideMask.on(cc.Node.EventType.TOUCH_CANCEL, this.onHideMaskTouchEnd, this);

    this.TryAgainBtn.on(cc.Node.EventType.TOUCH_START, this.GameController.installHandle, this);
    this.NextBtn.on(cc.Node.EventType.TOUCH_START, this.GameController.installHandle, this);
  }


  private onHideMaskTouchStart(e: cc.Touch): void {
    this.currentPos = e.getLocation();
  }


  private handleActiveSoundIronSource(): void {
    if(this.isPlayBgSound) return;
    
    this.isPlayBgSound = true;
    cc.audioEngine.play(this.AudioManager.bgSound, true, 1);
  }


  private onHideMaskTouchMove(e: cc.Touch): void {
    this.currentPos = e.getLocation();

    // update point C pos
    this.Point_C.x = this.currentPos.x - cc.winSize.width / 2;
    this.Point_C.y = this.currentPos.y - cc.winSize.height / 2;

    // update point B pos (still connect with Point A & C)
    const offset = this.currentPos.sub(this.initPoint_A_Pos);
    this.Point_B.x = this.initPoint_A_Pos.add(offset).x - cc.winSize.width / 2;
    this.Point_B.y = this.initPoint_A_Pos.add(offset).y - cc.winSize.height / 2;
  }


  private onHideMaskTouchEnd(): void {

  }


  private handleShowInstallBtn(result: boolean): void {
    result ? this.NextBtn.active = true : this.TryAgainBtn.active = true;
  }


  protected update(dt: number): void {
  
  }

}
