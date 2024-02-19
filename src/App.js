import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import * as freeAgentAPI from './apis/FreeAgent.js'


function App() {

    //Set up local states
    const [data, setData] = useState([]);
    const [faClient, setFaClient] = useState(null)
    const iFrameId = "test-app-iframe"

    freeAgentAPI.useExternalScript(document,setFaClient,iFrameId)

    const [formData, setFormData] = useState({
        entity: "",
    })

    const handleChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        let key = name.toLowerCase().replaceAll(" ","_")
        setFormData({...formData,...{[key]:value}})
    }

    const handleSubmit= async ()=>{
        const appName = formData.entity
        console.log(faClient)
        console.log(appName)
        const response = await freeAgentAPI.getFAAllRecords(faClient,appName)
        console.log(response)
        setData(response)
    }

    return (
    
    <div className="App justify-content-center">

        <h2>FreeAgent Iframe Integration Test App</h2>
        
        <div className="d-flex flex-column" style={{margin: "auto", width: "500px"}}>
            <form>
                <div className="form-floating mb-3">
                    <input id="entity" name="entity" className="form-control" placeholder="App Name" onChange={(e)=>handleChange(e)}></input>
                    <label htmlFor="entity" className="form-label" style={{color: "lightgray"}}>App Name</label>
                </div>
            </form>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={()=>handleSubmit()}>Submit</button>
            </div>
        </div>

        {data.length>0 && <h1>{formData.entity}</h1>}
        {data.length>0 && (
            data.map(record => (
                <div>{JSON.stringify(record)}</div>
            ))
        )}

    </div>
    );
}

export default App;