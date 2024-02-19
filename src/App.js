import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const [data, setData] = useState(null);

    const initializeFreeAgentConnection = async () => {
        const FAAppletClient = window.FAAppletClient;
        
        //Initialize the connection to the FreeAgent this step takes away the loading spinner
        const FAClient = new FAAppletClient({
            appletId: 'test-app-iframe',
        });

        //Load data using FAClient
        FAClient.listEntityValues({
            entity: "custom_app_53",
            limit: 100,
        }, (response) => {
            console.log('initializeFreeAgentConnection Success!', response);
            if (response) {
                setData(response);
            }
        });
    };

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
        {!data && 'Loading Purchase Requests From FA!'}
        {data && (
            data.map((item,index) => (
                <div key={index}>{item.field_values.description.value}</div>
            ))
        )}
    </div>
    );
}

export default App;