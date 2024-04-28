import React, {useState, useEffect} from 'react'
import * as crud from './apis/crud.js'
import * as nlightnApi from './apis/nlightn.js'

import "bootstrap/dist/css/bootstrap.min.css"
import VoiceRecorder from './VoiceRecorder.js'
import VoiceRecord from './VoiceRecord.js'

const AIInput = (props) => {

    const [prompt, setPrompt] = useState("")
    const [microphoneIcon, setMicrophoneIcon] = useState("")
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
    const transcription = props.transcription
    const setTranscription = props.setTranscription

    const handleChange = async (e)=>{
        const {name, value} = e.target
        setPrompt(value)
        setTranscription(value)
    }

    useEffect(()=>{
        setPrompt(transcription)
    },[transcription])

    useEffect(()=>{
        const getIcon = async ()=>{
            const environment = window.environment
            let appName = ""
            if(environment ==="freeagent"){
                appName = "icon"
            }else{
                appName = "icons"
            }
            const iconDataResponse = await crud.getData(appName)
            console.log(iconDataResponse)
            setMicrophoneIcon(iconDataResponse.find(i=>i.name==="microphone").image)
        }
        getIcon()
    },[])


  return (
    <div className="d-flex flex-column align-items-center">
        <div className="d-flex w-100 p-1 mb-2" style={{borderBottom: "1px solid lightgray"}}>
            <h3 style={{fontFamily: "Verdana", fontWeight: "bold"}}>CFO Copilot</h3>
        </div>
        <div className="d-flex justify-content-between border rounded-3 p-1" style={{height: "50px", width: "100%", overflow: "hidden"}}>
            <input 
                name="prompt" 
                className="form-control"
                onChange={(e)=>handleChange(e)} 
                value={prompt} 
                style={{height: "100%", width: "75%", color: "rgb(0,100,225)", fontSize:"16px", border: "none"}}
                placeholder = "What do you need?"
                resize ="none"
            >
            </input>

            <div className="d-flex m-1" onClick={(e)=>setShowVoiceRecorder(!showVoiceRecorder)}>
                <img src={microphoneIcon} style={{height: "100%", width: "auto", cursor: "pointer"}}></img>
            </div>
        </div>

        {showVoiceRecorder && 
            <div className="d-flex justify-content-center w-100">
                <VoiceRecord
                    setTranscription = {setTranscription} 
                    display={showVoiceRecorder}
                    setDisplay = {setShowVoiceRecorder}
                />
            </div>
        }

    </div>
  )
}

export default AIInput