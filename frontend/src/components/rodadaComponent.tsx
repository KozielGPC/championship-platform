import React, { use, useEffect, useState } from 'react';
import { Link, LinkBox, Image, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration, useToast} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Championship, Match, Team } from '@/interfaces';
import { getTeamById } from '@/services/team/retrieve';


interface MatchProps {
  match: Match;
  isStarted: boolean;
  isAdmin: boolean;
}

let cp: Match;


const RodadaComponent: React.FC<MatchProps> = ({ match, isStarted, isAdmin }) => {

  const [team1, setTeam1] = useState<Team>();
  const [team2, setTeam2] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

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
            //console.log(response.data)
            setTeam1(response.data)
          }
        }
      }
      if(match.team_1_id != -1){
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
        }
      }
      if(match.team_2_id != -1){
        fetchData2()
      }
    }, [match] 
  )

  

  return (
    <Box border={"1px solid white"} p="5px">
      <Text color={'blue.200'}>{team1?.id + " "}</Text>
       X 
      <Text color={'red.200'}>{ " " + (team2 ? team2.id : "No opponent")}</Text>
    </Box>
  );
};


export default RodadaComponent;