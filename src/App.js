import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import * as freeAgentApi from "./apis/FreeAgent.js";
import {toProperCase} from "./functions/formatValue.js";

function App() {

    const [apps, setApps] = useState([])
    const [ appList, setAppList] = useState([])

    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appName, setAppName] = useState("custom_app_22")
    const [reFresh, setRefresh] = useState(0)
    const [selectedRecordId ,setSelectedRecordId] = useState(null)
    const [formData, setFormData] = useState(null)

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
        FAClient.getEntities((response) => {
            console.log('Connection successful: ', response);
            if (response) {
                console.log(response)
                setApps(response)  

                let appList = []
                response.map(item=>{
                    appList.push(item.name)
                })
                setAppList(appList)
            } 
        });

    }


    const getData = () => {
        const FAClient = window.FAClient;
        freeAgentApi.getFAAllRecords(FAClient, appName)
        .then(response => {
            console.log(response);
            let fieldList = []
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


return (
    <div className="App" style={pageStyle}>
        <h2>FreeAgent Iframe Test</h2>
        <div className="form-floating">
            <input name= "app_name" className="form-control" value={appName} placeholder="app_name" onChange={(e)=>handleChange(e)}></input>
            <label htmlFor="app_name" className="form-label">App system name: </label>
        </div>

        <button className="btn btn-primary" onClick={()=>getData()}>Get Data</button>

        {data.length>0 && (  
            // data.map((row,index) => (
            //     <div key={index} className="d-flex border border-1 p-2 m-2 shadow-sm" style={{height: "50px", overflow: "hidden"}} >{JSON.stringify(row)}</div>
            // ))
            <div className="d-flex p-3 border border-1 rounded-3" style={{height: "50px", overflow: "auto"}}>
                {/* <table className="table table-striped">
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((fieldName, colIndex)=>(
                            <th scope="col" key={colIndex} style={cellStyle}>{fieldName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row,rowIndex) => (
                            <tr scope="row" key={rowIndex}>
                                {Object.keys(row).map((fieldName, colIndex)=>(
                                    <td key={`${rowIndex}${colIndex}`} style={cellStyle}>{row[fieldName]}</td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody>
            </table> */}
             <AgGridReact 
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