import  Layout  from "../../../components/layout";
import { Box, Button, Flex } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getChampionships } from "@/services/championship/retrieve";
import { Championship } from "@/interfaces";
import { useState } from "react";
import { useRouter } from "next/router";
import {User} from '@/interfaces'
import jwt_decode from "jwt-decode"

interface PropsMyChampionships {
    championships:  Array<Championship>
}


export default function MyChampionships({championships}: PropsMyChampionships) {

    const [championshipsList, setChampionshipsList] = useState<Array<Championship>>(championships);
    const router = useRouter();
    return (
        <Layout>
            <Box>

            <h1>My Championships</h1>

            {/* Listagem de campeonatos */}
            <li>
                {championshipsList &&championshipsList.map((championship, index) => (
                    <ol key={index}>
                      <Flex m={5}>
                          <Box width={"200px"}>
                            <h2>{championship.name}</h2>
                          </Box>
                          <Button onClick={()=>router.push('/profile/championships/edit/'+championship.id)}>
                            Editar
                          </Button>
                          <Button type='button' colorScheme={"red"}>
                            Deletar
                          </Button>
                      </Flex>
                    </ol>
                    
                ))}
            </li>
                
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

    const response = await getChampionships();
    if(response.status == "error"){
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
    const userData:User = jwt_decode(token);

    const championships = response.data?.filter((championship: Championship) => championship.admin_id == userData.id);
    return(
      {
        props: {
          championships: championships
        }
      }
    )
  
  };  