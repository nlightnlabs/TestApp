import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import * as FreeAgentAPI from './apis/FreeAgent.js'


function App() {

    //Set up local states
    const [data, setData] = useState([]);
    const [faClient, setFaClient] = useState(null)
    const iFrameId = "test-app-iframe"
    const doc = document

    FreeAgentAPI.useExternalScript(doc,setFaClient,iFrameId)

    const [formData, setFormData] = useState({
        entity: "",
        id: ""
    })

    const handleChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        let key = name.toLowerCase().replaceAll(" ","_")
        setFormData({...formData,...{[key]:value}})
    }

    const handleSubmit= async (e)=>{
        const appName = formData.entity
        console.log(appName)
        const response = await FreeAgentAPI.getFAAllRecords(faClient,appName)
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
                <div className="form-floating">
                    <input id="id" name="id" className="form-control" placeholder="Record Id" onChange={(e)=>handleChange(e)}></input>
                    <label htmlFor="id" className="form-label" style={{color: "lightgray"}}>Record Id</label>
                </div>
            </form>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={(e)=>handleSubmit(e)}>Submit</button>
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