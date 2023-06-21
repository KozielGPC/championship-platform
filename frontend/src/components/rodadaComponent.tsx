import React, { use, useEffect, useState } from 'react';
import { Link, LinkBox, Image, LinkOverlay, Box, Flex, Spacer, Button, Text, StackDivider, VStack, Grid, GridItem, Heading, AvatarGroup, Avatar, Stack, AvatarBadge, textDecoration, useToast} from '@chakra-ui/react';
import {SignoutButton} from './signoutButton'
import {UserContext} from '../context/UserContext'
import { useContext } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Championship, Rodada, Team } from '@/interfaces';
import { getTeamById, getTeamByIdNoArray } from '@/services/team/retrieve';


interface RodadaProps {
  rodada: Rodada;
}

let cp: Rodada;


const RodadaComponent: React.FC<RodadaProps> = ({ rodada }) => {

  const [team1, setTeam1] = useState<Team>();
  const [team2, setTeam2] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

  useEffect(
    () => {
      setIsLoading(true)
      const fetchData1 = async () => {
        const response = await getTeamById(rodada.team_1_id.toString());
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
            console.log(response.data)
            setTeam1(response.data)
          }
        }
      }
      if(rodada.team_1_id != -1){
        fetchData1()
      }
      const fetchData2 = async () => {
        if(rodada.team_2_id){
          const response = await getTeamById(rodada.team_2_id.toString());
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
      if(rodada.team_2_id != -1){
        fetchData2()
      }
    }, [] 
  )

  

  return (
    <Box border={"1px solid white"} p="5px">
      <Text color={'blue.200'}>{team1?.name + " "}</Text>
       X 
      <Text color={'red.200'}>{ " " + (team2 ? team2.name : "No opponent")}</Text>
    </Box>
  );
};


export default RodadaComponent;