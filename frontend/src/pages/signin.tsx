import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { ColorMode, useColorMode, Text, Box, Flex
, Heading, Button, FormControl, FormLabel, Input, useColorModeValue, useToast,
} from "@chakra-ui/react"
import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import {getToken} from '../services/auth/getToken' 
import UserContext from '@/context/UserContext';
import { useContext } from 'react';

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast()
    const router = useRouter()
    const { signin } = useContext(UserContext);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        const response = await getToken({username, password})
        if(response){
          setIsLoading(false)
          if( response.status == "error"){
            toast(
              {
                title: "Authentication failed",
                description: response.message,
                status: "error",
                duration: 3000,
                position: "top"
              }
            )
            return
          }
          if(response.data?.access_token){
            signin(response.data?.access_token);
            router.push("/");
          }
        }
    };

    return (
       <Box
      bg="#555555"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="#ffffff"
        p="8"
        rounded="md"
        boxShadow="md"
        w={{ base: "90%", sm: "80%", md: "50%" }}
      >
        <Heading mb="6" textAlign="center">
          Signin
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="username" mb="4" isRequired>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </FormControl>
          <FormControl id="password" mb="4" isRequired>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" w="100%">
            Login
          </Button>
        </form>
        <Flex pt={3} width={"100%"} justifyContent="center">
          <Text onClick={()=>router.push("/signup")}
           width={"max-content"} fontSize={"0.9rem"} borderBottom={"1px solid transparent"} cursor="pointer"
           _hover={
            {
              borderBottom: "1px solid"
            }
           }
          >
            Create an account
          </Text>
        </Flex>
      </Box>
    </Box>
    )
  }


interface Props {
  cookie: Record<string, string>;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { "championship-token" : cookie } = parseCookies(context);
  if(cookie){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  return {
    props: {
    },
  };
};  




  
export default Signin;
  