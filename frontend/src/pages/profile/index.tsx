
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'
import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../../context/UserContext'

function Profile() {
  const {id, username} = useContext(UserContext);
  return (
    <Layout>
      <Box textColor="white">
        <h1>{username}</h1>
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

export default Profile

