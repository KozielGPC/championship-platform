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
 

  return (
    <Grid
      templateAreas={`"nav main"
                      "nav footer"`}

      gridTemplateRows={'100% 15vh'}
      gridTemplateColumns={'20% 80%'}
      gap='0'
      color='blackAlpha.700'
      fontWeight='bold'
    >
      <GridItem pl='2' bg='gray.700' area={'nav'}
        borderRightWidth="4px"
        borderRightColor="#00B3B2"
        borderStyle="solid"
      >
        <Box position="fixed" top="0" left="0">
            <Grid
              templateAreas={`"nav_main"`}
              gridTemplateRows={'100vh'}
              gridTemplateColumns={'38vh'}
              gap='0'
              color='#003C3B'
              fontWeight='bold'
            >
              <Box position="relative" w="100%" h="100%">
                <Box color="#00EEEE"
                  borderBottomWidth="1px"
                  borderColor="white" 
                  borderStyle="solid" 
                  textAlign="center" 
                  pt="10px" pb="10px" 
                  w="100%">
                    JuegosHub
                </Box>
                <Link href='/myprofile'>
                  <Box
                    color="#00EEEE"
                    borderBottomWidth="1px"
                    borderColor="white" 
                    borderStyle="solid" 
                    pt="5px" pb="5px" 
                    w="100%">
                      <Box display="inline-block" pl='15px' p="10px" pb="5px">
                        <Stack direction='row' spacing={4}>
                          <Avatar>
                            <AvatarBadge boxSize='1em' bg='green.500' />
                          </Avatar>
                        </Stack>
                        <Box pt="5px" pl="5px" pr="5px">
                          <Text >
                            {username}
                          </Text>
                        </Box>
                      </Box>
                  </Box>
                </Link>

                <Box display="inline-block" textAlign={'left'} textColor='white'>
                  <Box p='10px'>
                    <Link
                        pt='5px'
                        pb='10px'
                        display='flex' href='/myteams' isExternal>
                      <Icon boxSize='25px' as={MdOutlineSupervisorAccount} />
                      <Flex pl="5px" >My teams</Flex>
                    </Link>
                    <Link 
                        pt='5px'
                        pb='10px'
                        display='flex' href='/mychampionships' isExternal>
                      <Icon boxSize='25px' as={MdOutlineVideogameAsset} />
                      <Flex pl="5px" >My championships</Flex>
                    </Link>
                    <Link
                        pt='5px'
                        pb='10px' 
                        display='flex' href='/mychampionships/new' isExternal>
                      <Icon boxSize='25px' as={MdAdd} />
                      <Flex pl="5px">Create Championship</Flex>
                    </Link>
                  </Box>
                </Box>
                <Box position="absolute" left="10px" bottom="10px"><SignoutButton></SignoutButton></Box>
              </Box>
            </Grid>
        </Box>

          
      </GridItem>
      <GridItem pl='2' bg='gray.600' area={'main'}>
        <Box minHeight='70vh'>
          {children}          
        </Box>
      </GridItem>
      <GridItem pl='2' bg='#007777' area={'footer'}>
        <Box textColor="white">
          Footer     
        </Box>
      </GridItem>
    </Grid>
  );
};


export default Layout;