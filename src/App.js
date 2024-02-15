import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"


function App() {

     //Set up local states
     const [appData, setAppData] = useState([]);
     const [appName, setAppName] = useState("custom_app_15");
     const [formData, setFormData] = useState({
        entity: "",
        id: ""
    })

    //script to itnegrate FreeAgent library
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
    useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');

    //Free agent function to get all records
    const initializeFreeAgentConnection = async () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });

        if(appName !="" && appName!=null){
            try {

            let data=[];
            const response = await FAClient.listEntityValues({
                entity: appName
            });
        
            response.map(async (record, index) => {
                let rowData = {};
                Object.entries(record.field_values).map(([key,value])=>{
                    rowData = {...rowData,...{[key]:value.display_value}};
                })
                data.push(rowData);
            })
        
                console.log(data);
                setAppData(data)

            }catch(error){
                console.log(error);
                return [];
            }
        }  
    };



    //Function to tigger data fetch Free Agent Data
    const getData = async (e)=>{
        setAppName(formData.entity)
    }

    //Function handle form change
    const handleChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        setAppName(name)

        let key = name.toLowerCase().replaceAll(" ","_")
        setFormData({...formData,...{[key]:value}})
    }

    return (
    
    <div className="App justify-content-center">

        <h2>FreeAgent Iframe Integration Test App</h2>
        
        <div className="d-flex flex-column" style={{margin: "auto", width: "500px"}}>
            <div className="form-floating mb-3">
                <input id="entity" name="entity" className="form-control" placeholder="App Name" onChange={(e)=>handleChange(e)}></input>
                <label htmlFor="entity" className="form-label" style={{color: "lightgray"}}>App Name</label>
            </div>
            <div className="form-floating">
                <input id="id" name="id" className="form-control" placeholder="Record Id" onChange={(e)=>handleChange(e)}></input>
                <label htmlFor="id" className="form-label" style={{color: "lightgray"}}>Record Id</label>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={(e)=>getData()}>Submit</button>
            </div>
        </div>
        {appData.length>0 &&
        <div>
            <div>{appName} Results:</div>
            {appData.map(record => (<div key={record.seq_id}>{JSON.stringify(record)}</div>))}
        </div>
        }
    </div>
    );
}

export default App;