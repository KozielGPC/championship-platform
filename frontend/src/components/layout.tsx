import React from 'react';
import { Box, Flex, Spacer, Button, Text, StackDivider, VStack} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { id,username} = useContext(UserContext);
 

  return (
    <Flex height="100vh">
      <Box bg="red.500" w="25%">
        <Flex align="center" justify="center" h="10%" borderBottom="1px solid #E2E8F0">
          <Text fontSize="lg" fontWeight="bold">
            Championship Plataform
          </Text>
        </Flex>
        <Flex direction="column" h="90%" justify="space-between">
          <Box>
            {/* aqui ficaria o menu */}
          </Box>
          <Box p="4">
            <SignoutButton/>
          </Box>
        </Flex>
      </Box>
      <Box bg="white" w="75%">
        <Box bg="yellow.500" h="90%">
          {children} {/* conteudo principal ficaria aqui*/}
        </Box> 
        <Box bg="green.500" h="10%">
          <Text fontSize="lg" fontWeight="bold">
            RODAPÉ
          </Text>
        </Box> 
      </Box>
    </Flex>
  );
};


export default Layout;