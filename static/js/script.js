faceapi.loadTinyFaceDetectorModel('/static/models')
const video = document.getElementById("video")
const output = document.querySelector(".output")
const loading = document.querySelector(".loading")
const errTextElm = document.querySelector("#error-text")
const errDiv = document.querySelector("#error-div")

video.width = output.getBoundingClientRect().width
video.height = output.getBoundingClientRect().height

let FPS = 1

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/static/models")
]).then(startVideo)


function startVideo() {
    navigator.getUserMedia(
        { video: {} }, stream => video.srcObject = stream,
        err => {
            errDiv.style.display = "block";
            errTextElm.innerText = err;
            loading.style.display = "none";
        }
    )
}

video.addEventListener("play", () => {
    loading.style.display = "flex";
    const canvas = faceapi.createCanvasFromMedia(video)
    // video.width = video.videoWidth
    // video.height = video.videoHeight

    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    document.querySelector(".output").append(canvas)

    const textBox = { x: 10, y: 10, width: 0, height: 0 }

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
        loading.style.display = "none";
        setTimeout(doDetection, 1000 / FPS)
    }
    setTimeout(doDetection, 1000 / FPS)
})

function updateFPS(element) {
    FPS = element.value
    document.querySelector("#fps-label").innerText = "FPS: " + FPS
}