require("@ar-js-org/ar.js")
const three = require("@ar-js-org/ar.js/node_modules/three")
import * as sprayAudio from "./sfx";

let textureMainMaterial: { map: { needsUpdate: boolean; }; }
let textureMainObj: THREE.Object3D

function linePlaneIntersect(p0: THREE.Vector3, p1: THREE.Vector3, p_co: THREE.Vector3, p_no: THREE.Vector3): THREE.Vector3 | false {
    let u = p1.clone().sub(p0)
    let dot = p_no.dot(u)

    if (Math.abs(dot) < 1e-6) return false

    let w = p0.clone().sub(p_co)
    let fac = -p_no.dot(w) / dot
    u.multiplyScalar(fac)
    return p0.clone().add(u)
}

AFRAME.registerComponent('canvas-updater', {
    dependencies: ['geometry', 'material'],

    init: function() {
        let obj = (this.el.getObject3D('mesh') as any)
        textureMainMaterial = obj.material;
    }
});

AFRAME.registerComponent('get-position', {
    init: function() {
        textureMainObj = (this.el.object3D)
    }
});

await new Promise(res => {
    setInterval(() => {
        if (document.readyState) res(0)
    }, 300)
})

let bufferCanvas = document.getElementById('tag-ar-texture-main') as HTMLCanvasElement
let bufferCtx = bufferCanvas.getContext("2d")
if (!bufferCtx) throw new Error("Failed to create rendering context!")

const textureMainRaw = new Uint8ClampedArray(await (await fetch("texture-main")).arrayBuffer())

let textureMain = new Uint8ClampedArray(textureMainRaw.length*2)

for (let i=0; i<textureMain.length; i+=4) {
    let hiByteRep = textureMainRaw[i/2].toString(2).padStart(8, '0')
    let loByteRep = textureMainRaw[i/2+1].toString(2).padStart(8, '0')

    textureMain[i+0] = (parseInt(hiByteRep.slice(0, 2), 2) + parseInt(loByteRep.slice(0, 2), 2)) * 42.5
    textureMain[i+1] = (parseInt(hiByteRep.slice(2, 4), 2) + parseInt(loByteRep.slice(2, 4), 2)) * 42.5
    textureMain[i+2] = (parseInt(hiByteRep.slice(4, 6), 2) + parseInt(loByteRep.slice(4, 6), 2)) * 42.5
    textureMain[i+3] = (parseInt(hiByteRep.slice(6   ), 2) + parseInt(loByteRep.slice(6   ), 2)) * 42.5     
}

const textureMainImageData = new ImageData(textureMain, 1280, 720)
bufferCtx.putImageData(textureMainImageData, 0, 0)

let interval: NodeJS.Timeout | undefined

document.addEventListener('contextmenu', e => e.preventDefault(), {passive: false})

document.addEventListener('touchend', e => {
    e.preventDefault()
    if (!interval) return
    clearInterval(interval)
    interval = undefined
    sprayAudio.stop()
}, {passive: false})

const lineZero = new three.Vector3(0,0,0)
const lineOne = new three.Vector3(0,0,1) 
const updateRate = 20
document.addEventListener('touchstart', e => {
    e.preventDefault()
    if (interval) return
    sprayAudio.start()
    interval = setInterval(async () => {
        if (!bufferCtx) throw new Error("Failed to create rendering context!")

        if (!textureMainObj.visible) return

        let position: THREE.Vector3 = new three.Vector3()
        let normal: THREE.Vector3 = new three.Vector3()
        
        textureMainObj.getWorldPosition(position)
        textureMainObj.getWorldDirection(normal)
        normal = normal.applyAxisAngle(new three.Vector3(1,0,0), -Math.PI/2)

        let planePoint = linePlaneIntersect(lineZero, lineOne, position, normal)
        if (!planePoint) return

        let localPlanePoint = textureMainObj.worldToLocal(planePoint)

        bufferCtx.beginPath();
        bufferCtx.arc(localPlanePoint.x*(1280/textureMainObj.children[0].scale.x)+1280/2, localPlanePoint.z*(720/textureMainObj.children[0].scale.y)+720/2, 20, 0, 2 * Math.PI);
        bufferCtx.fill();
        textureMainMaterial.map.needsUpdate = true
    }, updateRate)
}, {passive: false})


export {}