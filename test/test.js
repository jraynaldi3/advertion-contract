const { inputToConfig } = require("@ethereum-waffle/compiler");
const {ethers} = require("ethers")
const { expect } = require("chai");

describe("Advertion", ()=>{

    let signer
    let random1
    let random2
    let contractFactory
    let contract
    beforeEach("deploy contract", async()=>{
        [signer, random1,random2] = await hre.ethers.getSigners()
        contractFactory = await hre.ethers.getContractFactory("Advertion");
        contract = await contractFactory.deploy();
    })
    describe("Bidding", ()=>{
        it("initial bid", async()=>{
            let tx = await contract.bid("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png","www.google.com",{value: ethers.utils.parseEther("1")})
            await tx.wait()
            expect(await contract.bidder()).to.equal(signer.address);
        })
        it("2nd bid should fail", async()=>{
            try{
                let tx = await contract.bid("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png","www.google.com",{value: ethers.utils.parseEther("1")})
                await tx.wait()
            } catch {}
            try{
                tx = await contract.connect(random1).bid("test1","www.google.com",{value: ethers.utils.parseEther("1")})
                await tx.wait()
            } catch{}
            expect(await contract.bidder()).to.equal(signer.address);
            expect(await contract.currentBid()).to.equal(ethers.utils.parseEther("1"));
        })
        it("2nd bid should success", async()=>{
            try{
                let tx = await contract.bid("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png","www.google.com",{value: ethers.utils.parseEther("1")})
                await tx.wait()
            } catch {}
            try{
                tx = await contract.connect(random1).bid("test1","www.google.com",{value: ethers.utils.parseEther("2")})
                await tx.wait()
            } catch{}
            expect(await contract.bidder()).to.equal(random1.address);
            expect(await contract.currentBid()).to.equal(ethers.utils.parseEther("2"));
        })
    })
    describe("Setting", async()=>{
        it("Not an Owner setting", async()=>{
            try{
                let tx = await contract.connect(random1).setDuration(1);
            } catch{}
            expect(await contract.duration()).to.equal(24*60*60);
        })
        it("setDuration by Owner", async()=>{
            try{
                let tx = await contract.setDuration(1);
            } catch{}
            expect(await contract.duration()).to.equal(1);
        })
        it("setRefundTime by Owner", async()=>{
            try{
                let tx = await contract.setRefundTime(1);
            } catch{}
            expect(await contract.refundTime()).to.equal(1);
        })
        it("changeLink by Bidder", async()=>{
            try{
                let tx = await contract.bid("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png","www.google.com",{value: ethers.utils.parseEther("1")})
                await tx.wait()
            } catch{}
            try{
                tx = await contract.changeLink("a","www.facebook.com");
                await tx.wait()
            }catch{}
            expect(await contract.imageLink()).to.equal("a");
            expect(await contract.targetLink()).to.equal("www.facebook.com");
        })
    })
})