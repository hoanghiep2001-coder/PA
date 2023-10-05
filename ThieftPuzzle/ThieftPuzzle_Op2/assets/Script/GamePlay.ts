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
  hand_Point: cc.Node = null;
  @property(cc.Node)
  Line: cc.Node = null;


  // array


  // state
  currentPos: cc.Vec2 = null;
  isPlayBgSound: Boolean = false;


  protected onLoad(): void {

  }


  protected start(): void {
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

    this.hand_Point.x = this.currentPos.x - cc.winSize.width / 2;
    this.hand_Point.y = this.currentPos.y - cc.winSize.height / 2;
  }


  private onHideMaskTouchEnd(): void {

  }



  private handleShowInstallPoint(): void {

  }


  protected update(dt: number): void {

  }

}
