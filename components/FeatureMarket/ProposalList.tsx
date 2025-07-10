import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers, formatEther } from 'ethers';
import {
  Box,
  Text,
} from '@chakra-ui/react';
// import { FeatureSponsorshipMarket } from '../../contractAbi/FeatureSponsorshipMarket';
import ProposalCard from './ProposalCard';

interface Proposal {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: number;
  stakeAmount: string;
  milestones: number;
  status: string;
  creator: string;
}

const ProposalList = () => {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProposals = async () => {
    if (!address) return;

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
        [], // FeatureSponsorshipMarket.abi - temporarily disabled
        // TODO: Replace with wagmi v2 signer
        null
      );

      const totalProposals = await contract.getTotalProposals();
      const proposalPromises = [];

      for (let i = 0; i < totalProposals.toNumber(); i++) {
        proposalPromises.push(contract.getProposal(i));
      }

      const proposalData = await Promise.all(proposalPromises);
      const formattedProposals = proposalData.map((proposal, index) => ({
        id: index.toString(),
        title: proposal.title,
        description: proposal.description,
        budget: formatEther(proposal.budget),
        deadline: proposal.deadline.toNumber(),
        stakeAmount: formatEther(proposal.stakeAmount),
        milestones: proposal.milestones.toNumber(),
        status: proposal.status,
        creator: proposal.creator,
      }));

      setProposals(formattedProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [address]);

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = filter === 'all' || proposal.status.toLowerCase() === filter;
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box p={6}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
          >
            <option value="all">All Proposals</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px' }}
          />
        </div>

        {filteredProposals.length === 0 ? (
          <Text>No proposals found</Text>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} onUpdate={fetchProposals} />
            ))}
          </div>
        )}
      </div>
    </Box>
  );
};

export default ProposalList;