import './App.css';
import './index.css';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as nlightnApi from './components/apis/nlightn';
import AIInput from './components/AIInput.js';
import Svg from './Svg.js';
import Image from './components/icons/budget_icon.svg'


function App() {
    const [prompt, setPrompt] = useState("");
    const [commonNeeds, setCommonNeeds] = useState([]);

    const getCommonNeeds = async () => {
        // Mock response for testing
        const response = [
            { id: 1, name: "total_spend", label: "Total Spending", icon: require('./components/icons/spending_icon.svg').default },
            { id: 2, name: "remaining_budget", label: "Remaining Budget", icon: require('./components/icons/cash_flow_icon.svg').default },
            { id: 3, name: "sales_forecast", label: "Sales Trends", icon: require('./components/icons/sales_trends_icon.svg').default },
            { id: 4, name: "cash_flow", label: "Cash Flow", icon: require('./components/icons/financial_statement_icon.svg').default },
        ];
        setCommonNeeds(response);
    };


    const handleSelectCommonNeed = (e) => {
        // Handle selection logic here
    };

    useEffect(() => {
        getCommonNeeds();
    }, []);

    return (
        <div className="d-flex justify-content-center p-3">
            <div className="d-flex flex-column" style={{ width: "100%" }}>
                
                <div className="d-flex flex-column">
                    <AIInput
                        transcription={prompt}
                        setTranscription={setPrompt}
                    />
                </div>

                <div>
                    {
                        <div className="d-flex bg-light rounded-3 shadow mt-3" style={{height:"200px", width: "100%"}}>

                        </div>
                    }
                </div>
               
                <div className="d-flex flex-column p-2" style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <div className="d-flex m-1" style={{ color: "gray" }}>Common needs:</div>
                    {commonNeeds.map((item, index) => (
                        <div
                            key={item.id}
                            id={item.name}
                            className="d-flex border border-1 p-3 rounded-3 shadow-sm mb-2 align-items-center"
                            style={{ height: "75px", cursor: "pointer", border: "3px solid rgba(0,100,255,0.5)" }}
                            onClick={(e) => handleSelectCommonNeed(e)}
                        >   
                            <Svg 
                                 src={'./components/icons/budget_icon.svg'} // Pass the SVG URL instead of svgImage
                                 width="97"
                                 height="98"
                                 fill="red" // Specify the fill color through props
                                 opacity="1"
                            />
                            <img src={Image} style={{height: 50, width: 50, overflow:"hiddens"}}/>
                            
                            <div className="d-flex ms-3">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
