import React from 'react';
import { Link, Box, Text, Icon, Grid, GridItem, Avatar, Stack, AvatarBadge, Flex} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { MdAdd, MdOutlineSupervisorAccount, MdOutlineVideogameAsset } from 'react-icons/md'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { id,username} = useContext(UserContext);
 
 return(
    <Flex  width={"100%"} height={"100vh"} color='blackAlpha.700'>
      <Box bgColor={"gray.700"} width={"20%"} height={"100vh"}>
        <Flex
          w="100%"
          borderBottomWidth="1px"
          borderColor="white" 
          borderStyle="solid">
          <Box >
            <SignoutButton/>
          </Box>
          <Text color="#00EEEE"
          textAlign="center" 
          pt="10px" pb="10px" >
            JuegosHub
          </Text>
        </Flex> 
        <Link href='/profile'>
          <Box
            color="#00EEEE"
            borderBottomWidth="1px"
            borderColor="white" 
            borderStyle="solid" 
            pt="5px" pb="5px"
            >
              <Flex flexDir="column" alignItems={'center'} justifyContent={"center"} pl='15px' p="10px" pb="5px">
                <Avatar> 
                    <AvatarBadge boxSize='1em' bg='green.500' />
                </Avatar>
                <Box pt="5px" pl="5px" pr="5px">
                  <Text >
                    {username}
                  </Text>
                </Box>
              </Flex>
          </Box>
        </Link> 
        <Box display="inline-block" textAlign={'left'} textColor='white'>
        <Box p='10px'>
          <Link
              pt='5px'
              pb='10px'
              display='flex' href='/profile/teams'>
            <Icon boxSize='25px' as={MdOutlineSupervisorAccount} />
            <Flex pl="5px" >My teams</Flex>
          </Link>
          <Link 
              pt='5px'
              pb='10px'
              display='flex' href='/profile/championships' >
            <Icon boxSize='25px' as={MdOutlineVideogameAsset} />
            <Flex pl="5px" >My championships</Flex>
          </Link>
          <Link
              pt='5px'
              pb='10px' 
              display='flex' href='/profile/championships/new'>
            <Icon boxSize='25px' as={MdAdd} />
            <Flex pl="5px">Create Championship</Flex>
          </Link>
        </Box>
      </Box>

      </Box>
      <Box overflow={'auto'}
       bgColor={'#4A5568'} width={"80%"} height={"100vh"}>
        {children}
      </Box>
    </Flex>
 );
 
};


export default Layout;