let audioContext = new (window.AudioContext || window.webkitAudioContext);

let oscList = [];
let currentOctave=3;
let keyTable=genKeyTable(currentOctave);
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

function genKeyTable(octave){
   const keyTable= {
    "a":`${octave}C`,
    "w":`${octave}C#`,
    "s":`${octave}D`,
    "e":`${octave}D#`,
    "d":`${octave}E`,
    "f":`${octave}F`,
    "t":`${octave}F#`,
    "g":`${octave}G`,
    "y": `${octave}G#`,
    "h": `${octave}A`,
    "u": `${octave}A#`,
    "j": `${octave}B`,
    "k": `${octave+1}C`,
    "o": `${octave+1}C#`,
    "l":`${octave+1}D`,
    "p":`${octave+1}D#`,
    ";":`${octave+1}E`,
    "'":`${octave+1}F`
  }
  return keyTable
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

  let noteFreq = [];
  for (let i=0; i< 9; i++) {
    noteFreq[i] = {};
  }
    noteFreq[0]["A"] = 27.500000000000000;
    noteFreq[0]["A#"] = 29.135235094880619;
    noteFreq[0]["B"] = 30.867706328507756;

    noteFreq[1]["C"] = 32.703195662574829;
    noteFreq[1]["C#"] = 34.647828872109012;
    noteFreq[1]["D"] = 36.708095989675945;
    noteFreq[1]["D#"] = 38.890872965260113;
    noteFreq[1]["E"] = 41.203444614108741;
    noteFreq[1]["F"] = 43.653528929125485;
    noteFreq[1]["F#"] = 46.249302838954299;
    noteFreq[1]["G"] = 48.999429497718661;
    noteFreq[1]["G#"] = 51.913087197493142;
    noteFreq[1]["A"] = 55.000000000000000;
    noteFreq[1]["A#"] = 58.270470189761239;
    noteFreq[1]["B"] = 61.735412657015513;
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
    noteFreq[4]["F#"] = 369.994422711634398;
    noteFreq[4]["G"] = 391.995435981749294;
    noteFreq[4]["G#"] = 415.304697579945138;
    noteFreq[4]["A"] = 440.000000000000000;
    noteFreq[4]["A#"] = 466.163761518089916;
    noteFreq[4]["B"] = 493.883301256124111;

    noteFreq[5]["C"] = 523.251130601197269;
    noteFreq[5]["C#"] = 554.365261953744192;
    noteFreq[5]["D"] = 587.329535834815120;
    noteFreq[5]["D#"] = 622.253967444161821;
    noteFreq[5]["E"] = 659.255113825739859;
    noteFreq[5]["F"] = 698.456462866007768;
    noteFreq[5]["F#"] = 739.988845423268797;
    noteFreq[5]["G"] = 783.990871963498588;
    noteFreq[5]["G#"] = 830.609395159890277;
    noteFreq[5]["A"] = 880.000000000000000;
    noteFreq[5]["A#"] = 932.327523036179832;
    noteFreq[5]["B"] = 987.766602512248223;

    noteFreq[6]["C"] = 1046.502261202394538;
    noteFreq[6]["C#"] = 1108.730523907488384;
    noteFreq[6]["D"] = 1174.659071669630241;
    noteFreq[6]["D#"] = 1244.507934888323642;
    noteFreq[6]["E"] = 1318.510227651479718;
    noteFreq[6]["F"] = 1396.912925732015537;
    noteFreq[6]["F#"] = 1479.977690846537595;
    noteFreq[6]["G"] = 1567.981743926997176;
    noteFreq[6]["G#"] = 1661.218790319780554;
    noteFreq[6]["A"] = 1760.000000000000000;
    noteFreq[6]["A#"] = 1864.655046072359665;
    noteFreq[6]["B"] = 1975.533205024496447;
    noteFreq[7]["C"] = 2093.004522404789077;
    noteFreq[7]["C#"] = 2217.461047814976769;
    noteFreq[7]["D"] = 2349.318143339260482;
    noteFreq[7]["D#"] = 2489.015869776647285;
    noteFreq[7]["E"] = 2637.020455302959437;
    noteFreq[7]["F"] = 2793.825851464031075;
    noteFreq[7]["F#"] = 2959.955381693075191;
    noteFreq[7]["G"] = 3135.963487853994352;
    noteFreq[7]["G#"] = 3322.437580639561108;
    noteFreq[7]["A"] = 3520.000000000000000;
    noteFreq[7]["A#"] = 3729.310092144719331;
    noteFreq[7]["B"] = 3951.066410048992894;

    noteFreq[8]["C"] = 4186.009044809578154;
  return noteFreq;
}




function renderKeyBoard(noteFreq,currentOctave){
  keyboard.innerHTML=""
  for (var octave in noteFreq){
    let octaveElem = document.createElement("div");
    console.log(octave, currentOctave)
        mapNoteToKey= Object.fromEntries(Object.entries(keyTable).map(entry => ([entry[1], entry[0]])))
       console.log(mapNoteToKey)
        octaveElem.className = "octave "+ "octave"+octave;
      for( let note in noteFreq[octave]){
        let noteid=octave+note
        console.log(noteid)
        let key = mapNoteToKey[noteid]
        let freq=noteToFreq(noteid,noteFreq)
        if (noteid.length == 2) {
          octaveElem.appendChild(createKey(note, octave, freq ,key, false));
        }
        if (noteid.length == 3) {
          octaveElem.appendChild(createKey(note, octave, freq,key,true));
        }
      }
    keyboard.appendChild(octaveElem);
  }
}

function setup() {

  volumeControl.addEventListener("change", changeVolume, false);
  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;
  keyTable=genKeyTable(currentOctave)
  renderKeyBoard(noteFreq, currentOctave)
  document.querySelector('.octave'+currentOctave).scrollIntoView({behavior:"smooth",inline: "center"})

  // Create the keys; skip any that are sharp or flat; for
  // our purposes we don't need them. Each octave is inserted
  // into a <div> of class "octave".

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
}

setup();
function createKey(note, octave, freq, key,black=false) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = "key";
  if(black){keyElement.className = "key black";}
  else{
    keyElement.className= "key white";
  }

  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;
  keyElement.dataset["noteid"]=octave+note

  if(key){
    labelElement.innerHTML = key + '<sub>' + note + '</sub>';
  }
  else{
    keyElement.classList.add('inactive');
  }
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
      let note=keyTable[event.key]
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
      let note=keyTable[event.key]
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
  console.log(event.key)
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
        currentOctave-=1
        document.querySelector('.octave'+currentOctave).scrollIntoView({behavior:"smooth",inline: "center"})

        keyTable=genKeyTable(currentOctave)
        renderKeyBoard(noteFreq,currentOctave)
        break
    case "v":
      currentOctave+=1;
      document.querySelector('.octave'+currentOctave).scrollIntoView({behavior:"smooth",inline: "center"})

      keyTable=genKeyTable(currentOctave)
      renderKeyBoard(noteFreq,currentOctave)

      break
  }
}

let obj=[0]

document.addEventListener('keyup',handleNumKey)

document.querySelector('#loop-container').addEventListener('click',handleRecordingClick)
