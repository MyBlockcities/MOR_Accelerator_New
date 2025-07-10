import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
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
      // Note: Using mock data during wagmi v2 migration
      // TODO: Implement real contract integration with viem
      // const contract = getContract({
      //   address: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS as `0x${string}`,
      //   abi: [], // FeatureSponsorshipMarket.abi
      //   client: publicClient
      // });

      // Using mock data during wagmi v2 migration
      const formattedProposals = [
        {
          id: '1',
          title: 'Sample Proposal',
          description: 'This is a placeholder proposal during wagmi v2 migration',
          budget: '1000.0',
          deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
          stakeAmount: '100.0',
          milestones: 3,
          status: 'active',
          creator: '0x1234567890123456789012345678901234567890',
        }
      ];

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