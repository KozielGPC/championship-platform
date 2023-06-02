
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'
import { Avatar, Badge, Box, Button, Flex, FormControl, Input, InputGroup, InputLeftAddon, Stack, useToast, Text, FormLabel } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import {UserContext} from '../../context/UserContext'
import Link from 'next/link';
import { User } from "@/interfaces";
import { getUserById } from '@/services/users/retrieve';
import { editUser } from '@/services/users/edit';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import copyObject from '@/utils/copyObject';

interface UserFormData {
  id: Number;
  username: string;
  password: string;
  email: string;
}

const defaultData: UserFormData = {
  id:-1,
  username: "",
  password: "",
  email: ""
};

function Profile() {
  const {id, username, email, setUsername, setEmail} = useContext(UserContext);
  const [formData, setFormData] = useState<UserFormData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if(id){
      setFormData({
        id: id,
        username: username,
        email: email,
        password: ""
      })
    }
  },[id, username, email])

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
    
    if(formData.email == ""){
      toast({
        title: "Email is empty.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if(formData.username == ""){
      toast({
        title: "Username is empty.",
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
    
    const copyFormData = copyObject(formData);
    if (copyFormData.username == username){
      delete copyFormData.username;
    }


    
    const response = await editUser(copyFormData);
    if(response){
      setIsLoading(false);
      toast({
        title: response.message,
        status: response.status,
        duration: 3000,
        isClosable: true,
      });
      if(response.status == "success" && response.data){
          if(response.data.email && response.data.username){
            setUsername(response.data.username)
            setEmail(response.data.email)
            router.push("/");
          }
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
        <Avatar size={'lg'} backgroundColor={'green.400'} name={`${username}`} />
        <Text mb="5px" fontSize={'large'}>{username}</Text>
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
              placeholder={"Username"}
              />
          </FormControl>

          <FormControl mt={2}>
              <FormLabel>e-mail</FormLabel>
              <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={"E-mail"}
              />
          </FormControl>

          <FormControl mt={2}>
              <FormLabel>New Password</FormLabel>
              <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={"New Password"}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Confirm new Password</FormLabel>
              <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={"Confirm new Password"}
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