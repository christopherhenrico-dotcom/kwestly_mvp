// payment-worker/src/index.ts
import express, { Request, Response } from 'express';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const app = express();
app.use(express.json());

// Test wallet account (use environment variable in production)
const account = privateKeyToAccount((process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae78caef9f8739c4') as `0x${string}`);

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL || 'https://sepolia.base.org'),
});

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL || 'https://sepolia.base.org'),
});

// USDC contract on Base Sepolia (6 decimals)
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// Minimal ERC20 ABI for USDC transfers
const ERC20_ABI = [{
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  outputs: [{ type: 'bool' }],
  stateMutability: 'nonpayable',
}];

app.post('/api/payments/process', async (req: Request, res: Response) => {
  // Verify internal API key
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { worker_wallet, amount } = req.body;
  
  if (!worker_wallet || !amount) {
    return res.status(400).json({ error: 'Missing required fields: worker_wallet, amount' });
  }
  
  try {
    // USDC has 6 decimals
    const usdcAmount = BigInt(Math.floor(amount * 1e6));
    
    // Send USDC transfer
    const hash = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [worker_wallet as `0x${string}`, usdcAmount],
    });
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log('Payment successful:', hash);
    res.json({ 
      success: true,
      tx_hash: hash,
      block_number: receipt.blockNumber,
      status: receipt.status 
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: 'Payment failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', chain: 'base-sepolia' });
});

// Get wallet balance endpoint
app.get('/api/payments/balance', async (req: Request, res: Response) => {
  try {
    const balance = await publicClient.getBalance({ address: account.address });
    res.json({ 
      address: account.address,
      balance: balance.toString(),
      eth: Number(balance) / 1e18
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Payment worker running on :${PORT}`);
});
