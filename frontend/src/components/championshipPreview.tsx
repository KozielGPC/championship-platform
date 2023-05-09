import React, { useEffect, useState } from 'react';
import { Link, LinkBox, Image, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Championship } from '@/interfaces';


interface ChampionshipPreviewProps {
  championship: Championship;
}

let cp: Championship;

const ChampionshipPreview: React.FC<ChampionshipPreviewProps> = ({ championship }) => {

  const [championship_state, setChampionship] = useState(cp);

  useEffect(
    () => {
        setChampionship(championship);
    },[championship]
  )
 
  return (
      <Link href={`/profile/championships/${championship.id}`}>
        <Box m="15px" display='inline-block'>
          <Grid
            minH={'300px'} maxHeight={'300px'} //tamanho fixo para os campeonatos
            templateAreas={`"header"
            "main"`}
            gridTemplateRows={'45% 55%'}
            gridTemplateColumns={'300px'}
            color='blackAlpha.700'
            fontWeight='bold'

            borderRadius="10px"
            borderStyle='solid'
            borderColor='white'
            borderWidth='2px' 
          >
            <GridItem
              display={'inline-block'} area={'header'}>
                <Box minHeight={'200px'} height={'100%'}>
                  <Image borderRadius="10px" src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcStJOZJ8I6GWv1kqOJVgJL7EsLYfLmiL-Vxbu7BpPrurPsUHXvE' alt='Dan Abramov' />
                </Box>
            </GridItem>
            <GridItem 
              borderBottomRadius="10px" bg={'#161B22'} area={'main'}>
                <Box maxHeight={'300px'}>
                  <Grid
                    templateAreas={`"name name name"
                                    "data data prizes"`}
                    gridTemplateRows={'100% 100%'}
                    gridTemplateColumns={'35% 35% 30%'}
                    color='blackAlpha.700'
                  >
                    <GridItem textShadow="2px 2px #2D3748" textColor={'white'} pt="15px" p="10px" pb="0"
                      area={'name'}
                    >
                        {championship.name} lorem
                        
                    </GridItem>
                    <GridItem textShadow="2px 2px #2D3748" textColor={'white'} pr="0px" p="10px" pb="0" pt="0"
                      area={'data'}
                    >
                        {championship.start_time}
                    </GridItem>
                    <GridItem textShadow="2px 2px #2D3748" textColor={'white'} pl='0px'
                      area={'prizes'}
                    >
                        {(championship.prizes != null)?"Prizes on": "Prizes off"}
                    </GridItem>
                  </Grid>
                </Box>
            </GridItem>
        </Grid>
        </Box>
      </Link>
  );
};


export default ChampionshipPreview;