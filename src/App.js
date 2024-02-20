import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const [data, setData] = useState(null);
    // const appName = "custom_app_22"

     //INPUT FROM FREEAGENT Specifiy App to bring in
     const PURCHASE_REQ_APP = 'custom_app_53';

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
    
        //Bridge to access freeagent apps
        FAClient.listEntityValues({
            entity: PURCHASE_REQ_APP,
            limit: 100
        }, (purchaseReqs) => {
                console.log('initializeFreeAgentConnection Success!', purchaseReqs);
            if (purchaseReqs) {
                setData(purchaseReqs);
            }
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




return (
    <div className="App" style={pageStyle}>
        <h2>FreeAgent Purchase Requests Iframe</h2>
        {!data && 'Loading Data From FreeAgent'}
        {data && (
            <table className="table table-striped">
                <thead>
                    <tr>
                        (Object.keys(data[0].field_values).map((fieldName, colIndex)=>(
                            <th scope="col" key={colIndex} style={cellStyle}>{fieldName}</th>
                        )))
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row,rowIndex) => (
                            <tr scope="row" key={rowIndex}>
                                (Object.keys(data[0].field_values).map((fieldName, colIndex)=>(
                                    <td key={`${rowIndex}${colIndex}`} style={cellStyle}>{row.field_values[fieldName].value}</td>
                                )))
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )}
    </div>
    );
}

export default App;