import React, { useEffect, useState } from 'react';
import {Box, Heading, Tabs, TabList, Tab, TabPanel, TabPanels, Image, Button} from '@chakra-ui/react';
import { Championship } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';


interface ChampionshipHeaderProps {
  championship?: Championship;
}

let cp: Championship;

const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ championship }) => {

  const [currentChampionship, setCurrentChampionships] = useState(cp);

  useEffect(
    () => {
        if(championship){
          setCurrentChampionships(championship);
    }
    },[]
  )
 
  return (
        <Box>
            <Heading textAlign={'center'} pt={'20px'} h={'10vh'}>
               {championship?.name}
            </Heading>
            <Tabs colorScheme={'blackAlpha'} size={'lg'} textAlign={'center'} align={'center'} borderColor={'black'}>
                <TabList>
                    <Tab>Regras</Tab>
                    <Tab>Premiação</Tab>
                    <Tab>Equipes</Tab>
                    <Tab>Contato</Tab>
                </TabList>

            <TabPanels>
                <TabPanel>{championship?.rules}</TabPanel>
                <TabPanel>{championship?.prizes}</TabPanel>
                <TabPanel>Esperando tabela de relacionamento campeonato e equipe</TabPanel>
                <TabPanel>{championship?.contact}</TabPanel>
            </TabPanels>
            </Tabs>
            <Button colorScheme='blue' position='fixed' right={'4'} bottom={'15'} size={'md'}>Join</Button>
        </Box>
  );
};


export default ChampionshipHeader;