const { parseEther } = require("ethers/lib/utils");

const main = async()=>{
    const [signer, random1,random2] = await hre.ethers.getSigners()
    const contractFactory = await hre.ethers.getContractFactory("Advertion");
    const contract = await contractFactory.deploy();

    await contract.deployed();
    await contract.deployTransaction.wait();

    console.log("deployed to: ", contract.address);
    console.log("deployed by: ", signer.address);

    let tx = await contract.bid("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png","www.google.com",{value: parseEther("1")})
    await tx.wait()
    console.log(await contract.bidder());
}

const runMain = async()=>{
    try{
        await main();
        process.exit(0);
    } catch(error){
        console.error(error);
        process.exit(1);
    }
}

runMain();