
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
import { getChampionships } from '@/services/championship/retrieve';


function Home() {
  const { id,setId,username,setUsername} = useContext(UserContext);
  const [championships, setChampionships] = useState(Array<Championship>);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

  useEffect(
    () => {
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
      {
        championships && <ShowChampionships championships={championships}></ShowChampionships>
      } 
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

  return(
    {
      props: {}
    }
  )

};  

export default Home

