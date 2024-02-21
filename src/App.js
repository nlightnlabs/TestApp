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

    const getData = ()=>{
        const FAClient  = window.FAClient;
        const response = freeAgentApi.getFAAllRecords(FAClient,appName)
        setData(response)
        // const FAClient  = window.FAClient;
        // let data=[]
        // FAClient.listEntityValues({
        //     entity: appName,
        // }, (response) => {
        //         console.log('Connection successful: ', response);
        //     if (response) {
        //         let rowData = {}
        //         response.map(record=>{
        //             Object.entries(record.field_values).map(([key,value])=>{
        //                 rowData = {...rowData,...{[key]:value.display_value}};
        //               })
        //             data.push(rowData);
        //         })
        //     }
        //     setData(data)
        // });
    }

    // const getAllFARecords = ()=>{
    //     const FAClient  = window.FAClient;

    //     console.log(`app name: ${appName}`)

    //     FAClient.listEntityValues({
    //         entity: appName,
    //     }, (response) => {
    //             console.log('Connection successful: ', response);
    //         if (response) {
    //             setData(response);
    //         }
    //     });
    // }
    

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

        {data && (
            // data.map((row,index) => (
            //     <div key={index} className="d-flex border border-1 p-2 m-2 shadow-sm" >
            //         <div>{row.field_values.seq_id.value}</div>
            //         <div>{row.field_values.description.value}</div>
            //     </div>
            // ))
            data.map((row,index) => (
                <div key={index} className="d-flex border border-1 p-2 m-2 shadow-sm" style={{height: "50px", overflow: "hidden"}} >{JSON.stringify(row)}</div>
            ))
            // <table className="table table-striped">
            //     <thead>
            //         <tr>
            //             {Object.keys(data[0].field_values).map((fieldName, colIndex)=>(
            //                 <th scope="col" key={colIndex} style={cellStyle}>{fieldName}</th>
            //             ))}
            //         </tr>
            //     </thead>
            //     <tbody>
            //         {
            //             data.map((row,rowIndex) => (
            //                 <tr scope="row" key={rowIndex}>
            //                     {Object.keys(data[0].field_values).map((fieldName, colIndex)=>(
            //                         <td key={`${rowIndex}${colIndex}`} style={cellStyle}>{row.field_values[fieldName].value}</td>
            //                     ))}
            //                 </tr>
            //             ))
            //         }
            //     </tbody>
            // </table>
        )}
    </div>
    );
}

export default App;