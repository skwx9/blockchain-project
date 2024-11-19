import React, { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract, isAddress } from 'ethers';

const contractAddress = '0xEbc3d513438EEF9F7900460017270C620C0F6d0a';
const contractABI = [
  {
    "_format": "hh-sol-artifact-1",
    "contractName": "DFS",
    "sourceName": "contracts/DFS.sol",
    "abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "fileId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "FileUploaded",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          }
        ],
        "name": "uploadFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_fileId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_fileId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_fileId",
            "type": "uint256"
          }
        ],
        "name": "deleteFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [accessAddress, setAccessAddress] = useState('');
  const [fileId, setFileId] = useState('');
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const dfsContract = new Contract(contractAddress, contractABI[0].abi, signer);
        setContract(dfsContract);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  // Function to display a temporary success message
  const displaySuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(''); // Clear the message after 3 seconds
    }, 3000);
  };

  const uploadFile = async () => {
    if (contract && account) {
      try {
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        
        const tx = await contract.uploadFile(ipfsHash);
        await tx.wait();
        console.log('File uploaded with IPFS hash:', ipfsHash);

        // Increment total files and show success message
        setTotalFiles((prevCount) => prevCount + 1);
        displaySuccessMessage('File uploaded successfully!');

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('Contract not initialized or account not connected');
    }
  };

  const grantAccess = async () => {
    if (contract && fileId) {
      if (!isAddress(accessAddress)) {
        console.error('Invalid Ethereum address:', accessAddress);
        return;
      }
      try {
        const tx = await contract.grantAccess(fileId, accessAddress);
        await tx.wait();
        console.log(`Access granted to ${accessAddress} for file ${fileId}`);
        displaySuccessMessage(`Access granted to ${accessAddress} for file ${fileId}`);
      } catch (error) {
        console.error('Error granting access:', error);
      }
    } else {
      console.error('Please enter a valid file ID to grant access.');
    }
  };

  const revokeAccess = async () => {
    if (contract && fileId) {
      if (!isAddress(accessAddress)) {
        console.error('Invalid Ethereum address:', accessAddress);
        return;
      }
      try {
        const tx = await contract.revokeAccess(fileId, accessAddress);
        await tx.wait();
        console.log(`Access revoked from ${accessAddress} for file ${fileId}`);
        displaySuccessMessage(`Access revoked from ${accessAddress} for file ${fileId}`);
      } catch (error) {
        console.error('Error revoking access:', error);
      }
    } else {
      console.error('Please enter a valid file ID to revoke access.');
    }
  };

  const deleteFile = async (fileId) => {
    if (contract) {
      try {
        const tx = await contract.deleteFile(fileId);
        await tx.wait();
        console.log(`File ${fileId} deleted`);
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        setTotalFiles((prevCount) => prevCount - 1);
        displaySuccessMessage(`File ${fileId} deleted successfully!`);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  useEffect(() => {
    if (account && contract) {
      console.log('Account connected:', account);
    }
  }, [account, contract]);

  return (
    <div className="App">
      <h1>Decentralized File Sharing</h1>
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {/* Display Success Message */}
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <div>
        <h2>Upload File</h2>
        <input
          type="text"
          placeholder="IPFS Hash"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
        />
        <button onClick={uploadFile}>Upload</button>
      </div>

      <div>
        <h2>Manage Access</h2>
        <input
          type="text"
          placeholder="File ID"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address to Grant/Revoke Access"
          value={accessAddress}
          onChange={(e) => setAccessAddress(e.target.value)}
        />
        <button onClick={grantAccess}>Grant Access</button>
        <button onClick={revokeAccess}>Revoke Access</button>
      </div>

      <div>
        <h2>Uploaded Files</h2>
        <p>Total Files Uploaded: {totalFiles}</p>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <p>File ID: {file.id}</p>
              <p>IPFS Hash: {file.ipfsHash}</p>
              <p>Owner: {file.owner}</p>
              <button onClick={() => deleteFile(file.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
