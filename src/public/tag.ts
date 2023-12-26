async function load() {
    const textureMain = new Uint8ClampedArray((await (await fetch("texture-main")).text()).split(' ').map(x => parseInt(x)))
    let textureMainDisplayNode: HTMLImageElement | null = document.getElementById('tag-ar-texture-main') as HTMLImageElement
    if (!textureMainDisplayNode) return console.error("Could not find texture display node!")

    console.log(textureMain)

    const textureMainImageData = new ImageData(textureMain, 256)
    let textureMainBlob

    {
        let bufferCanvas = new OffscreenCanvas(256, 256)
        let bufferCtx = bufferCanvas.getContext("2d")
        if (!bufferCtx) return console.error("Failed to create buffer canvas")
        bufferCtx.putImageData(textureMainImageData, 0, 0)
        textureMainBlob = await bufferCanvas.convertToBlob()
    }

    textureMainDisplayNode.src = URL.createObjectURL(textureMainBlob);
}

load()