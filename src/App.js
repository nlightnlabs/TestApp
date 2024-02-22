
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

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({})
    const [selectedRecordId, setSelectedRecordId] = useState(null)

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

        if(selectedRecordId !="" && selectedRecordId !=null){
            freeAgentApi.getFARecords(FAClient, appName, selectedRecordId)
            .then(response => {
                console.log("data received from FA function: ", response)
                let fieldList = []

                if(response.length>0){
                    Object.keys(response[0]).map((field,index)=>{
                        fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                    })
                    console.log("field list: ", fieldList)
                    setFields(fieldList)
                }
                setData(response);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }else{
            
            freeAgentApi.getFAAllRecords(FAClient, appName)
            .then(response => {
                console.log("data received from FA function: ", response)
                let fieldList = []

                if(response.length>0){
                    Object.keys(response[0]).map((field,index)=>{
                        fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
                    })
                    console.log("field list: ", fieldList)
                    setFields(fieldList)
                }
                setData(response);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }

    const updateRecord = (e) => {
        const FAClient = window.FAClient;
        freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId, formData)

        .then(response => {
            console.log(response);
            getData();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    const deleteRecord = (e) => {
        const FAClient = window.FAClient;
        freeAgentApi.deleteFARecord(FAClient, appName, selectedRecordId)

        .then(response => {
            console.log(response);
            getData();
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

    const handleInputChange=(e)=>{
        const {name, value} = e.target 
        setFormData({...formData,...{[name]:value}})
    }

    const onCellClicked = (e) => {
        setSelectedRecordId(e.data.id)
        setFormData(e.data)
        console.log(e.data)
      }


  return (
    <div className="d-flex flex-column" style={pageStyle}>


        <h2 className="text-center">nlightnlabs FreeAgent Iframe Test</h2>
        <div className="d-flex w-100">
        <div className="d-flex flex-column w-25 m-3 bg-light p-3">
            
            <div className="form-floating mb-3">
                <input name= "app_name" className="form-control" value={appName} placeholder="app_name" onChange={(e)=>handleChange(e)}></input>
                <label htmlFor="app_name" className="form-label">App system name: </label>
            </div>

            <div className="form-floating mb-3">
                <input name= "record_id" className="form-control" value={setSelectedRecordId} placeholder="Record Id" onChange={(e)=>handleChange(e)}></input>
                <label htmlFor="record_id" className="form-label">Record Id: </label>
            </div>

            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={()=>getData()}>Get Data</button>
            </div>

            {appName !="" && appName !=null && data.length>0 &&
             <div className="d-flex flex-column m-3" style={{borderTop: "1px solid lightgray"}}>
            
                {Object.keys(formData).length> 0  && Object.keys(formData).map((key, index)=>(
                    <div key={index} className="form-floating mb-3">
                        <input id={key} name= {key} value={formData[key]} className="form-control" placeholder={key} onChange={(e)=>handleInputChange(e)}></input>
                        <label htmlFor={key} className="form-label">App system name: </label>
                    </div>
                ))}
             
             <div className="d-flex justify-content-center">
                <div className="btn-group">
                    <button className="btn btn-alert" onClick={(e)=>updateRecord(e)}>Update</button>
                    <button className="btn btn-danger" onClick={(e)=>deleteRecord(e)}>Delete</button>
                </div>
             </div>

            </div> 
        }
        </div> 

            <div className="d-flex w-75 m-3 p-3">
                <div id="myGrid" style={{height: "auto", width: "100%"}} className="ag-theme-quartz">
                <AgGridReact
                    rowData={data}
                    columnDefs={fields}
                />
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
