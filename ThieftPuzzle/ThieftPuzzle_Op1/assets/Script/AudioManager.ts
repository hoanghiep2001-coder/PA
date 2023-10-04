const { ccclass, property } = cc._decorator;
@ccclass
export default class AudioManger extends cc.Component {
    @property(cc.AudioClip)
    bgSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    moveItemSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    cleanSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    waterDropSound: cc.AudioClip = null;
    @property(cc.AudioClip)
    scarySound: cc.AudioClip = null;
    @property(cc.AudioClip)
    TearSound: cc.AudioClip = null;
}
