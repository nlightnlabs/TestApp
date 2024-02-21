import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import * as freeAgentApi from "./apis/FreeAgent.js"

function App() {

    const [data, setData] = useState([]);
    const [fieldNames, setFieldNames] = useState([])
    const [appName, setAppName] = useState("custom_app_22")
    const [reFresh, setRefresh] = useState(0)

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
        FAClient.listEntityValues({
            entity: "custom_app_22",
        }, (response) => {
                console.log('Connection successful: ', response);
            if (response) {
                setData(response);
            }
        });
        window.FAClient = FAClient;
    }


    const getData = () => {
        const FAClient = window.FAClient;
        freeAgentApi.getFAAllRecords(FAClient, appName)
        .then(response => {
            console.log(response);
            setData(response);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }
    
    

    const pageStyle = {
        fontSize: "12px",
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
            <div className="d-flex p-3 border border-1 rounded-3">
                <table className="table table-striped">
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
            </table>
        </div>
        )}
    </div>
    );
}

export default App;