//import AFRAME from "aframe"
//import { type Mesh, Material } from "three"

//console.log(AFRAME.AScene.renderStarted)

let bufferCanvas = document.getElementById('tag-ar-texture-main') as HTMLCanvasElement
let bufferCtx = bufferCanvas.getContext("2d")

// AFRAME.registerComponent('canvas-updater', {
//     dependencies: ['geometry', 'material'],

//     tick: function () {
//         var el = this.el;
//         var material = (el.getObject3D('mesh') as Mesh).material;
//         if (!(material instanceof Material)) return

//         material.needsUpdate = true;
//     }
// });

async function load() {
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

    const textureMainImageData = new ImageData(textureMain, 1024)
    bufferCtx.putImageData(textureMainImageData, 0, 0)
}

let interval: NodeJS.Timeout

document.addEventListener('touchend', e => {
    console.log("end")
    clearInterval(interval)
})

document.addEventListener('touchstart', e => {
    interval = setInterval(async () => {
        console.log("touch")
        if (!bufferCtx) throw new Error("Failed to create rendering context!")
        bufferCtx.fillRect(0, 0, 100, 100)
    }, 50)
})

load()