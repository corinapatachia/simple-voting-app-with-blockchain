// Init
const Web3 = require('web3');
const fs  = require('fs');
const solc = require('solc');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Show Contracts
console.log ("Web3 Accounts: ", web3.eth.accounts);

// Compile Contract
let code = fs.readFileSync('Voting.sol').toString();

let compiledCode = solc.compile(code);

// console.log ("Compiled Code: ", compiledCode);

console.log ("Gas Estimates: ", compiledCode.contracts[':Voting'].gasEstimates);

// Deploy Contract
let abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
var VotingContract = web3.eth.contract(abiDefinition);

// Instantiate by Address
// var contractInstance = VotingContract.at(address);

// Deploy New Contract
let byteCode = compiledCode.contracts[':Voting'].bytecode;
// let gasEstimate = web3.eth.estimateGas({data: byteCode});
let gasEstimate = compiledCode.contracts[':Voting'].gasEstimates.creation[1] * 5; // high gas estimation - to be changed/removed


console.log ("Gas Estimate: ", gasEstimate);

var contractInstance = VotingContract.new(['Rama','Nick','Jose'],
                                                {
                                                    data: byteCode, 
                                                    from: web3.eth.accounts[0], 
                                                    gas: gasEstimate}, function (err, contract) {
                                                            if (err) throw err;
                                                            // NOTE: The callback will fire twice!
                                                            // Once the contract has the transactionHash property set and once its deployed on an address.
                                                            console.log (contract);
                                                            // e.g. check tx hash on the first call (transaction send)
                                                            if(!contract.address) {
                                                                console.log("Contract Transaction Hash: ", contract.transactionHash) // The hash of the transaction, which deploys the contract
                                                            
                                                            // check address on the second call (contract deployed)
                                                            } else {
                                                                console.log("Contract Address: ", contract.address) // the contract address
                                                                

                                                                // Interact with contract
                                                                console.log (contract.totalVotesFor.call('Rama'));
                                                            }

                                                            //console.log ("Total votes for Rama: ", contract.totalVotesFor.call('Rama'));
                                                     
                                                            // Note that the returned "myContractReturned" === "myContract",
                                                            // so the returned "myContractReturned" object will also get the address set.
                                                    
                                                    });
// console.log ("Deployed Contract Address: ", deployedContract.address);
//var contractInstance = VotingContract.at(deployedContract.address);

// Get the data to deploy the contract manually
//var contractData = VotingContract.new.getData(['Rama','Nick','Jose'], {data: byteCode});

// Interact with the contract

