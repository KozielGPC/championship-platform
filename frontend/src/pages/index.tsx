
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import jwt_decode from "jwt-decode"
import { User } from "../interfaces";
import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext'
import Layout from '@/components/layout';
function Home(data:User) {
  const { id,setId,username,setUsername} = useContext(UserContext);

  useEffect(
    () => {
      if(data.id && data.username){
        setId(data.id)
        setUsername(data.username)
      }
    },[data]
  )

  return (
    <Layout>
      <Box>
        <h1>Home</h1>
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

  return(
    {
      props: {}
    }
  )

};  

export default Home

