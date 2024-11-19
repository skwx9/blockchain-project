async function main() {
    const DFS = await ethers.getContractFactory("DFS");
    const dfs = await DFS.deploy();
    console.log("DFS deployed to:", dfs.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
