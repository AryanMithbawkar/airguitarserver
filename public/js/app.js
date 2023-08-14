const modelParams = {
    flipHorizontal: true,   
    imageScaleFactor: 0.5,  
    maxNumBoxes: 2,        
    iouThreshold: 0.3,      
    scoreThreshold: 0.85,    
}

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const container = document.querySelector('.container');
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const firstFret = document.querySelector('.first-fret');
const secondFret = document.querySelector('.second-fret');
const thirdFret = document.querySelector('.third-fret');
const fourthFret = document.querySelector('.fourth-fret');
const fifthFret = document.querySelector('.fifth-fret');
const sixthFret = document.querySelector('.sixth-fret');
const sevnthFret = document.querySelector('.sevnth-fret');
let model;
let playNow = true;


setInterval(() => {
    playNow = true
}, 750)

handTrack.load(modelParams)
    .then(response => model = response)

handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia({ video: {} }, stream => {
                video.srcObject = stream;
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

               
                let firstLeft = 0;
                let firstRight = firstFret.clientWidth;

                let secondLeft = firstRight;
                let secondRight = firstRight + secondFret.clientWidth;

                let thirdLeft = secondRight;
                let thirdRight = secondRight + thirdFret.clientWidth;

                let fourthLeft = thirdRight;
                let fourthRight = thirdRight + fourthFret.clientWidth;

                let fifthLeft = fourthRight;
                let fifthRight = fourthRight + fifthFret.clientWidth;

                let sixthLeft = fifthRight;
                let sixthRight = fifthRight + sixthFret.clientWidth;

                let sevnthLeft = sixthRight;
                let sevnthRight = sixthRight + sevnthFret.clientWidth;
                
                let play = () => {
                    if ((firstLeft < pickX && pickX < firstRight) && (600 < pickY && pickY < 900)) {
                        strum('e')
                    } else if ((secondLeft < pickX && pickX < secondRight) && (600 < pickY && pickY < 900)) {
                        strum('c')
                    } else if ((thirdLeft < pickX && pickX < thirdRight) && (600 < pickY && pickY < 900)) {
                        strum('b')
                    } else if ((fourthLeft < pickX && pickX < fourthRight) && (600 < pickY && pickY < 900)) {
                        strum('a')
                    }else if ((fifthLeft < pickX && pickX < fifthRight) && (600 < pickY && pickY < 900)) {
                        strum('e7')
                    }else if ((sixthLeft < pickX && pickX < sixthRight) && (600 < pickY && pickY < 900)) {
                        strum('d')
                    }else if ((sevnthLeft < pickX && pickX < sevnthRight) && (600 < pickY && pickY < 900)) {
                        strum('gm')
                    }
                }

                let strum = (chord) => {
                    audio.src = `js/${chord}-chord.mp3`;
                    audio.play(); 
                    playNow = false
                }

                if (playNow) {
                    play();
                }
            }
        })
}

