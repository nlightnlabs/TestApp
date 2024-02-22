
import './App.css';
import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import * as freeAgentApi from "./apis/FreeAgent.js";
import {toProperCase} from "./functions/formatValue.js";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

function App() {

    const [apps, setApps] = useState([])
    const [ appList, setAppList] = useState([])

    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appName, setAppName] = useState("")

    const [formData, setFormData] = useState(null)
    const [setSelectedId, setSelectedRecordId] = useState(null)

    const testData = [
        {name: "John",age: 34},
        {name: "Mary",age: 23},
        {name: "Steve",age: 56},
        {name: "Jane",age: 12},
        {name: "Amy",age: 34}
    ]

    const useExternalScript = (src) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);

            setTimeout(() => {
                initializeFreeAgentConnection();
            }, 500);

            return () => {
                document.body.removeChild(script);
            };
        }, [src]);
    };
     //script to itnegrate FreeAgent library
     useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');


    const initializeFreeAgentConnection = () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });
        window.FAClient = FAClient;

        //Get list of apps
        freeAgentApi.getFAAllRecords(FAClient, "web_app")
        .then(response => {
            console.log(response);
            let fieldList = []
            if(response.length>0){
                Object.keys(response[0]).map((field,index)=>{
                    fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                })
                console.log(fieldList);
                setAppList(fieldList)
            }
            setApps(response);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    }

    const getData = () => {
               
        const FAClient = window.FAClient;
        freeAgentApi.getFAAllRecords(FAClient, appName)
        .then(response => {
            console.log(response);
            let fieldList = []

            console.log(testData)
            response=testData

            if(response.length>0){
                Object.keys(response[0]).map((field,index)=>{
                    fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                })
                console.log(fieldList);
                setFields(fieldList)
            }
            setData(response);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
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


//   const columnDefs= [
//       { headerName: 'Make', field: 'make' },
//       { headerName: 'Model', field: 'model' },
//       { headerName: 'Price', field: 'price' }
//     ]

//     const rowData = [
//       { make: 'Toyota', model: 'Celica', price: 35000 },
//       { make: 'Ford', model: 'Mondeo', price: 32000 },
//       { make: 'Porsche', model: 'Boxster', price: 72000 }
//     ]

  return (
    <div style={pageStyle}>

    <h2>FreeAgent Iframe Test</h2>
        <div className="form-floating">
            <input name= "app_name" className="form-control" value={appName} placeholder="app_name" onChange={(e)=>handleChange(e)}></input>
            <label htmlFor="app_name" className="form-label">App system name: </label>
        </div>

        <button className="btn btn-primary" onClick={()=>getData()}>Get Data</button>

    <   div id="myGrid" style={{height: "150px", width: "600px"}} className="ag-theme-quartz">
        
        <AgGridReact
            rowData={data}
            columnDefs={fields}
      />
    </div>
    </div>
  );
}

export default App;
