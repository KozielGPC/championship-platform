import React from 'react';
import { Box, Flex, Spacer, Button,Text } from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { id,username} = useContext(UserContext);
 

  return (
    <Box w={"100%"} height="100vh">
      <Flex height={'6vh'} align="center" p="4" bg={'#f9f9f9'} position="fixed" width={"100%"}>
        <Box>
          <h1>Logo</h1>
        </Box>
        <Text ml="20px"> 
          <>Olá {username}; ID: {id}</>
        </Text>
        <Spacer />
        <SignoutButton/>
      </Flex>
      <Box bg={"black"} width="100%" height={"6vh"} ></Box>
        {children}
    </Box>
  );
};

export default Layout;