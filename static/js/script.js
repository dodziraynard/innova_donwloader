faceapi.loadTinyFaceDetectorModel('/static/models')
const video = document.getElementById("video")
let FPS = 1

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/static/models")
]).then(startVideo)


function startVideo() {
    navigator.getUserMedia({
        video: {}
    }, stream => video.srcObject = stream,
        err => console.error(err))
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    document.querySelector(".output").append(canvas)

    const textBox = { x: 50, y: 50, width: 0, height: 0 }

    async function doDetection() {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        const drawOptions = {
            label: 'Faces: ' + detections.length,
            lineWidth: 2
        }

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        const drawBox = new faceapi.draw.DrawBox(textBox, drawOptions)
        drawBox.draw(canvas)
        setTimeout(doDetection, 1000 / FPS)
    }
    setTimeout(doDetection, 1000 / FPS)
})

function updateFPS(element) {
    FPS = element.value
    document.querySelector("#fps-label").innerText = "FPS: " + FPS
    console.log(FPS)
}