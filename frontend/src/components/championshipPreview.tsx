import React, { useEffect, useState } from 'react';
import { Link, LinkBox, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration} from '@chakra-ui/react';
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
        console.log(championship_state)
    },[championship]
  )
 
  return (
        <Box>
            <Text>
                {championship_state.name}
            </Text>
        </Box>
  );
};


export default ChampionshipPreview;