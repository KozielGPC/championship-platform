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
        <Box textColor={'white'}>
          <Image
            align={'5'}
            borderTopRadius="10px"
            width={"100%"}
            maxHeight={'200px'}
            objectFit={'contain'}
            overflow={'hidden'}
            alt={'lol-image'}
            src={
              championship?.game_id == 1 
              ?'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcStJOZJ8I6GWv1kqOJVgJL7EsLYfLmiL-Vxbu7BpPrurPsUHXvE'
              : 'https://viendidong.com/wp-content/uploads/2022/12/valorant-thumb-vdd-viendidong.jpg'
            }
            />
            <Heading textAlign={'center'} pt={'20px'} h={'10vh'}>
               {championship?.name}
            </Heading>
            <Tabs marginTop={'5'} colorScheme={'whiteAlpha'} size={'md'} textAlign={'center'} align={'center'} borderColor={'white'} isFitted={true}>
                <TabList>
                    <Tab>Rules</Tab>
                    <Tab>Prizes</Tab>
                    <Tab>Teams</Tab>
                    <Tab>Contact</Tab>
                </TabList>
            <TabPanels>
                <TabPanel>{championship?.rules}</TabPanel>
                <TabPanel>{championship?.prizes}</TabPanel>
                <TabPanel>{'Listagem de time'}</TabPanel>
                <TabPanel>{championship?.contact}</TabPanel>
            </TabPanels>
            </Tabs>
            <Heading h={'4vh'} size={'sm'} textAlign={'center'} marginTop={'200px'} bottom={'10'}>Select a team:</Heading>
            <Select
                  size={'sm'}
                  left={'1'}
                  width={"99%"}
                  iconSize={'100px'}
                  name="game_id"
                  value={selectedTeam || ''}
                  onChange={handleTeamChange}
                  >
                  <option value="">Select...</option>
                  {teamsChampionship.map((team) => (
                    <option key={team.id} value = {team.id}>
                      {team.name}
                    </option>
                  ))}
              </Select>
            <Button colorScheme='blue' left={'47%'} size={'md'} top={'3'} marginBottom={'25'}>Join</Button>
        </Box>
  );
};


export default ChampionshipHeader;