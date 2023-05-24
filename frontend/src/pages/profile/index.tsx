
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
  id:-1,
  username: "",
  password: "",
  email: ""
};

function Profile() {
  const {id, username, setUsername} = useContext(UserContext);
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
            setFormData({
              id: response.data.id,
              username: "",
              password: "",
              email: ""
            });
            
          }
        }
      }
      if(id != -1){
        fetchData()
      }
    }, [id] 
  )
  
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

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

    
    if(formData.password !== confirmPassword){
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
    
    for (let key in formData) {
      if (formData.hasOwnProperty(key) && (formData[key as keyof UserData] === "" || formData[key as keyof UserData] === null)) {
        delete formData[key as keyof UserData];
      }
    }

    const response = await editUser(formData);
    if(response){
        toast({
          title: response.message,
          status: response.status,
          duration: 3000,
          isClosable: true,
        });
        if ('username' in formData) {
          setUsername(formData.username)
        }
        setIsLoading(false);
        if(response.status=="success"){
          router.push('/');
        }
    }
  };

  return (
    <Layout>
      <Box
        fontWeight={"bold"} fontSize={'3xl'} textColor="white" pt={'40px'} pb={'20px'} pl="20px">
        My Profile:
      </Box>
      <Box pt="5px" textColor="white" textAlign="center">
        <Avatar size={'lg'} backgroundColor={'green.400'} name={`${user.username}`} />
        <Text mb="5px" fontSize={'large'}>{user.username}</Text>
      </Box>
      <Box display="flex" flexDirection={"row"} alignItems={"center"} justifyContent={"center"} pt="10px" textColor="white" textAlign="center" >
        <form onSubmit={handleSubmit}>
          <FormControl w="40vw">
            <FormLabel>Username</FormLabel>
              <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={user.username}
              />
          </FormControl>

          <FormControl mt={2}>
              <FormLabel>e-mail</FormLabel>
              <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={user.email}
              />
          </FormControl>

          <FormControl mt={2}>
              <FormLabel>Password</FormLabel>
              <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              />
          </FormControl>
          <Button mt={2} colorScheme="blue" type="submit" w="40vw">
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