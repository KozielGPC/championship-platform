import React, { useEffect, useState } from 'react';
import { Link, LinkBox, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Championship } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';


interface ChampionshipProps {
  championships: Array<Championship>;
}

const ShowChampionships: React.FC<ChampionshipProps> = ({ championships }) => {

  const [championships_state, setChampionships] = useState(Array<Championship>);

  useEffect(
    () => {
        setChampionships(championships);
    },[championships]
  )
 
  return (
        <Box>
            {championships_state ? championships_state.map(championship => <ChampionshipPreview championship={championship}></ChampionshipPreview>)
                    :<></>}
        </Box>
  );
};


export default ShowChampionships;