import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diagnostic = () => {
    const [status, setStatus] = useState('Checking...');
    const [baseUrl, setBaseUrl] = useState(process.env.REACT_APP_API_BASE_URL || 'NOT SET');
    const [dbResult, setDbResult] = useState('');
    const [resData, setResData] = useState([]);

    useEffect(() => {
        const runDiagnostic = async () => {
            try {
                // Test 1: Check Backend Ping
                const res = await axios.get(`${baseUrl}/api/products`);
                setStatus('✅ Backend Connection: OK');
                setDbResult(`Total Products Found: ${res.data.length}`);
                setResData(res.data);
            } catch (err) {
                setStatus('❌ Backend Connection: FAILED');
                setDbResult(`Error Detail: ${err.message}`);
            }
        };
        runDiagnostic();
    }, [baseUrl]);

    return (
        <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial' }}>
            <h1 style={{ color: '#1a237e' }}>🩺 Store Diagnostic Tool</h1>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>API Configuration:</h3>
                <p><strong>REACT_APP_API_BASE_URL:</strong> <span style={{ color: 'blue' }}>{baseUrl}</span></p>
                
                <hr />
                
                <h3>Connection Status:</h3>
                <h2 style={{ color: status.includes('OK') ? 'green' : 'red' }}>{status}</h2>
                <p><strong>Result:</strong> {dbResult}</p>

                {resData && resData.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#eee', borderRadius: '5px' }}>
                        <h3>Raw Product Data (First Item):</h3>
                        <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
                            {JSON.stringify(resData[0], null, 2)}
                        </pre>
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '20px', color: '#666' }}>
                <p>If you see "NOT SET", you need to add REACT_APP_API_BASE_URL to Vercel Environment Variables.</p>
            </div>
        </div>
    );
};

export default Diagnostic;
