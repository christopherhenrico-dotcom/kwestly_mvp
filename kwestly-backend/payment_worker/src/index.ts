// payment-worker/src/index.ts
import express from 'express';
import { createPublicClient, createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const app = express();
app.use(express.json());

// Your hot wallet private key (NEVER commit this)
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// USDC contract on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

app.post('/api/payments/process', async (req, res) => {
  // Verify internal API key
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { worker_wallet, amount } = req.body;
  
  try {
    // Send USDC transfer
    const hash = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: [{
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
      }],
      functionName: 'transfer',
      args: [worker_wallet, BigInt(amount * 1e6)], // USDC has 6 decimals
    });
    
    // Wait for confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    
    res.json({ tx_hash: hash });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.listen(3001, () => {
  console.log('Payment worker running on :3001');
});