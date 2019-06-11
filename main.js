let audioContext = new (window.AudioContext || window.webkitAudioContext);

let oscList = [];
let currOctave=3;
let noteFreq = createNoteTable();
let bps=1.5// beatperSecond
let recordings=[];
let recordingIndex=0
let recording={notes:[], duration:0, startTime:0}
let currentlyPlaying=[]
let restStart=0
let nowRecording=false;
let loopLength=4 // in beats
let hornTable = audioContext.createPeriodicWave(wave.real, wave.imag);

function noteFromKey(key){
   const keyTable= {
    "a":`${currOctave}C`,
    "w":`${currOctave}C#`,
    "s":`${currOctave}D`,
    "e":`${currOctave}D#`,
    "d":`${currOctave}E`,
    "f":`${currOctave}F`,
    "t":`${currOctave}F#`,
    "g":`${currOctave}G`,
    "y": `${currOctave}G#`,
    "h": `${currOctave}A`,
    "u": `${currOctave}A#`,
    "j": `${currOctave}B`,
    "k": `${currOctave+1}C`,
    "o": `${currOctave+1}C#`,
    "l":`${currOctave+1}D`,
    "p":`${currOctave+1}D#`,
    ";":`${currOctave+1}E`,
    "'":`${currOctave+1}F`
  }
  return keyTable[key]
}

  function keyFromNote(note){
     const keyTable= {
      [`${currOctave}C`]:"a",
      [`${currOctave}C#`]:"w",
      [`${currOctave}D`]:"s",
      [`${currOctave}D#`]:"e",
      [`${currOctave}E`]:"d",
      [`${currOctave}F`]:"f",
      [`${currOctave}F#`]:"t",
      [`${currOctave}G`]:"g",
       [`${currOctave}G#`]:"y",
      [`${currOctave}A`]:"h",
       [`${currOctave}A#`]:"u",
       [`${currOctave}B`]:"j",
       [`${currOctave+1}C`]:"k",
       [`${currOctave+1}C#`]:"o",
      [`${currOctave+1}D`]:"l",
      [`${currOctave+1}D#`]:"p",
      [`${currOctave+1}E`]:";",
      [`${currOctave+1}F`]:"'"
    }
    return (keyTable[note])
}


function noteToFreq(note,noteFreq){
    return noteFreq[note[0]][note.slice(1)]
  }

let masterGainNode = null;
let keyboard = document.querySelector(".keyboard");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let customWaveform = null;
let sineTerms = null;
let cosineTerms = null;
let loopStart=null
function createNoteTable() {

  let noteFreq = {};
  for (let i=2; i<5; i++) {
    noteFreq[i] = {};
  }

    noteFreq[2]["C"] = 65.406391325149658;
    noteFreq[2]["C#"] = 69.295657744218024;
    noteFreq[2]["D"] = 73.416191979351890;
    noteFreq[2]["D#"] = 77.781745930520227;
    noteFreq[2]["E"] = 82.406889228217482;
    noteFreq[2]["F"] = 87.307057858250971;
    noteFreq[2]["F#"] = 92.498605677908599;
    noteFreq[2]["G"] = 97.998858995437323;
    noteFreq[2]["G#"] = 103.826174394986284;
    noteFreq[2]["A"] = 110.000000000000000;
    noteFreq[2]["A#"] = 116.540940379522479;
    noteFreq[2]["B"] = 123.470825314031027;

    noteFreq[3]["C"] = 130.812782650299317;
    noteFreq[3]["C#"] = 138.591315488436048;
    noteFreq[3]["D"] = 146.832383958703780;
    noteFreq[3]["D#"] = 155.563491861040455;
    noteFreq[3]["E"] = 164.813778456434964;
    noteFreq[3]["F"] = 174.614115716501942;
    noteFreq[3]["F#"] = 184.997211355817199;
    noteFreq[3]["G"] = 195.997717990874647;
    noteFreq[3]["G#"] = 207.652348789972569;
    noteFreq[3]["A"] = 220.000000000000000;
    noteFreq[3]["A#"] = 233.081880759044958;
    noteFreq[3]["B"] = 246.941650628062055;

    noteFreq[4]["C"] = 261.625565300598634;
    noteFreq[4]["C#"] = 277.182630976872096;
    noteFreq[4]["D"] = 293.664767917407560;
    noteFreq[4]["D#"] = 311.126983722080910;
    noteFreq[4]["E"] = 329.627556912869929;
    noteFreq[4]["F"] = 349.228231433003884;

  return noteFreq;
}

if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
    };
}


function renderKeyBoard(noteFreq,octave){
  keyboard.innerHTML=""
  let octaveElem = document.createElement("div");
  octaveElem.className = "octave";
  for (var octave in noteFreq) {
   let noteList = noteFreq[octave];
   for (let note in noteList){
      let noteid=octave+note
      let freq=noteList[note]
      let key=(octave==currOctave ? keyFromNote(noteid) : null)
    if (noteid.length == 2) {
      octaveElem.appendChild(createKey(note, octave, freq ,key, false));
    }
    if (noteid.length == 3) {
      octaveElem.appendChild(createKey(note, octave, freq,key,true));
    }
  }

}
  keyboard.appendChild(octaveElem);
}

function setup() {

  volumeControl.addEventListener("change", changeVolume, false);
  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;
  renderKeyBoard(noteFreq)
  // Create the keys; skip any that are sharp or flat; for
  // our purposes we don't need them. Each octave is inserted
  // into a <div> of class "octave".

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
}

setup();
function createKey(note, octave, freq, key=null,black=false) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = "key";
  if(black){keyElement.className = "key black";}

  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;
  keyElement.dataset["noteid"]=octave+note


  labelElement.innerHTML = note + '<sub>' + (key||'') + '</sub>';

  keyElement.appendChild(labelElement);

  keyElement.addEventListener("mousedown", notePressed, false);
  keyElement.addEventListener("mouseup", noteReleased, false);
  keyElement.addEventListener("mouseover", notePressed, false);
  keyElement.addEventListener("mouseleave", noteReleased, false);

  return keyElement;
}
function playTone(freq,note,duration=false,curTime=false) {
  let osc = audioContext.createOscillator();
  let gainNode=audioContext.createGain();
  osc.connect(gainNode);
  gainNode.gain.value=0.5;

  gainNode.connect(masterGainNode);
  let type = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = type;
  }

  osc.frequency.value = freq;
  if(duration){
    osc.start(curTime)
    const endAt=curTime+duration/bps
    osc.stop(endAt+1)
    gainNode.gain.setTargetAtTime(0, endAt, 0.1);
    return endAt
  }
  else{
    osc.start()
    return {osc:osc,gainNode:gainNode, time: audioContext.currentTime-loopStart, note:note}
  };
}



function notePressed(event) {
  if (event.buttons & 1) {
    let dataset = event.target.dataset;

    if (!oscList[dataset["noteid"]]) {
      oscList[dataset["noteid"]] = playTone(dataset["frequency"]);
      dataset["pressed"] = "yes";
    }
  }
}


function keyPlay(event){
      let note=noteFromKey(event.key)
      if(note){
        let freq=noteToFreq(note,noteFreq)
        if (!oscList[note]) {
          if(nowRecording&&currentlyPlaying.length==0){
              recording.notes.push({
              duration: (audioContext.currentTime-restStart)*bps,
              time:restStart-loopStart,
              note: "rest",
            })
          }
          currentlyPlaying.push(note);
          oscList[note] = playTone(freq,note);
          document.querySelector(`[data-noteid="${note}"]`).classList.add("active")
        }
      }
    }


  function keyRelease(event){
    // when a key is released, if no note is playing, a rest begins.
      let note=noteFromKey(event.key)
      if(note){
        let freq=noteToFreq(note,noteFreq)

        if (oscList[note]){
          currentlyPlaying.shift(note);
          let sound= oscList[note]
          let time=audioContext.currentTime
          restStart=time

          if(nowRecording){
            recording.notes.push({
              freq:sound.osc.frequency.value,
              duration:(audioContext.currentTime-loopStart-sound.time)*bps,
              time:sound.time,
              note:sound.note
            })
          }

          sound.osc.stop(audioContext.currentTime+0.5)
          sound.gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.1);
          oscList[note]=null;
          document.querySelector(`[data-noteid="${note}"]`).classList.remove("active")
        }
      }
      else{
        if(event.key==='Enter'){
          if(nowRecording){
            let sum=recording.notes.reduce(((acc,note)=> acc+note.duration),0)
            recording.duration=sum;
            recordings.push(recording)
            renderRecording(recording,recordingIndex)
            recordingIndex++
          }
            loopStart=audioContext.currentTime
            restStart=audioContext.currentTime
            recording={notes:[],duration:0, startTime:loopStart}
            nowRecording=!nowRecording

            console.log('recording:', nowRecording)
        }
      }
    }



function noteReleased(event) {
  let dataset = event.target.dataset;
  if (oscList[dataset["noteid"]]) {
    let osc=oscList[dataset["noteid"]].osc.stop()
    oscList[dataset["noteid"]]= null;
  }
}
function changeVolume(event) {
  masterGainNode.gain.value = volumeControl.value
}
function playRecording(index){
  let recording=recordings[index]
  let time=audioContext.currentTime

  recording.notes.forEach((note)=>{
    if(note.freq){
      // play the note at the currentTime, plus the time the note is supposed to be played
      playTone(note.freq,note.note,note.duration, time+note.time)
    }
  })
}
function loopRecording(index){

  playRecording(index)
  return setInterval((()=>playRecording(index)),(loopLength/bps)*1000)
}
function recordingReducer(acc,recording,idx){
  return acc+`<div class="recording" id="recording${idx}"> Recording ${idx+1}</div>`
}
  function renderRecording(recording){
  const recordHTML=recordings.reduce(recordingReducer,'')
  document.querySelector('#loop-container').innerHTML=recordHTML;
  }
document.addEventListener('keydown', keyPlay)
document.addEventListener('keyup',keyRelease)

function handleRecordingClick(e){
  if (event.target.className==='recording'){
  playRecording(event.target.id.slice(-1))
}
}
function handleNumKey(e){
  switch(event.key){
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    if(recordings[parseInt(event.key)-1]){playRecording(parseInt(event.key)-1)}
      break
    case "c":
        currOctave-=1

        renderKeyBoard(noteFreq)
        break
    case "v":
      currOctave+=1;
      renderKeyBoard(noteFreq)

      break
  }
}

let obj=[0]

document.addEventListener('keyup',handleNumKey)

document.querySelector('#loop-container').addEventListener('click',handleRecordingClick)
