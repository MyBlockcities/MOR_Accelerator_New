import React, { useState } from 'react';
// Note: Migrated from ethers to wagmi v2/viem
import { usePublicClient, useWalletClient } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeveloperBiddingProps {
  featureId: number;
}

const DeveloperBidding: React.FC<DeveloperBiddingProps> = ({ featureId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Replace with your actual contract address and ABI
      const contractAddress = 'YOUR_CONTRACT_ADDRESS';
      const contractABI = []; // Add your contract ABI here

      // TODO: Convert walletClient to ethers signer using adapters
      throw new Error('DeveloperBidding component needs to be updated to use wagmi v2');

      // TODO: Uncomment when component is properly migrated to wagmi v2
      // const tx = await contract.submitBid(featureId, ethers.utils.parseEther(bidAmount), timeEstimate);
      // await tx.wait();
      // toast.success('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Error submitting bid');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Submit Bid for Feature #{featureId}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Bid Amount (MOR)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Time Estimate (in days)</label>
          <input
            type="number"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Bid
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default DeveloperBidding;