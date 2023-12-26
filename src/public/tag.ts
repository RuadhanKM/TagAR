async function load() {
    const textureMainRaw = new Uint8ClampedArray(await (await fetch("texture-main")).arrayBuffer())
    let textureMainDisplayNode: HTMLImageElement | null = document.getElementById('tag-ar-texture-main') as HTMLImageElement
    if (!textureMainDisplayNode) return console.error("Could not find texture display node!")

    let textureMain = new Uint8ClampedArray(textureMainRaw.length*2)

    for (let i=0; i<textureMain.length; i+=4) {
        let hiByteRep = textureMainRaw[i/2].toString(2).padStart(8, '0')
        let loByteRep = textureMainRaw[i/2+1].toString(2).padStart(8, '0')

        textureMain[i+0] = (parseInt(hiByteRep.slice(0, 2), 2) + parseInt(loByteRep.slice(0, 2), 2)) * 42.5
        textureMain[i+1] = (parseInt(hiByteRep.slice(2, 4), 2) + parseInt(loByteRep.slice(2, 4), 2)) * 42.5
        textureMain[i+2] = (parseInt(hiByteRep.slice(4, 6), 2) + parseInt(loByteRep.slice(4, 6), 2)) * 42.5
        textureMain[i+3] = (parseInt(hiByteRep.slice(6   ), 2) + parseInt(loByteRep.slice(6   ), 2)) * 42.5     
    }

    console.log(textureMain)

    const textureMainImageData = new ImageData(textureMain, 1024)
    let textureMainBlob

    {
        let bufferCanvas = new OffscreenCanvas(1024, 1024)
        let bufferCtx = bufferCanvas.getContext("2d")
        if (!bufferCtx) return console.error("Failed to create buffer canvas")
        bufferCtx.putImageData(textureMainImageData, 0, 0)
        textureMainBlob = await bufferCanvas.convertToBlob()
    }

    
    textureMainDisplayNode.src = URL.createObjectURL(textureMainBlob);
}

load()