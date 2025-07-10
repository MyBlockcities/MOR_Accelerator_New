import { NextApiRequest, NextApiResponse } from 'next';

// TODO: Replace with actual contract integration when ABI is available

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Mock network statistics - TODO: Replace with actual blockchain data
        console.warn('API network stats: Using mock data - contract integration needed');
        
        const mockStats = {
          totalSupply: '1000000000000000000000000', // 1M tokens
          circulatingSupply: '750000000000000000000000', // 750K tokens
          burnedTokens: '50000000000000000000000', // 50K burned
          marketCap: '50000000', // $50M USD
          price: '50.00', // $50 per token
          priceChange24h: '+5.2',
          volume24h: '2500000', // $2.5M daily volume
          holders: 15420,
          totalTransactions: 145672,
          dailyTransactions: 1247,
          networkHashRate: '125.5', // TH/s
          difficulty: '15.6T',
          avgBlockTime: '15.2', // seconds
          tps: 82.1, // transactions per second
          gasPrice: '25', // gwei
          validatorCount: 425,
          stakingRatio: '0.65', // 65% staked
          lastUpdated: Date.now()
        };

        res.status(200).json(mockStats);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Network stats API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}