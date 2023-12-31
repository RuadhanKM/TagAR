let actx = new AudioContext()

let srcNode: AudioBufferSourceNode = actx.createBufferSource()
let convolerNode: ConvolverNode = actx.createConvolver()
let convolerGain: GainNode = actx.createGain()
convolerGain.gain.value = 0.4
convolerNode.connect(convolerGain)
convolerGain.connect(actx.destination)
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
    srcNode.connect(actx.destination)
    srcNode.connect(convolerNode)
}

export function stop() {
    srcNode.disconnect(actx.destination)
    srcNode.disconnect(convolerNode)
}