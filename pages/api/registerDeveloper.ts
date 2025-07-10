// pages/api/registerDeveloper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import admin from '../../firebaseAdmin';

// Comprehensive input validation schema as per security roadmap
const developerRegistrationSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum wallet address format"
  }),
  githubRepo: z.string().url({ 
    message: "Must be a valid GitHub repository URL" 
  }).max(200, {
    message: "GitHub repository URL must be less than 200 characters"
  }),
  capabilities: z.array(z.string().min(1).max(50)).max(20, {
    message: "Maximum 20 capabilities allowed"
  }),
  morpheusId: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Apply Zod validation with proper error handling
      const validationResult = developerRegistrationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Input validation failed',
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      const { walletAddress, capabilities, githubRepo, morpheusId } = validationResult.data;

      // Create a new document in the 'developers' collection with validated data
      const db = admin.firestore();
      const docRef = await db.collection('developers').add({
        walletAddress,
        capabilities,
        githubRepo,
        morpheusId: morpheusId || null,
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error('Error registering developer:', error);
      res.status(500).json({ error: 'Failed to register developer' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}