import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import StakingForm from '../components/staking/StakingForm';
import StakingDashboard from '../components/staking/StakingDashboard';
import RewardDistributionDashboard from '../components/staking/RewardDistributionDashboard';
import PowerFactorInfo from '../components/staking/PowerFactorInfo';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { STAKING_NETWORKS } from '../contracts/config/stakingConfig';

const StakingPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  // Default pool ID - in a real implementation, this would be fetched or selected by the user
  const poolId = '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`;
  
  // Check if current network is supported
  const isNetworkSupported = chainId && 
    (chainId === STAKING_NETWORKS.ARBITRUM.chainId || chainId === STAKING_NETWORKS.BASE.chainId);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          MOR Token Staking
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Stake your MOR tokens to earn rewards with time-based power factor boosts.
          The longer you stake, the higher your power factor and rewards.
        </Typography>
        
        {!isConnected && (
          <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Connect your wallet to start staking
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You need to connect your wallet to stake MOR tokens and view your staking information.
            </Typography>
          </Box>
        )}
        
        {isConnected && !isNetworkSupported && (
          <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Switch to a supported network
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              MOR staking is available on Arbitrum and Base networks.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => switchChain?.({ chainId: STAKING_NETWORKS.ARBITRUM.chainId })}
                sx={{ mr: 2 }}
              >
                Switch to Arbitrum
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => switchChain?.({ chainId: STAKING_NETWORKS.BASE.chainId })}
              >
                Switch to Base
              </Button>
            </Box>
          </Box>
        )}
        
        {isConnected && isNetworkSupported && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StakingForm poolId={poolId} />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <StakingDashboard poolId={poolId} />
            </Grid>
            
            <Grid size={12}>
              <PowerFactorInfo />
            </Grid>
            
            <Grid size={12}>
              <RewardDistributionDashboard />
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default StakingPage;
