import React, { use, useEffect, useState } from 'react';
import { Link, LinkBox, Image, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration, useToast, Icon, Center} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Championship, Match, Team } from '@/interfaces';
import { getTeamById } from '@/services/team/retrieve';
import { MdOutlineSportsScore} from 'react-icons/md'
import { setResult } from '@/services/matches/update';
import { useRouter } from 'next/router';


interface MatchProps {
  match: Match;
  isStarted: boolean;
  isAdmin: boolean;
  championship_id: number;
}

let cp: Match;


const MatchComponent: React.FC<MatchProps> = ({ match, isStarted, isAdmin, championship_id}) => {

  const [team1, setTeam1] = useState<Team>();
  const [team2, setTeam2] = useState<Team>();
  const [winner_team, setWinnerTeam] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const router = useRouter();

  useEffect(
    () => {
      setIsLoading(true)
      const fetchData1 = async () => {
        const response = await getTeamById(match.team_1_id.toString());
        if(response){
          setIsLoading(false)
          if(response.status == "error"){
            toast(
              {
                title: "Team request failed",
                description: response.message,
                status: "error",
                duration: 3000,
                position: "top"
              }
            )
            return
          }
          if(response.data){
            setTeam1(response.data)
          }
        }
      }
      if(match.team_1_id){
        fetchData1()
      }
      const fetchData2 = async () => {
        if(match.team_2_id){
          const response = await getTeamById(match.team_2_id.toString());
          if(response){
            setIsLoading(false)
            if(response.status == "error"){
              toast(
                {
                  title: "Team request failed",
                  description: response.message,
                  status: "error",
                  duration: 3000,
                  position: "top"
                }
              )
              return
            }
            if(response.data){
              setTeam2(response.data)
            }
          }
        } else {
          selectTeamWinner(1)
        }
      }
      if(match.team_2_id){
        fetchData2()
      }
      const fetchData3 = async () => {        
        if(match.winner_team_id){
          const response = await getTeamById(match.winner_team_id.toString());
          if(response){
            console.log(response)
            setIsLoading(false)
            if(response.status == "error"){
              toast(
                {
                  title: "Team request failed",
                  description: response.message,
                  status: "error",
                  duration: 3000,
                  position: "top"
                }
              )
              return
            }
            if(response.data){
              setWinnerTeam(response.data)
            }
          }
        }
      }
      if(match.winner_team_id && isStarted){
        fetchData3()
      }
    }, [match] 
  )

  async function selectTeamWinner (winTeam: number){
    var winner: number = 0;
    if(winTeam == 1){
      winner = team1 ? team1?.id : 0
    } else {
      winner = team2 ? team2?.id : 0
    }

    if(winner == 0){
      toast({
        title: "Error to set result:",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const request = {
      'id': match.id || 0,
      'data': {
        'winner_team_id': winner,
        'result': "resultado" //colocar as infos corretas do state da modal
      }
    }

    try {
        const response = await setResult(request);
        if (response.status !== "success") {
          toast({
            title: "Result confirmed succefully",
            description: "Result registered",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
    } catch (error: any) {
      toast({
        title: "Error when starting the championship:",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    
    router.push('/championship/' + championship_id)
  }

  return (
    <Box display={'inline-block'} border={"1px solid white"} p="5px" m='5px' h="auto" minW="200px" backgroundColor={'#262e3a'}>
      <Box borderBottom={'1px solid white'}> Match {match.bracket} </Box>
      <Box>
        <Text p='5px' display={'inline-block'} color={'blue.200'}>{team1?.name + " "}</Text>
        <Text p='5px' display={'inline-block'}>X</Text>
        <Text p='5px' display={'inline-block'}color={'red.200'}>{ " " + (team2 ? team2.name : "No opponent")}</Text>
      </Box>
      { isStarted ? 
        <Box marginBottom={'10px'}>
          { match.result ?
            <Box>
              <Icon display={'inline-block'} color={'yellow.200'} boxSize='20px' as={MdOutlineSportsScore}/>
              <Text display={'inline-block'} p="5px" color={'yellow.200'}>{winner_team ? winner_team.name : ''}</Text>
              <Icon display={'inline-block'} color={'yellow.200'} boxSize='20px' as={MdOutlineSportsScore}/>
              
              <Text color={'yellow.200'}>{match.result}</Text>
            </Box>
          :
            <Text color={'yellow.200'}>Waiting winner</Text>
          }
        </Box>
        :
        <></>
      } 
      {isAdmin && isStarted ? 
      <Box mb="10px" borderTop={'1px solid white'}>
        <Text pb="5px">Select Winner:</Text>
        <Button w="45%" onClick={() => selectTeamWinner(1)} colorScheme='blue' ml="5px" fontWeight={'bold'} textOverflow={'ellipsis'} whiteSpace='nowrap' overflow='hidden' textAlign={'left'}>
          {team1?.name}
        </Button>
        <Button w="45%" onClick={() => selectTeamWinner(2)} colorScheme='red' ml="5px" fontWeight={'bold'} textOverflow={'ellipsis'} whiteSpace='nowrap' overflow='hidden' textAlign={'left'}>
          {team2?.name}
        </Button>
      </Box>
      :
      <></>
      }      
    </Box>
  );
};


export default MatchComponent;