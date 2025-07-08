import React, { useState } from 'react';
// TODO: Re-enable these imports when component is fixed
// import { useAccount } from 'wagmi';
// import { ethers } from 'ethers';
// import { FeatureSponsorshipMarket } from '../../contractAbi/FeatureSponsorshipMarket';

const CreateProposal = () => {
  // TODO: Fix Chakra UI FormControl imports and wagmi v2 migration
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Create Proposal (Under Development)</h2>
      <p>This component is being migrated to wagmi v2 and will be available soon.</p>
    </div>
  );
  
  /* Temporarily commented out until Chakra UI and wagmi v2 migration is complete
  const { address } = useAccount();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    stakeAmount: '',
    milestones: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      // TODO: Replace with wagmi v2 signer implementation
      throw new Error('CreateProposal component needs wagmi v2 migration');
      
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
        FeatureSponsorshipMarket.abi,
        null // signer placeholder
      );

      const tx = await contract.createProposal(
        formData.title,
        formData.description,
        ethers.utils.parseEther(formData.budget),
        Math.floor(new Date(formData.deadline).getTime() / 1000),
        ethers.utils.parseEther(formData.stakeAmount),
        Number(formData.milestones)
      );

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Proposal created successfully',
        status: 'success',
        duration: 5000,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        stakeAmount: '',
        milestones: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proposal',
        status: 'error',
        duration: 5000,
      });
      console.error(error);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="xl" boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <div>
            <label>Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Feature proposal title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed feature description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Budget (MOR)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                name="budget"
                value={formData.budget}
                onChange={(value) => handleInputChange({
                  target: { name: 'budget', value }
                } as any)}
                placeholder="Total budget in MOR tokens"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Deadline</FormLabel>
            <Input
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Stake Amount (MOR)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                name="stakeAmount"
                value={formData.stakeAmount}
                onChange={(value) => handleInputChange({
                  target: { name: 'stakeAmount', value }
                } as any)}
                placeholder="Required stake amount in MOR"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Number of Milestones</FormLabel>
            <NumberInput min={1} max={10}>
              <NumberInputField
                name="milestones"
                value={formData.milestones}
                onChange={(value) => handleInputChange({
                  target: { name: 'milestones', value }
                } as any)}
                placeholder="Number of development milestones"
              />
            </NumberInput>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isDisabled={!address}
          >
            Create Proposal
          </Button>
        </VStack>
      </form>
    </Box>
  );
  */
};

export default CreateProposal;