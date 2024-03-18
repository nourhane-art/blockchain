const express = require('express');
//creating an app
//with this app we/ can handle different route or endpoints
const app = express();
const bodyParser = require('body-parser');
// import our blockchain
const blockchain = require('./blockchain');
// Old way that might cause errors:
// const uuidv1 = require('uuid/v1');
// New, correct way:
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
const rp = require('request-promise');



const nodeAddress = uuidv4().replace(/-/g, '');

// create an instance from our blockchain
const bitcoin = new blockchain();

//if a request comes in with a json or form data, we parse this data so we can access it  with any of the route here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//it will send our entire blockchain
//this is what this endpoint is going to do: send the entire blockchain back to who ever called this endpoint 
app.get('/blockchain', function (req, res){
    res.send(bitcoin);
 });

//endpoint to create a new transaction on our blockchain
app.post('/transaction', function(req, res){
    //req.body is the object inside the getpostman app on the body section 
    // console.log(req.body);
    // res.send(`the amount of the transaction is ${req.body.amount} bitcoin.`);
    //res.send('it works!!!');
    //const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recepient);
    //res.json({note: `Transaction will be added in block ${blockIndex}.`})

    //take the transaction that had been broadcasted and add it on their (nodes) pendingTransaction array that is present on their node
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions( newTransaction);
    //send back a response that this transaction was a success
    res.json({ note: `Transaction will be added on block ${blockIndex} .`});
});

app.post('/transaction/broadcast', function(req, res){
    const newTransaction = bitcoin.createNewTransaction( req.body.amount, req.body.sender, req.body.recepient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    
    // broadcast all the transaction to all the other nodes on the network by hitting their transaction endpoint
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully.'});
    })
    .catch(error => {
        res.json({ note: 'An error occurred while broadcasting the transaction.', error: error.toString()});
    });
});
//function is callback function  with a request and a response
//'/mine' create or mine a new block for us
app.get('/mine', function(req, res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1, 
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    //mining reward
    //take out the transaction reward from here and broadcast after we mine a block
    //bitcoin.createNewTransaction(12.5, "00", nodeAddress);
    
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash); 

    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    //Run all the requests
    Promise.all(requestPromises)
    .then( data =>{
        const requestOptions = {
            url: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 2.5,
                sender: '00',
                recepient: nodeAddress,
            },
            json: true
        };
        //rp(), you're initiating a HTTP request with the specified options.
        //Because request-promise returns a promise, you can handle the response asynchronously using 
        //.then() and .catch() methods, or within an async function using await.
        return rp(requestOptions);
    })
    .then( data => {
        res.json({
            note: "New block mined and braodcasted successfully",
            block: newBlock
        });
    })
    
});
// app.get('/', function (req, res) {
//   res.send('Hello coding javascript!')
// })


app.post('/receive-new-block', function(req, res){
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash == newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 == newBlock['index'];
    if (correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({ 
            note: "New block received and accepted",
            newBlock: newBlock
        });
    }else{
        res.json({
            note: "New block rejected",
            newBlock: newBlock
        })
    }
});
//register a node and broadcast it on the network
app.post('/register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    //if the newNodeUrl doesn't exist on the network, we register it here
    //this is the first step where we register the new nodeUrl and registering it with this current node
    if (bitcoin.networkNodes.indexOf(newNodeUrl)==-1) bitcoin.networkNodes.push(newNodeUrl);
    
    //this the second step where we broadcast the newNodeUrl to the others nodes 
    const regNodePromises = [];
    // every network nodes is stored as a Url
    // every networkNodeUrl that is already inside our neworkNode array , we wanna register it with all the nodes
    // present there by hitting the '/register-node'
    // we have to make a request to every nodes already present on the network by the request-promise library
    // here we create a message for each node
    bitcoin.networkNodes.forEach(networkNodesUrl =>{
        // '/register-node'
        //requetOption is an object here
        const requestOptions = {
            url: networkNodesUrl + '/register-node',
            method: 'POST',
            //what data we gonna pass along with this request
            body: {newNodeUrl: newNodeUrl},
            // send it as json data
            json: true,
        };
    //this requeqt is going to send to use a promise
    // we wanna get all this promises on a single array which is the registerNodePromises above 
    // send out the messages
        regNodePromises.push(rp(requestOptions));
    });

    //Promise.all(regNodesPromises) waits for all these Promises to resolve or for any to reject.
    // Promise.all() is a method that takes an iterable of promises (in this case, regNodesPromises) as an input.
    //.then(data => { ... }) handles the resolved case
    // where data is an array containing the results of each promise in regNodesPromises in the same order.
    //The then() method is used for scheduling what happens after the Promise resolves.
    // here waiting for all the messages to be sent
    Promise.all(regNodePromises)
    .then(data => {
        //we have to register all the nodes present to the network to the one new node that we adding  
        const bulkRegisterOptions = {
            url: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl]
            },
            json:true,
        };
        return rp(bulkRegisterOptions);
    })
    .then(data =>{
        //just to send a response back to whoever called it
        res.json({ note: 'New node registered with network successfully'});
    })
        //explanation:
        //By using rp with Promises, you can organize your code in a way that's easy to read and manage, 
        //especially when dealing with multiple asynchronous requests. This is seen in the code with Promise.all,
        // where all the requests to inform existing nodes about the new node are sent out, 
        //and the code waits for all of them to complete before moving on.
        //The rp (request-promise) method is what actually sends out the HTTP requests to the other nodes.
        // It does this by making a POST request to each node's /register-node endpoint with the new node's URL as data. 
        //Each call to rp initiates a single request to one of the existing nodes.
}
);

//register a node with the network
// this is where we will receive the nodes from the broadcast request
app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl; 
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1 ;
    //here we are asking if the newNodeUrl is equal 
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl; 
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.'});

});

//register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
            const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
            const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl ; 
            if (nodeNotAlreadyPresent && notCurrentNode)  bitcoin.networkNodes.push(networkNodeUrl);
        });
        res.json({ note: 'Bulk registration successful.'});
    });

app.get('/consensus', function(req, res){
    const requestPromises = [] ;
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
        const requestOptions = {
            url: networkNodeUrl+ '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    //blockchains is an array that filled up by all the other blockchains that are hosted across all the other nodes on the network
    .then(blockchains =>{
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null ;
        let newPendingTransactions = null ;

        blockchains.forEach(blockchain =>{
            //identify if one of the blockhains is longer than the one on the current node
            if ( blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain ;
                newPendingTransactions = blockchain.pendingTransactions;
            };
        });
        
        if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
            res.json({ 
                note: 'Current chain has not been replaced.',
                chain: bitcoin.chain
        });
        }
        //else if( newLongestChain && bitcoin.chainIsValid(newLongestChain))
        else{
            bitcoin.chain = newLongestChain ;
            bitcoin.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'this chain has been replaced',
                chain: bitcoin.chain
            });
        }
    })
})    
//app.listen(3000)
//nodemon is library that whenever we change and save our file, it will automatically estart our sever for us
app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});

