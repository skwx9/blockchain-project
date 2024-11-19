const { create } = require('ipfs-http-client');

// Connect to IPFS
const ipfs = create({ url: 'https://ipfs.infura.io:5001' });

async function uploadFile(filePath) {
    try {
        const file = fs.readFileSync(filePath); // Import 'fs' at the top if using local files
        const added = await ipfs.add(file);
        console.log('File uploaded to IPFS with CID:', added.path);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

uploadFile('C:\Users\PC\Desktop\Table 1gbthh.docx');
