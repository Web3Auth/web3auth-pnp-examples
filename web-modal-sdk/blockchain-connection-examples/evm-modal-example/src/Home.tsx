import React from 'react';
import App from './App';
import { Web3AuthProvider } from '@web3auth/modal-react-hooks';
import web3AuthContextConfig from './web3AuthProviderProps';

const Home: React.FC = () => {
    return (
        <Web3AuthProvider config={web3AuthContextConfig}>
            <App />
        </Web3AuthProvider>
    );
};

export default Home;