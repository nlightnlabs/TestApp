import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const [purchaseReqs, setPurchaseReqs] = useState(null);

    const initializeFreeAgentConnection = () => {
    const FAAppletClient = window.FAAppletClient;
    
    //Initialize the connection to the FreeAgent this step takes away the loading spinner
    const FAClient = new FAAppletClient({
        appletId: 'test-app-iframe',
    });

    //Load list of purchase requests using FAClient
    FAClient.listEntityValues({
        entity: "custom_app_53",
        limit: 100,
    }, (purchaseReqs) => {
        console.log('initializeFreeAgentConnection Success!', purchaseReqs);
        if (purchaseReqs) {
            setPurchaseReqs(purchaseReqs);
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
        {!purchaseReqs && 'Loading Purchase Requests From FA!'}
        {purchaseReqs && (
            purchaseReqs.map(pReq => (
            <div>{pReq.field_values.description.value}</div>
            ))
        )}
    </div>
    );
}

export default App;