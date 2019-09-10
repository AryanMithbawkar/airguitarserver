const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.2,  // reduce input image size for gains in speed.
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.2,    // confidence threshold for predictions.
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
const firstFret = document.querySelector('.first-fret');
const secondFret = document.querySelector('.second-fret');
const thirdFret = document.querySelector('.third-fret');
const fourthFret = document.querySelector('.fourth-fret');
let model;


handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia({ video: {} }, stream => {
                video.srcObject = stream;
                // Run detection
                setInterval(runDetection, 10);
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
                //OG 640 and 480
                //540 and 360
                //1903/540 = 3.52
                //941/360 = 2.61
                var pick = document.createElement('div');
                var audio = document.createElement('audio');
                pick.setAttribute('class', 'pick');
                pick.style.left = hand1[0] * 2.97 + 'px';
                pick.style.top = hand1[1] * 2.25 + 'px';
                let calibrateY = hand1[1] * 2.25 + 100 + 'px';
                pick.style.top = calibrateY;
                container.appendChild(pick);

                setInterval(() => pick.remove(), 10)

                let pickX = pick.style.left.replace('px', '');
                let pickY = pick.style.top.replace('px', '');

                /* frets */
                let firstLeft = 0;
                let firstRight = firstFret.clientWidth;

                let secondLeft = firstRight;
                let secondRight = firstRight + secondFret.clientWidth;

                let thirdLeft = secondRight;
                let thirdRight = secondRight + thirdFret.clientWidth;

                let fourthLeft = thirdRight;
                let fourthRight = thirdRight + fourthFret.clientWidth;

                if ((firstLeft < pickX && pickX < firstRight) && (600 < pickY && pickY < 900)) {
                    audio.src = 'e-chord.mp3';
                } else if ((secondLeft < pickX && pickX < secondRight) && (600 < pickY && pickY < 900)) {
                    audio.src = 'c-chord.mp3';
                } else if ((thirdLeft < pickX && pickX < thirdRight) && (600 < pickY && pickY < 900)) {
                    audio.src = 'b-chord.mp3';
                } else if ((fourthLeft < pickX && pickX < fourthRight) && (600 < pickY && pickY < 900)) {
                    audio.src = 'a-chord.mp3';
                }

                audio.play();                
            }
        })
    // requestAnimationFrame(runDetection);
}

handTrack.load(modelParams)
    .then(lmodel => model = lmodel)
