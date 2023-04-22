import React from 'react';
import { Box, Flex, Spacer, Button } from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

 

  return (
    <Box>
      <Flex align="center" p="4">
        <Box>
          <h1>Logo</h1>
        </Box>
        <Spacer />
        <SignoutButton/>
      </Flex>
      <Box p="4">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;