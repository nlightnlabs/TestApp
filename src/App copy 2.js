import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import * as freeAgentApi from "./apis/FreeAgent.js";
import {toProperCase} from "./functions/formatValue.js";

function App() {
    const [ appList, setAppList] = useState([])

    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appName, setAppName] = useState("custom_app_22")

    const testData = [
        {name: "John",age: 34},
        {name: "Mary",age: 23},
        {name: "Steve",age: 56},
        {name: "Jane",age: 12},
        {name: "Amy",age: 34}
    ]

    const getData = () => {

        let response = testData
        console.log(testData)
        let fieldList = []
        Object.keys(response[0]).map((field,index)=>{
                fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
            })
        console.log(fieldList);
        setFields(fieldList)
    }
    
    
    const pageStyle = {
        fontSize: "12px",
        height: "100%",
        width: "100%",
        overflow: "hidden"
    }

    const cellStyle={
        whiteSpace: "nowrap",
        maxWidth: "150px",
        height: "20px"
    }

    const handleChange=(e)=>{
        const {name, value} = e.target 
        setAppName(value)
    }

    const onCellClicked = (e) => {
        setSelectedRecordId(e.data.id)
        setFormData(e.data)
        console.log(e.data)
      }


return (
    <div className="App" style={pageStyle}>
        <h2>FreeAgent Iframe Test</h2>
        <div className="form-floating">
            <input name= "app_name" className="form-control" value={appName} placeholder="app_name" onChange={(e)=>handleChange(e)}></input>
            <label htmlFor="app_name" className="form-label">App system name: </label>
        </div>

        <button className="btn btn-primary" onClick={()=>getData()}>Get Data</button>

        {data.length>0 && (  
            <div className="d-flex p-3 border border-1 rounded-3" style={{height: "50px", overflow: "auto"}}>
             <AgGridReact 
                rowSelection="multiple"
                rowData={data} 
                columnDefs={fields} 
                onCellClicked={onCellClicked}
            />

            <div>

            </div>
        </div>
        )}
    </div>
    );
}

export default App;