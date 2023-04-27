
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode"
import { Championship, User } from "../interfaces";
import { Box, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext'
import Layout from '@/components/layout';
import ShowChampionships from '@/components/showChampionships';
import { getChampionships } from '@/services/championships/championships';


function Home(data:User) {
  const { id,setId,username,setUsername} = useContext(UserContext);
  const [championships, setChampionships] = useState(Array<Championship>);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

  useEffect(
    () => {
      if(data.id && data.username){
        setId(data.id)
        setUsername(data.username)
      }
      setIsLoading(true)
      const fetchData = async () => {
        const response = await getChampionships();
        if(response){
          setIsLoading(false)
          if( response.status == "error"){
            toast(
              {
                title: "Championships request failed",
                description: response.message,
                status: "error",
                duration: 3000,
                position: "top"
              }
            )
            console.log('opa')
            return
          }
          if(response.data){
            setChampionships(response.data)
          }
        }
      }
      fetchData()
      .catch(console.error);
    }, [] 
  )

  return (
    <Layout>
      <Box textColor="white">
        <ShowChampionships championships={championships}></ShowChampionships>
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

  try {
    // Decodifique o token e armazene o resultado em decodedToken
    const userData:User = jwt_decode(token);

    if(userData.id && userData.username){
      return {
        props: userData
      };
    }else{
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }
    
  } catch (error) {

    // Se houver um erro ao decodificar o token, redirecione para a página de login
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

};  

export default Home

