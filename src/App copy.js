import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import React, {useState, useEffect} from 'react'
import axios from "./apis/axios"

function App() {

  const [formData, setFormData] = useState({})

  const handleChange=(e)=>{
    const {name, value} = e.target
    setFormData({...formData,...{[name]:value}})
    console.log({...formData,...{[name]:value}})
  }

  const handleSubmit =async ()=>{

    const webhookURL = "https://freeagent.network/webhook/a1375994-46d0-4b70-a08d-d713a30d8990/ca61f156-021f-451d-9ce3-85e0594bd3aa"

    const params = {
      webhookURL,
      formData
    }
    try{
      const send = await axios.post("/sendToFA",{params})
      console.log(send)
    }catch(error){
      console.log(error)
    }
    
    
    // try{
    //     const send= await fetch('http://localhost:3001/sendtoFA', {
    //     method: 'post',
    //     // headers:{
    //     //   'Content-Type': 'application/json',
    //     // },
    //     body:{
    //       webookURL,
    //       formData
    //     }
    //   })
    // }catch(error){
    //   console.log(error)
    // }
    
  }

  return (
    <div className="flex-container w-100">
      <div className="d-flex flex-column bg-light justify-content-center p-3">
      
      <form>
        <div className="form-floating mb-3">
          <input name = "name" type="text" className="form-control" value={formData.name} onChange={(e)=>handleChange(e)}></input>
          <label htmlFor="name" className="form-label" >Name</label>
        </div>

        <div className="form-floating">
          <input name = "company" type="text "className="form-control"  value={formData.company} onChange={(e)=>handleChange(e)}></input>
          <label htmlFor="company" className="form-label">Company</label>
        </div>

      </form>

      <div className="d-flex justify-content-center p-3">
          <button className="btn btn-primary" onClick={()=>handleSubmit()}>Send</button>
        </div>

        <div className="text-success">
          JSON: {JSON.stringify(formData)}
        </div>

      </div>
    </div>
  );
}

export default App;
