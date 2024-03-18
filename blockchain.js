const sha256 = require('sha256');
const { v4: uuidv4 } = require('uuid');
const currentNodeUrl = process.argv[3]; 

function blockchain(){
    this.chain= [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    //aware of all the other node that inside of our network
    this.networkNodes = [];
    

    this.createNewBlock( 100, '0', '0' );
}

blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock = {
        //properties
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, //come from prof of work here it is just a number (understand after)
        //the data from our current block hashed into a string
        hash: hash,
        //the data from our previous block and hashed obviously
        previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
} 

blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length -1 ];
}

blockchain.prototype.createNewTransaction = function (amount, sender, recepient){
    const newTransaction ={
        amount: amount,
        sender: sender,
        recepient: recepient,
        transactionId: uuidv4().replace(/-/g, '')
    };

    return newTransaction;

    //this.pendingTransactions.push(newTransaction);

    //return this.getLastBlock()['index'] + 1;
}

blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1 ;
};

blockchain.prototype.hashBlock= function(previousBlockHash, currentBlockData, nonce){
    // nonce currently an number
     const dataAsString= previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData) ;
     //currentBlockData will be either an array or an object (JSON form)
     // stringfy turn onto a string
     // dataAsString is a data string concatenated into a single string
     //create a hash with sha256
     const hash = sha256(dataAsString);
     return hash;
}

blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    // repeatedly hash block until it finds correct hash
    // uses current block data for the hash, but also the previousBlockHash
    // continuously change nonce value until it finds the current hash 
    // return to us the nonce value that create the correct hash
    // let as a variable that change
    let nonce= 0;
    let hash= this.hashBlock(previousBlockHash, currentBlockData, nonce);  


    while(hash.substring(0, 4)!== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash);
    }

    return nonce;
}

blockchain.prototype.chainIsValid = function(blockchain){

    let validChain = true;

    for(var i=1; i<blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);
        if (blockHash.substring(0, 4) !== '0000') validChain = false;
        if (currentBlock['previousBlockHash'] !== prevBlock['hash'] ) validChain = false;

        console.log('previousBlockHash =>', prevBlock['hash']);
        console.log('currentBlockHash =>', currentBlock['hash']);
        
    };

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] == 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] =='0' ;
    const correctHash = genesisBlock['hash'] == '0';
    const correctTransactions = genesisBlock['transactions'].length == '0';

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false; 

    return validChain;
}

module.exports = blockchain;