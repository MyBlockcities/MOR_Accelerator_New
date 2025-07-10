import { NextApiRequest, NextApiResponse } from 'next';

// TODO: Replace with actual contract integration when ABI is available

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Mock proposals data - TODO: Replace with actual contract calls
        console.warn('API proposals: Using mock data - contract integration needed');
        
        const mockProposals = [
          {
            id: '1',
            title: 'Enhanced Dashboard UI',
            description: 'Improve the main dashboard with better UX and analytics',
            budget: '1000',
            deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
            stakeAmount: '100',
            milestones: 3,
            status: 'Open',
            creator: '0x1234567890123456789012345678901234567890',
            selectedDeveloper: ''
          },
          {
            id: '2',
            title: 'Mobile App Development',
            description: 'Create a mobile application for the platform',
            budget: '5000',
            deadline: Date.now() + 60 * 24 * 60 * 60 * 1000,
            stakeAmount: '500',
            milestones: 5,
            status: 'Open',
            creator: '0x1234567890123456789012345678901234567890',
            selectedDeveloper: ''
          }
        ];

        res.status(200).json(mockProposals);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}