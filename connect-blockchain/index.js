const Web3 = require('web3');
const web3 = new Web3("HTTP://127.0.0.1:7545");

const abi = require("../build/contracts/ICR.json").abi;
require('dotenv').config();
const address = process.env.CONTRACT_ADD;

const contract = new web3.eth.Contract(abi,address);

async function mintICR(owner,user,amount){
    const txObject = {
        from : owner,
        to : address,
        data : contract.methods.mint(user,amount).encodeABI()
    };
    try{
        await web3.eth.sendTransaction(txObject);
    }
    catch(e){
        throw new Error(e);
    }
}

async function addEthereumUser(owner,user){
    const txObject = {
        from : owner,
        to : address,
        data : contract.methods.addUser(user).encodeABI()
    };
    try{
        await web3.eth.sendTransaction(txObject);
    } catch(e){
        throw new Error(e);
    }
}

async function balanceOf(user){
    try{
        return await contract.methods.balanceOf(user).call();
    }
    catch(e){
        throw new Error(e);
    }
}

async function transfer(sender,receiver,amount){
    const txObject = {
        from : sender,
        to : address,
        data: contract.methods.transfer(receiver,amount).encodeABI()
    }
    try {
        await web3.eth.sendTransaction(txObject);
    }
    catch(e){
        throw new Error(e);
    }
}

module.exports = {mintICR,addEthereumUser,balanceOf,transfer};