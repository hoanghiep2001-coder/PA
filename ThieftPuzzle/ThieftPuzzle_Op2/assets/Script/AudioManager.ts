const { ccclass, property } = cc._decorator;
@ccclass
export default class AudioManger extends cc.Component {
    @property(cc.AudioClip)
    bgSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    winSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    loseSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    drawSound: cc.AudioClip = null;
}
