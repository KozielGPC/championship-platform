import  Layout  from "../../../components/layout";
import { Box, Flex, Button } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getTeams } from "@/services/team/retrieve";
import jwt_decode from "jwt-decode";
import { User } from "@/interfaces";
import { Team } from "@/interfaces";
import { useEffect, useState} from "react";
import {useRouter} from "next/router"; 

interface PropsMyTeams {
  teams:  Array<Team>
}

export default function MyTeams({teams}:PropsMyTeams) {
    const [teamsList, setTeamsList] = useState<Team[]>([]);
    const router = useRouter();

    useEffect(
      ()=>{
        if(teams){
          setTeamsList(teams)
        }
      },[teams]
    )

    return (
        <Layout>
            <Box>
                {
                  teamsList && teamsList.map((team, index) => (
                    <Box key={index} color="white"  borderBottom="1px solid white">
                      <Flex p={4} >
                          <Flex width="500px">
                            <h2>{team.name}</h2>
                          </Flex>
                          <Flex justifyContent={"space-between"} width="200px">
                            <Button  colorScheme={"blue"} onClick={()=>router.push('/profile/teams/edit/'+team.id)}>
                              Editar
                            </Button>
                            <Button type='button' colorScheme={"red"}>
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