import React, { useState } from 'react';
import { parseEther } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeatureRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [morAmount, setMorAmount] = useState('');
  const [milestones, setMilestones] = useState('1');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!walletClient) {
        toast.error('Please connect your wallet');
        return;
      }

      // Replace with your actual contract address and ABI
      const contractAddress = 'YOUR_CONTRACT_ADDRESS' as `0x${string}`;
      const contractABI: any[] = []; // Add your contract ABI here

      // Note: This component needs to be updated with actual contract integration
      // For now, showing the pattern for viem usage with proper transaction handling
      
      if (!publicClient) {
        toast.error('Network not connected');
        return;
      }

      const txHash = await walletClient.writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'createFeatureRequest',
        args: [
          title,
          description,
          parseEther(morAmount),
          BigInt(parseInt(milestones))
        ],
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      
      if (receipt.status === 'success') {
        toast.success('Feature request submitted successfully!');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error submitting feature request:', error);
      toast.error('Error submitting feature request');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-neuromorphic">
      <h2 className="text-3xl font-bold mb-6 text-white">Submit Feature Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-inner-neuromorphic focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-inner-neuromorphic focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-300">MOR Amount</label>
          <input
            type="number"
            value={morAmount}
            onChange={(e) => setMorAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-inner-neuromorphic focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-300">Number of Milestones</label>
          <select
            value={milestones}
            onChange={(e) => setMilestones(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-inner-neuromorphic focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-neuromorphic hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Submit Request
        </button>
      </form>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default FeatureRequest;