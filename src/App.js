import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import React, {useState, useEffect} from 'react'

function App() {

  const [formData, setFormData] = useState({})

  const handleChange=(e)=>{
    const {name, value} = e.target
    setFormData({...formData,...{[name]:value}})
    console.log({...formData,...{[name]:value}})
  }

  return (
    <div className="flex-container w-100">
      <div className="d-flex bg-light justify-content-center p-3 w-100">
      <form>
        <div className="form-floating">
          <input name = "name" type="text" className="form-control" value={formData.name} onChange={(e)=>handleChange(e)}></input>
          <label htmlFor="name" className="form-label" >Name</label>
        </div>

        <div className="form-floating">
          <input name = "company" type="text "className="form-control"  value={formData.company} onChange={(e)=>handleChange(e)}></input>
          <label htmlFor="company" className="form-label">Company</label>
        </div>

        <div className="d-flex justify-content-center p-3">
          <button className="btn btn-primary">Send</button>
        </div>

        <div>
          {JSON.stringify(formData)}
        </div>

      </form>
      </div>
    </div>
  );
}

export default App;
