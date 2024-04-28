import React, {useState, useEffect} from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const VoiceRecorder = ()=> {
    

    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
        mediaRecorder,
        recorderControls
      } = useAudioRecorder();

    useEffect(()=>{
        console.log(useAudioRecorder.mediaRecorder)
    },[])
    
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        console.log(audio)
    };


  const handlePlay = ()=>{

  }

  const handleSumbit = ()=>{

  }

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
        recorderControls={recorderControls}
      />
      <div>
      <button onClick={stopRecording}>Stop recording</button>
    </div>
    </div>
  );
}

export default VoiceRecorder
