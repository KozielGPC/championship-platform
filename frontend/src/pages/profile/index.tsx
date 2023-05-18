
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'
import { Avatar, Badge, Box, Button, Flex, FormControl, Input, InputGroup, InputLeftAddon, Stack, useToast, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import {UserContext} from '../../context/UserContext'
import Link from 'next/link';
import { UserData } from "@/interfaces";
import { getUserById } from '@/services/users/retrieve';
import { editUser } from '@/services/users/edit';

const defaultData: UserData = {
  id: 0,
  username: "",
  password: "",
  email: ""
};

function Profile() {
  const {id, username} = useContext(UserContext);
  const [user, setUser] = useState<UserData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(
    () => {
      setIsLoading(true)
      const fetchData = async () => {
        const response = await getUserById(id.toString());
        if(response){
          setIsLoading(false)
          if( response.status == "error"){
            toast(
              {
                title: "User request failed",
                description: response.message,
                status: "error",
                duration: 3000,
                position: "top"
              }
            )
            return
          }
          if(response.data){
            setUser(response.data)
            setEmail(response.data.email)
          }
        }
      }
      fetchData()
      .catch(console.error);
    }, [id] 
    )
    
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
  };

  return (
    <Layout>
      <Box
        fontWeight={"bold"} fontSize={'3xl'} textColor="white" pt={'40px'} pb={'20px'} pl="20px">
        My Profile:
      </Box>
      <Box pt="20px" textColor="white" textAlign="center">
        <Avatar size={'lg'} backgroundColor={'green.400'} name={`${user.username}`} />
        <Text mb="20px" fontSize={'large'}>{user.username}</Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="username" display={'block'}>
            <Box p='5px'>
              <InputGroup display="inline-flex" w="70vh">
                <InputLeftAddon minW="23vh" textColor="black" children='Usuário' />
                <Input w="container.md" value={`${user.username}`} isDisabled={true} />
              </InputGroup>
            </Box>
          </FormControl>
            
          <FormControl id="email" display={'block'}>
            <Box p='5px'>
            <InputGroup display="inline-flex" w="70vh">
              <InputLeftAddon minW="23vh" textColor="black" children='E-mail' />
              <Input w="container.md" type="email" onChange={handleEmailChange} value={`${user.email}`} isDisabled={true} />
            </InputGroup>
            </Box>
          </FormControl>

          <FormControl id="password" display={'block'}>
            <Box p='5px'>
            <InputGroup display="inline-flex" w="70vh">
              <InputLeftAddon minW="23vh" textColor="black" children='Password' />
              <Input w="container.md" type="password" onChange={handlePasswordChange} value={`${user.email}`} isDisabled={true} />
            </InputGroup>
            </Box>
          </FormControl>
            <Box p='5px'>
            <InputGroup id="confirmPassword" display="inline-flex" w="70vh">
              <InputLeftAddon minW="23vh" textColor="black" children='Cofirm Password' />
              <Input w="container.md" type="password" onChange={handleConfirmPasswordChange} value={`${user.email}`} isDisabled={true} />
            </InputGroup>
            </Box>

          <FormControl display={'block'}>
            <Button isDisabled={true} mt='5px' colorScheme="blue" type="submit" w="70vh">
              Edit
            </Button>
          </FormControl>
        </form>
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