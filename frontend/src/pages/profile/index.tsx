
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'
import { Avatar, Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../../context/UserContext'
import Link from 'next/link';

function Profile() {
  const {id, username} = useContext(UserContext);
  const handleEdit = () => {
    // Lógica para a ação de edição
  };


  return (
    <Layout>
      <Box textColor="white" textAlign="center">
        <Box pt={'40px'} pb={'40px'}>
          Dados pessoais
        </Box>
        <Box>
          <Avatar backgroundColor={'green.400'} name={`${username}`} />
          <Box pt="50px">{username}</Box>

          <Link href={`/profile/edit/${id}`}>Editar</Link>
        </Box>
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