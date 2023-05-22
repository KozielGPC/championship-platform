import React, { useEffect, useState } from 'react';
import {Box, Heading, Tabs, TabList, Tab, TabPanel, TabPanels, Image, Button, Select} from '@chakra-ui/react';
import { Championship, Team } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';


interface ChampionshipHeaderProps {
  championship?: Championship;
}

let cp: Championship;

const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ championship }) => {

  const [currentChampionship, setCurrentChampionships] = useState(cp);
  const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);
  const [teamsChampionship, setTeamsChampionship] = useState(Array<Team>);

  useEffect(
    () => {
        if(championship){
          setCurrentChampionships(championship);
          setTeamsChampionship(championship.teams)
    }
    },[]
  )

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(Number(event.target.value));
  };
 
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
                <TabPanel>{'tet'}</TabPanel>
                <TabPanel>{championship?.contact}</TabPanel>
            </TabPanels>
            </Tabs>
            <Heading h={'4vh'} size={'sm'} bottom={'100%'}>Selecione um time:</Heading>
            <Select
                  name="game_id"
                  value={selectedTeam || ''}
                  onChange={handleTeamChange}
                  >
                  <option value="">Selecione...</option>
                  {teamsChampionship.map((team) => (
                    <option key={team.id} value = {team.id}>
                      {team.name}
                    </option>
                  ))}
              </Select>
            <Button colorScheme='blue' position='fixed' left={'57%'} bottom={'35%'} size={'md'}>Join</Button>
        </Box>
  );
};


export default ChampionshipHeader;