import 'dotenv/config';
import minimist from 'minimist';
import { ethers } from 'ethers';

const argv = minimist(process.argv.slice(2));
const RPC = process.env.RPC_URL || 'https://rpc.ankr.com/eth';
const provider = new ethers.JsonRpcProvider(RPC);
const from = argv.from ? Number(argv.from) : (argv.blocks ? 'latest' : undefined);

async function scanTransfer(contractAddress, fromBlock, toBlock) {
  const filter = {
    address: contractAddress,
    topics: [ethers.id('MerkleRootChanged(bytes32)')] // example - change to real event
  };
  const logs = await provider.getLogs({ ...filter, fromBlock, toBlock });
  return logs.map(l => ({ txHash: l.transactionHash, data: l.data }));
}

(async ()=>{
  const res = await scanTransfer(process.env.CONTRACT_ADDRESS, argv.from || 0, argv.to || 'latest');
  console.log(JSON.stringify(res, null, 2));
})();
