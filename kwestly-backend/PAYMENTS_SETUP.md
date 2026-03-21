# Payments Setup - Base Network

## Test Network Configuration (Base Sepolia)

### Network Details
- **Chain ID**: 84532
- **Network Name**: Base Sepolia
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: https://sepolia.basescan.org

### Test USDC Contract
- **Address**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Decimals**: 6
- **Symbol**: USDC

### Test Wallet Setup

#### Option 1: Use Anvil (Local Test)
```bash
# Start anvil (from foundry)
anvil

# Use the first private key (default)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae78caef9f8739c4
```

#### Option 2: MetaMask Test Wallet
1. Add Base Sepolia network to MetaMask
2. Create a new account
3. Export private key and add to `.env`

#### Option 3: Coinbase Faucet
1. Get test ETH from: https://faucet.base.org/
2. Get test USDC from the faucet or mint contract

### Environment Variables

Create `payment_worker/.env`:
```bash
# Base Sepolia RPC
BASE_RPC_URL=https://sepolia.base.org

# Test wallet private key (Anvil default)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae78caef9f8739c4

# USDC contract on Base Sepolia
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Internal API key (match with PocketBase)
INTERNAL_API_KEY=your-secret-key-here

# Railway deployment URL
BASE_URL=https://beneficial-strength-production-7d7b.up.railway.app

# Server port
PORT=3001
```

### API Endpoints

#### Process Payment
```http
POST /api/payments/process
Content-Type: application/json
X-Internal-Key: your-internal-api-key

{
  "worker_wallet": "0x...",
  "amount": 100  // USDC amount (will be multiplied by 1e6)
}
```

Response:
```json
{
  "success": true,
  "tx_hash": "0x...",
  "block_number": 123456,
  "status": "success"
}
```

#### Check Balance
```http
GET /api/payments/balance
```

#### Health Check
```http
GET /health
```

### Production (Base Mainnet)

When ready for production:
- **Chain ID**: 8453
- **RPC URL**: `https://mainnet.base.org`
- **USDC Address**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Block Explorer**: https://basescan.org

### Security Notes

⚠️ **NEVER commit private keys to git**
⚠️ **Use environment variables for all secrets**
⚠️ **Test on Sepolia before mainnet**
⚠️ **Implement rate limiting in production**
