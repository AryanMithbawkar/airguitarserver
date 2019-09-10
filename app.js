const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.2,  // reduce input image size for gains in speed.
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.7,    // confidence threshold for predictions.
}

console.log('navigator', navigator);

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const container = document.querySelector('.container');
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const stopDetection = document.querySelector('.stop-detection');
let model;


handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia({ video: {} }, stream => {
                video.srcObject = stream;
                // Run detection
                setInterval(runDetection, 150);
            },
                err => console.log(err)
            )
        }
    })

const runDetection = () => {
    model.detect(video)
        .then(predictions => {
            if (predictions.length !== 0) {
                
                let hand1 = predictions[0].bbox;
                let x = hand1[0];
                let y = hand1[1];
                let w = hand1[2];
                let h = hand1[3];
                
                // Calibrate by 
                // console.log('x', hand1[0], 'y', hand1[1], 'w', hand1[2], 'h', hand1[3]);
                // console.log('fuuuuckX', hand1[0] * 3.52);
                // console.log('fuuuuckY', hand1[1] * 2.61);
//OG 640 and 480
//540 and 360
//1903/540 = 3.52
//941/360 = 2.61
                var pick = document.createElement('div');
                pick.setAttribute('class', 'pick');
                pick.style.left = hand1[0] * 2.97 + 'px';
                pick.style.top = hand1[1] * 2.25 + 'px';
                let calibrateY = hand1[1] * 2.25 + 90 + 'px';
                pick.style.top = calibrateY;
                container.appendChild(pick);
                
// x30 y295
                if ((0 < x && x < 55) && (200 < y && y < 400)) {
                    console.log('a-chord');
                    audio.src = 'a-chord.mp3'
                } else if ((x > 100 && x < 215) && (200 < y && y < 400)) {
                    console.log('b-chord');
                    audio.src = 'b-chord.mp3'
                } else if ((230 < x && x < 355) && (y > 200 && y < 400)) {
                    console.log('c-chord');
                    audio.src = 'c-chord.mp3'
                } else if (x > 370 && x < 500 && y > 200 && y < 400) {
                    console.log('e-chord');
                    audio.src = 'e-chord.mp3'
                }

                audio.play();
            }
        })
    // requestAnimationFrame(runDetection);
}

handTrack.load(modelParams)
    .then(lmodel => model = lmodel)
