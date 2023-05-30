import  Layout  from "../../../components/layout";
import { Box, Image, Flex, Button, useToast, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Icon} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getTeamById, getTeams } from "@/services/team/retrieve";
import jwt_decode from "jwt-decode";
import { User } from "@/interfaces";
import { Team } from "@/interfaces";
import { useEffect, useState} from "react";
import {useRouter} from "next/router"; 
import {deleteTeam} from "@/services/team/delete";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import {ConfirmModal} from "@/components/confirmModal"
import { MdDeleteForever} from 'react-icons/md'
import { Payload, removeUser } from "@/services/team/remove";

interface TeamProp {
  teamProp:Team
}

export default function showTeam ({teamProp}: TeamProp) {
    const [team, setTeam] = useState<Team>();
    const router = useRouter();
    const {id} = useContext(UserContext)
    const toast = useToast();
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
    const [idSelectedTeam , setIdSelectedTeam] = useState<number>(-1);

    useEffect(
    () => {
        if(teamProp){
          setTeam(teamProp)
        }
      },[teamProp]
    )

    const handleClick = async (user_id: Number)  => {
      const payload: Payload = {
        team_id: team?.id,
        user_id: user_id
      }
      const response = await removeUser(payload);
      if(response.status == 'error'){
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      } else {
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      }
    }

    return (
        <Layout>
            <Image
              
              
              width={"100%"}
              maxHeight={'200px'}
              objectFit={'cover'}
              overflow={'hidden'}
              alt={'lol-image'}
              src={
                team?.game_id == 0 
                ?'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt8979808f7798ecf5/6216ee875fe07272a8a2447a/2021_Key_art.jpg'
                : 'https://iili.io/HrHUeYG.png'
              }
              borderLeft='1px solid white'
              borderBottom='1px solid white'
              borderRight='1px solid white'
              
              />
            <Box flexDirection={"column"} justifyContent={"center"} alignContent={"center"} display={"flex"} alignItems={"center"} w="100%">
              <Text fontFamily={"sans-serif"} fontWeight={"bold"} textShadow="3px 3px 5px rgba(0, 0, 0, 1)" fontSize={"5xl"} margin={"15px"} textColor={"white"}>
                {team?.name}
              </Text>
              
              <Box>
                <TableContainer>
                  <Table variant='simple' bgColor={"white"} colorScheme="black" border="1px black solid" w="60vw">
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Teammates</Th>
                        { 
                        id == team?.owner_id ? 
                        <Th isNumeric>Actions</Th>
                        : 
                        <></>
                        }
                      </Tr>
                    </Thead>
                    <Tbody>
                    {
                    team?.users ? 
                    (team.users).map((user, index) => (
                      <Tr>
                        <Td>{index}</Td>
                        <Td>{user.username}</Td>
                        { 
                        id == team?.owner_id ? 
                        <Td isNumeric><Button onClick={() => handleClick(user.id)} colorScheme="red"><Icon boxSize='25px' as={MdDeleteForever}/></Button></Td>
                        : 
                        <></>
                        }
                      </Tr>
                      )
                    )
                    :
                    <></>
                    }

                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              { 
              id == team?.owner_id ? 
              <Button> Convidar um usuário para equipe </Button> 
              : 
              <></>
              }
            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { "championship-token" : token } = parseCookies(context);
    if(!token){
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        }
      }
    }

    const {id} = context.query;
    
    if(!id){
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    //const response = await getTeamById(id.toString());
    const response = {
      data: {
        "id": 1,
        "name": "Kakito LoL",
        "password": "decode",
        "owner_id": 1,
        "game_id": 0,
        "created_at": "2023-05-30T19:41:15.333Z",
        "championships": [],
        "users" : [{
            "id": 1,
            "username": "rafa",
            "password": "string",
            "email": "string",
            "teams": []
        },
        {
            "id": 2,
            "username": "jao",
            "password": "string",
            "email": "string",
            "teams": []
        }]
      },
      status: 'sucess'
    }

    if(response.status == "error"){
      return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
    }

    return(
      {
        props: {
          teamProp: response.data
        }
      }
    )
   
  };  
