import { NextApiRequest, NextApiResponse } from 'next';

// TODO: Replace with actual contract integration when ABI is available

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        // Mock proposal data - TODO: Replace with actual contract calls
        console.warn('API proposal detail: Using mock data - contract integration needed');
        
        const mockProposal = {
          id: id as string,
          title: id === '1' ? 'Enhanced Dashboard UI' : 'Mobile App Development',
          description: id === '1' 
            ? 'Improve the main dashboard with better UX and analytics'
            : 'Create a mobile application for the platform',
          budget: id === '1' ? '1000' : '5000',
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
          stakeAmount: id === '1' ? '100' : '500',
          milestones: id === '1' ? 3 : 5,
          status: 'Open',
          creator: '0x1234567890123456789012345678901234567890',
          selectedDeveloper: ''
        };

        if (!mockProposal) {
          return res.status(404).json({ error: 'Proposal not found' });
        }

        res.status(200).json(mockProposal);
        break;

      case 'PUT':
        // Mock proposal update - TODO: Replace with actual contract calls
        console.warn('API proposal update: Using mock data - contract integration needed');
        res.status(200).json({ success: true, message: 'Proposal updated (mock)' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}