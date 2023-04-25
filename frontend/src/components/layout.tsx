import React from 'react';
import { Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
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
        borderRightColor="white"
        borderStyle="solid"
      >
        <Box position="fixed" top="0" left="0">
            <Grid
              templateAreas={`"nav_main"`}
              gridTemplateRows={'100vh'}
              gridTemplateColumns={'38vh'}
              gap='0'
              color='blackAlpha.700'
              fontWeight='bold'
            >
              <Box position="relative" w="100%" h="100%">
                <Box color="White" borderBottomWidth="1px" borderColor="white" borderStyle="solid" textAlign="center" pt="10px" pb="10px" w="100%">JuegosHub</Box>
                <Box position="absolute" left="10px" bottom="10px"><SignoutButton></SignoutButton></Box>
              </Box>
            </Grid>
        </Box>

          
      </GridItem>
      <GridItem pl='2' bg='gray.600' area={'main'}>
        <Box>
          {children}
          Main
        </Box>
        <Box>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
        </Box>
      </GridItem>
      <GridItem pl='2' bg='green.600' area={'footer'}>
        <Box>
          Footer
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quas eum itaque ea illum vero, voluptatem, iste aliquid sequi ut labore! Molestias recusandae ratione, quisquam similique iure voluptas sint perspiciatis?
          
        </Box>
      </GridItem>
    </Grid>
  );
};


export default Layout;