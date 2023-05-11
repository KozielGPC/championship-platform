import  Layout  from "../../../components/layout";
import { Box, Flex, Button, useToast, Text} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getTeams } from "@/services/team/retrieve";
import jwt_decode from "jwt-decode";
import { User } from "@/interfaces";
import { Team } from "@/interfaces";
import { useEffect, useState} from "react";
import {useRouter} from "next/router"; 
import {deleteTeam} from "@/services/team/delete";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
interface PropsMyTeams {
  teams:  Array<Team>
}

export default function MyTeams({teams}:PropsMyTeams) {
    const [teamsList, setTeamsList] = useState<Team[]>([]);
    const router = useRouter();
    const {id} = useContext(UserContext)
    const toast = useToast();
    useEffect(
      ()=>{
        if(teams){
          setTeamsList(teams)
        }
      },[teams]
    )

    async function handleDelete(idTeam:number){
      
      if(idTeam){
        const response = await deleteTeam(idTeam);
        if(response){
          toast(
            {
              title: response.message,
              status: response.status,
              duration: 3000,
              isClosable: true,
            }
          )
          if(response.status == "success"){
            return await getTeams()
            .then(
              (res)=>{
                if(res.status == "success" && res.data){ 
                  setTeamsList(res.data?.filter((team: Team) => team.owner_id == id))
                }
              }
            )
          }
        }
      }

    }

    return (
        <Layout>
            <Box>
                <Flex width="100%" justifyContent={"space-between"} p={5}>
                  <Text fontSize={'25'} color="white" fontWeight={"900"}>Meus Times</Text>
                  <Button  colorScheme={"blue"} onClick={()=>router.push('/profile/teams/new')}>
                      Criar nova equipe
                  </Button>
                </Flex>
                {
                  teamsList && teamsList.map((team, index) => (
                    <Box key={index} color="white"  borderBottom="1px solid white">
                      <Flex p={4} >
                          <Flex width="500px">
                            <h2>{team.name}</h2>
                          </Flex>
                          <Flex justifyContent={"space-between"} width="200px">
                            <Button  colorScheme={"grey"} onClick={()=>router.push('/profile/teams/edit/'+team.id)}>
                              Editar
                            </Button>
                            <Button onClick={()=>handleDelete(team.id)}
                             type='button' colorScheme={"red"}>
                              Deletar
                            </Button>
                          </Flex>
                          
                      </Flex> 
                      
                    </Box>
                  ))

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

    const response = await getTeams();
    if(response.status == "error"){
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
    const userData:User = jwt_decode(token);

    const teams = response.data?.filter((team: Team) => team.owner_id == userData.id);
    return(
      {
        props: {
          teams: teams
        }
      }
    )
   
  };  