let actx = new AudioContext()

let srcNode: AudioBufferSourceNode = actx.createBufferSource()

let convolerNode: ConvolverNode = actx.createConvolver()
let wetGain: GainNode = actx.createGain()
let dryGain: GainNode = actx.createGain()
wetGain.gain.value = 0.3
dryGain.gain.value = 0
dryGain.connect(convolerNode)
convolerNode.connect(wetGain)
wetGain.connect(actx.destination)
dryGain.connect(actx.destination)
srcNode.loop = true;   
let started = false

fetch("/spray.mp3", { mode: "cors" }).then(function (resp) { return resp.arrayBuffer() }).then(buffer => {
    actx.decodeAudioData(buffer, audioData => {
        srcNode.buffer = audioData;
    });
});

fetch("/reverb.mp3", { mode: "cors" }).then(function (resp) { return resp.arrayBuffer() }).then(buffer => {
    actx.decodeAudioData(buffer, audioData => {
        convolerNode.buffer = audioData;
    });
});

export function start() {
    if (!started) srcNode.start()
    started = true
    dryGain.gain.linearRampToValueAtTime(1,actx.currentTime+0.045)
    srcNode.connect(dryGain)
}

export function stop() {
    dryGain.gain.value = 0
    srcNode.disconnect(dryGain)
}