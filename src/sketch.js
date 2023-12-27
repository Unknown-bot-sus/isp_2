let audio, speechRec;

let analyzer, features;
let speechString;

function preload() {
  soundFormats("mp3");
  audio = loadSound("../assets/Kalte_Ohren_(_Remix_).mp3");
}

function setup() {
  createCanvas(800, 400);
  background(180);

  speechRec = new p5.SpeechRec("en-US", translateSpeech);
  analyzer = Meyda.createMeydaAnalyzer({
    audioContext: getAudioContext(),
    source: audio,
    bufferSize: 512,
    featureExtractors: ["rms", "spectralCentroid", "chroma"],
    callback: (featuresProps) => {
      features = featuresProps;
    },
  });

  // start the speech recognition
  speechRec.start(false, true);
  speechRec.onError = restart;
  speechRec.onEnd = restart;
}

// sppech recognitino function
function translateSpeech() {
  speechString = speechRec.resultString;
}

function restart() {
  speechRec.start();
}

function getBackgroundColor() {
  if (speechString === undefined) {
    return;
  }
  for (let word of speechString.split(" ")) {
    if (COLORS[word] !== undefined) {
      return COLORS[word];
    }
  }
}

function draw() {
  if (features === undefined) {
    return;
  }
  const backgroundColor = getBackgroundColor();
  if (backgroundColor !== undefined) {
    background(backgroundColor);
  }
  // Analyze the audio
  let rms = features.rms;
  let centroid = features.spectralCentroid;
  let chroma = features.chroma;

  // Map audio features to visual variables
  let rectCount = int(map(rms, 0, 1, 5, 50));
  let rectSize = map(centroid, 0, width / 2, 10, 100);
  let rectOpacity = map(chroma[0], 0, 1, 50, 255);

  // Draw rectangles based on audio features
  for (let i = 0; i < rectCount; i++) {
    fill(random(255), random(255), random(255), rectOpacity);
    noStroke();
    rect(random(width), random(height), rectSize, rectSize);
  }
}

function mousePressed() {
  if (audio.isPlaying()) {
    audio.stop();
    analyzer.stop();
  } else {
    audio.play();
    analyzer.start();
  }
}
