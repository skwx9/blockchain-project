require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.0",
    networks: {
        hardhat: {},
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: [ `0x989d5221cc991d90dccf9f42552fe68b3063c3995e7a5a31cd975fb08025442a` ]
        }
    }
};
