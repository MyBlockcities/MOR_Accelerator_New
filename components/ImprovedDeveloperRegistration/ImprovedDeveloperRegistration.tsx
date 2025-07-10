import React, { useState } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
// TODO: Re-enable when services folder is fixed
// import { createContractService } from '../../services/ModernContractService';
import 'react-toastify/dist/ReactToastify.css';

const DeveloperRegistration: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');
  const [morpheusId, setMorpheusId] = useState('');
  const [experience, setExperience] = useState('');
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const signer = useEthersSigner();

  const toggleModal = () => setIsOpen(!isOpen);

  const handleCapabilityChange = (capability: string) => {
    if (capabilities.includes(capability)) {
      setCapabilities(capabilities.filter(c => c !== capability));
    } else {
      setCapabilities([...capabilities, capability]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !signer) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!name || !githubRepo || !experience || capabilities.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        toast.error('Failed to get signer');
        return;
      }

      // Developer Registry Contract ABI for registration
      const developerRegistryABI = [
        {
          "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_githubUsername", "type": "string" },
            { "internalType": "string[]", "name": "_capabilities", "type": "string[]" },
            { "internalType": "string", "name": "_portfolioUrl", "type": "string" }
          ],
          "name": "registerDeveloper",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      // Note: This would need to be deployed and the actual address provided
      // For now, using a placeholder that matches our contract structure
      const contractAddress = process.env.NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000';
      
      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        toast.error('Developer Registry contract not deployed yet. Please contact administrators.');
        return;
      }

      const contract = new Contract(contractAddress, developerRegistryABI, resolvedSigner);

      // Create portfolio URL from GitHub repo if provided
      const portfolioUrl = githubRepo || `https://github.com/${githubRepo}`;

      const tx = await contract.registerDeveloper(
        name,
        githubRepo, // Using as GitHub username
        capabilities,
        portfolioUrl
      );
      
      toast.info('Transaction submitted, waiting for confirmation...');
      await tx.wait();
      
      toast.success('Developer registered successfully!');
      
      // Reset form
      setName('');
      setCapabilities([]);
      setGithubRepo('');
      setMorpheusId('');
      setExperience('');
      toggleModal();
    } catch (error: any) {
      console.error('Error registering developer:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.message?.includes('already registered')) {
        toast.error('Developer already registered');
      } else {
        toast.error('Error registering developer. Please try again.');
      }
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Register as Developer
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Register as Developer</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capabilities:
                </label>
                {['Frontend', 'Backend', 'Smart Contracts', 'UI/UX Design', 'DevOps'].map((capability) => (
                  <div key={capability}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCapabilityChange(capability)}
                      />
                      <span className="ml-2">{capability}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  GitHub Repo:
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Morpheus Developer ID (optional):
                </label>
                <input
                  type="text"
                  value={morpheusId}
                  onChange={(e) => setMorpheusId(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Experience (years):
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DeveloperRegistration;