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
      <Link href={`/championship/${championship.id}`}>
        
        <Box m="15px" color={"white"} bgColor={"#161B22"}
          width={"300px"} height={"250px"} 
          borderRadius="10px" border='1px solid white'
        >
          <Image
            borderTopRadius="10px"
            width={"100%"}
            maxHeight={'150px'}
            objectFit={'cover'}
            overflow={'hidden'}
            alt={'lol-image'}
            src={
              championship.game_id == 1 
              ?'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcStJOZJ8I6GWv1kqOJVgJL7EsLYfLmiL-Vxbu7BpPrurPsUHXvE'
              : 'https://viendidong.com/wp-content/uploads/2022/12/valorant-thumb-vdd-viendidong.jpg'
            }
            />
               <Text 
                fontWeight={'bold'}
                p={2}
                textOverflow={'ellipsis'} 
                whiteSpace='nowrap' 
                overflow='hidden'
               >
                {championship.name}
               </Text>
               <Flex justifyContent={'space-between'}
                p={2}
               >
                <Text>
                  {
                  new Date(championship.start_time)
                  .toLocaleDateString("en-US",{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  }
                </Text>
                <Text>
                  Máx. Teams: {championship.max_teams}
                </Text>

               </Flex>
         
            </Box>
      </Link>
  );
};


export default ChampionshipPreview;