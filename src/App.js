import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const [data, setData] = useState(null);
    const appName = "custom_app_22"

    const initializeFreeAgentConnection = () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });
        
        FAClient.listEntityValues({
            entity: appName,
        }, (result) => {
                console.log('Successfully connected to FreeAgent', result);
            if (result) {
                setData(result);
            }
        });
    }


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

return (
    <div className="App">
        <h2>FreeAgent Purchase Requests Iframe</h2>
        {!data && 'Loading Data From FreeAgent'}
        {data && (
            data.map((item,index) => (
                <div key={index}>{item.field_values.description.value}</div>
            ))
        )}
    </div>
    );
}

export default App;