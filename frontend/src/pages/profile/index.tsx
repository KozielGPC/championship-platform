
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'
import { Avatar, Badge, Box, Button, Flex, FormControl, Input, InputGroup, InputLeftAddon, Stack, useToast, Text, FormLabel } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import {UserContext} from '../../context/UserContext'
import Link from 'next/link';
import { UserData } from "@/interfaces";
import { getUserById } from '@/services/users/retrieve';
import { editUser } from '@/services/users/edit';
import { useRouter } from 'next/router';

const defaultData: UserData = {
  username: "",
  password: "",
  email: ""
};

function Profile() {
  const {id, username} = useContext(UserContext);
  const [user, setUser] = useState<UserData>(defaultData);
  const [formData, setFormData] = useState<UserData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(
    () => {
      setIsLoading(true)
      const fetchData = async () => {
        const response = await getUserById(id.toString());
        if(response){
          setIsLoading(false)
          if(response.status == "error"){
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
            setFormData(response.data)
          }
        }
      }
      if(id != -1){
        fetchData()
      }
    }, [id] 
  )
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!user.username){
      toast({
          title: "Username is required.",
          description: "Please try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
      });
      return;
    }

    if(!user.email){
        toast({
            title: "Email is required.",
            description: "Please try again.",
            status: "error",
            duration: 2000,
            isClosable: true,
        });
        return;
    }

    
    if(user.password !== confirmPassword){
        toast({
            title: "Passwords do not match.",
            description: "Please try again.",
            status: "error",
            duration: 2000,
            isClosable: true,
        });
        return;
    }
    
    setIsLoading(true);

    const userData = {}

    const response = await editUser(userData);
        if(response){
           toast({
              title: response.message,
              status: response.status,
              duration: 3000,
              isClosable: true,
            });
            setIsLoading(false);
            if(response.status=="success"){
              router.push('/profile');
            }
        }
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
          <FormControl>
            <FormLabel>Username</FormLabel>
              <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="username_example"
              />
          </FormControl>

          <FormControl mt={4}>
              <FormLabel>e-mail</FormLabel>
              <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              />
          </FormControl>

          <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              />
          </FormControl>
          <Button mt='5px' colorScheme="blue" type="submit" w="70vh">
            Edit
          </Button>
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