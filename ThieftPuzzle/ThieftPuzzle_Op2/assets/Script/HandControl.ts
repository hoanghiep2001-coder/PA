import GamePlay from "./GamePlay";
import { JoyStick } from "./JoyStick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HandControl extends cc.Component {
  @property(GamePlay)
  GamePlay: GamePlay = null;

  @property(cc.Node)
  Line: cc.Node = null;

  // state
  handDirectionMove: string = "stop";
  rigidbody: cc.RigidBody = null;

  protected start(): void {

  }




  protected update(dt: number): void {

  }

}
