const blockchain = require('./blockchain');
const bitcoin = new blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1710291182208,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1710291218656,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1710291288365,
            "transactions": [
                {
                    "amount": 2.5,
                    "sender": "00",
                    "recepient": "afe1158a37a242e9bddc1d1fd5560d3c",
                    "transactionId": "d19456b0e40e4f048534c8932051abe4"
                },
                {
                    "amount": 10,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "ddf0bdffcf73497d962fc7d6603370c1"
                },
                {
                    "amount": 20,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "fc2ce0c619d241948cd8bd8e82c2119a"
                },
                {
                    "amount": 30,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "c9041d83156646b082b285910e44476e"
                }
            ],
            "nonce": 88864,
            "hash": "00005a0001fa1895f75d992c51be477ce8b69c9a7318a22cafeee57e080cc4cf",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1710291344281,
            "transactions": [
                {
                    "amount": 2.5,
                    "sender": "00",
                    "recepient": "afe1158a37a242e9bddc1d1fd5560d3c",
                    "transactionId": "ab2e94f0a9e8425a9b6d98914788036c"
                },
                {
                    "amount": 40,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "763f57ab50f545e9af793ba3655e53ac"
                },
                {
                    "amount": 50,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "8ccc0bc663f840a79d3198286b4a6e4a"
                },
                {
                    "amount": 60,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "376e33a992e44352a550e57732d217d1"
                },
                {
                    "amount": 70,
                    "sender": "ZDSFSDFDG0GLKGL5FNJDBNL8D",
                    "recepient": "FGKJDFJSFSF5FJKHFS4HF0HDG",
                    "transactionId": "7506ad3da4e2432a904eeab116dc8989"
                }
            ],
            "nonce": 39050,
            "hash": "0000d3bbe137c8e9fb5d5cbf952744195c75e38ba1738d62087455eb691b8e2f",
            "previousBlockHash": "00005a0001fa1895f75d992c51be477ce8b69c9a7318a22cafeee57e080cc4cf"
        },
        {
            "index": 5,
            "timestamp": 1710291367979,
            "transactions": [
                {
                    "amount": 2.5,
                    "sender": "00",
                    "recepient": "afe1158a37a242e9bddc1d1fd5560d3c",
                    "transactionId": "4995b51073294e1e97a64650dd692867"
                }
            ],
            "nonce": 84482,
            "hash": "00004dd148f935c4b384755208625269bbe7ed231ad221e5d589dd281bf76898",
            "previousBlockHash": "0000d3bbe137c8e9fb5d5cbf952744195c75e38ba1738d62087455eb691b8e2f"
        },
        {
            "index": 6,
            "timestamp": 1710291372061,
            "transactions": [
                {
                    "amount": 2.5,
                    "sender": "00",
                    "recepient": "afe1158a37a242e9bddc1d1fd5560d3c",
                    "transactionId": "79f88c6d53194abaad2592afc7ec06af"
                }
            ],
            "nonce": 12019,
            "hash": "0000b29138c337680a5f21b5199e2fb6fede2953acbf91a7e66bd375c6a0bbf8",
            "previousBlockHash": "00004dd148f935c4b384755208625269bbe7ed231ad221e5d589dd281bf76898"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 2.5,
            "sender": "00",
            "recepient": "afe1158a37a242e9bddc1d1fd5560d3c",
            "transactionId": "584c04947bc24bc38624ccefd62bb628"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}

console.log('VALID: ', bitcoin.chainIsValid( bc1.chain));

//console.log(bitcoin);

// const previousBlockHash = 'OFJNE566FIJFKE456SJF'
// const currentBlockData = [
//     //Array of three transactions
//     {
//         amount: 10,
//         sender: 'NJNDL566FSDJLGKMFD',
//         recepient: 'NVKLSBL55JVLD4V',
//     },
//     {
//         amount: 80,
//         sender: 'NJNDL566FSFDKGGKMFD',
//         recepient: 'NVKLSBFJG3VLD4V66FJ',
//     },
//     {
//         amount: 30,
//         sender: 'LJLGDSGHGL56F5KLE',
//         recepient: 'JFLUZLIJ56FIIOG5',
//     }
// ];

// //const nonce= 100;

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 17302));

//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));

// bitcoin.createNewBlock(2389, 'OI14GFEMOS55ED', '1EFKZLC355SJKF0OEKS');

// bitcoin.createNewTransaction(100, 'ALEX89FLQWLSFOO0FDFS1DS5F','JEN4NKLGDNFN0489DSZ1F');

// bitcoin.createNewBlock(1576, 'FJKLVD3KSDGLS4SKL', 'JDGDLKGLDF25KGKM');

// bitcoin.createNewTransaction(50, 'ALEX89FLQWLSFOO0FDFS1DS5F','JEN4NKLGDNFN0489DSZ1F');
// bitcoin.createNewTransaction(300, 'ALEX89FLQWLSFOO0FDFS1DS5F','JEN4NKLGDNFN0489DSZ1F');
// bitcoin.createNewTransaction(2000, 'ALEX89FLQWLSFOO0FDFS1DS5F','JEN4NKLGDNFN0489DSZ1F');

// bitcoin.createNewBlock(1542, 'FVDGDFGDLS4SKL', 'JDGDLSDGSD2F25KGKM');

// console.log(bitcoin);
// console.log('--------------------------------------------');
// console.log(bitcoin.chain[1]);
// console.log(bitcoin.chain[2]);