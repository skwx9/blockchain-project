// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DFS {
    struct File {
        string ipfsHash;
        address owner;
        bool isShared;
    }

    uint256 public fileCount;
    mapping(uint256 => File) public files;
    mapping(uint256 => mapping(address => bool)) public fileAccess;

    // Event for file upload
    event FileUploaded(uint256 indexed fileId, string ipfsHash, address indexed owner);

    // Upload file to the decentralized file system
    function uploadFile(string memory _ipfsHash) public {
        fileCount++;
        files[fileCount] = File(_ipfsHash, msg.sender, false);
        emit FileUploaded(fileCount, _ipfsHash, msg.sender);
    }

    // Grant access to a specific file
    function grantAccess(uint256 _fileId, address _user) public {
        require(files[_fileId].owner == msg.sender, "Only owner can grant access");
        fileAccess[_fileId][_user] = true;
    }

    // Revoke access to a specific file
    function revokeAccess(uint256 _fileId, address _user) public {
        require(files[_fileId].owner == msg.sender, "Only owner can revoke access");
        fileAccess[_fileId][_user] = false;
    }

    // Check if a user has access to a file
    function hasAccess(uint256 _fileId, address _user) public view returns (bool) {
        return fileAccess[_fileId][_user] || files[_fileId].owner == _user;
    }
}
