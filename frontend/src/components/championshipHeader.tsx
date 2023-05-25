import React, { useEffect, useState } from 'react';
import {Box, Heading, Tabs, TabList, Tab, TabPanel, TabPanels, Image, Button, Select, useToast} from '@chakra-ui/react';
import { Championship, Team } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';
import axios from 'axios';
import { addTeam } from '@/services/championship/add';
import { useRouter } from 'next/router';
import { ConfirmModal } from './confirmModal';

interface ChampionshipTeam {
  team_id: number;
  championship_id?: number;
}

interface ChampionshipHeaderProps {
  championship?: Championship;
  teams?: Array<Team>;
  championshipTeams?: Array<Team>;
}

let ct: ChampionshipTeam;


const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ championship, teams, championshipTeams }) => {

  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<number>(0);
  const toast = useToast();
  const [teamsChampionship, setTeamsChampionship] = useState(Array<Team>);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);




  useEffect(
    () => {
        if(championshipTeams){
          setTeamsChampionship(championshipTeams);
      }
    },[]
  )

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(Number(event.target.value));
  };

  function handleConfirmModal(){
    setIsOpenConfirmModal(true);
  }


  const handleButtonClick = async () => {
        setIsLoading(true)     
        const championshipTeam: ChampionshipTeam = {
          team_id: selectedTeam,
          championship_id: championship?.id}
        const response = await addTeam(championshipTeam);
      
        if(response){
          toast(
            {
              title: response.message,
              status: response.status,
              duration: 3000,
              isClosable: true,
            }
          )
          if(response.status=="success"){
            router.push("/");
          }
          setIsLoading(false)
          setIsOpenConfirmModal(false)
        }
  
  };
 
  return (
        <Box textColor={'black'}>
          <Image
            align={'5'}
            borderTopRadius="10px"
            width={"100%"}
            maxHeight={'200px'}
            objectFit={'cover'}
            overflow={'hidden'}
            alt={'lol-image'}
            src={
              championship?.game_id == 1 
              ?'https://i.ibb.co/SQcvz0Q/header.png'
              : 'https://iili.io/HrHUeYG.png'
            }
            borderRadius="10px" border='1px solid white'
            />
            <Heading textAlign={'center'} color={'white'} pt={'20px'} h={'10vh'}>
               {championship?.name}
            </Heading>
            <Tabs color={'white'} marginTop={'5'} colorScheme={'whiteAlpha'} size={'md'} textAlign={'center'} align={'center'} borderColor={'white'} >
                <TabList>
                    <Tab>Rules</Tab>
                    <Tab>Prizes</Tab>
                    <Tab>Teams</Tab>
                    <Tab>Contact</Tab>
                    <Tab isDisabled={true}>Brackets</Tab>
                </TabList>
            <TabPanels>
                <TabPanel>{championship?.rules}</TabPanel>
                <TabPanel>{championship?.prizes}</TabPanel>
                <TabPanel>{championshipTeams?.map((team, index) => (
              <p key={index}>{team.name}</p>
            ))}</TabPanel>
                <TabPanel>{championship?.contact}</TabPanel>
                <TabPanel></TabPanel>
            </TabPanels>
            </Tabs>
            <Heading color={'white'} h={'4vh'} size={'sm'} textAlign={'center'} marginTop={'200px'} bottom={'10'}>Select a team:</Heading>
            <Select
                  color={'black'}
                  colorScheme={'blackAlpha'}
                  size={'sm'}
                  left={'1'}
                  width={"99%"}
                  iconSize={'100px'}
                  name="game_id"
                  value={selectedTeam || ''}
                  onChange={handleTeamChange}
                  >
                  {teams?.map((team) => (
                    <option key={team.id} value = {team.id}>
                      {team.name}
                    </option>
                  ))}
              </Select>
            <Button onClick={handleConfirmModal} colorScheme='blue' left={'47%'} size={'md'} top={'3'} marginBottom={'25'}>Join</Button>
            <ConfirmModal
                    content="Are you sure you want to join in the championship with this team?"
                    handleConfirm={handleButtonClick}
                    isOpen={isOpenConfirmModal}
                    setIsOpen={setIsOpenConfirmModal}
                  />
        </Box>
  );
};


export default ChampionshipHeader;