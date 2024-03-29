import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { ColorMode, useColorMode, Text, Box, Flex
    , Heading, Button, FormControl, FormLabel, Input, useColorModeValue, useToast} from "@chakra-ui/react"
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

import { createUser } from "@/services/users/create";
    
function Signup() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

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

        //validar campos
        if(!username){
            toast({
                title: "Username is required.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if(!email){
            toast({
                title: "Email is required.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if(!password){
            toast({
                title: "Password is required.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if(!confirmPassword){
            toast({
                title: "Confirm Password is required.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if(password !== confirmPassword){
            toast({
                title: "Passwords do not match.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        
        setLoading(true);

        //Enviar dados ao backend para cadastrar usuário

        
        const response = await createUser({email, username, password});
        if(response){
           toast({
              title: response.message,
              status: response.status,
              duration: 3000,
              isClosable: true,
            });
            setLoading(false);
            if(response.status=="success"){
              router.push('/signin');
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
        Signup
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
          <FormControl id="email" mb="4" isRequired>
            <FormLabel>E-mail:</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
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
          <FormControl id="confirmePassword" mb="4" isRequired>
            <FormLabel>Confirme Your Password:</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" w="100%" disabled={loading} >
            {loading?"Signing up...":"Signup"}
          </Button>
        </form>
        <Flex pt={3} width={"100%"} justifyContent="center">
          <Text onClick={()=>router.push("/signin")}
           width={"max-content"} fontSize={"0.9rem"} borderBottom={"1px solid transparent"} cursor="pointer"
           _hover={
            {
              borderBottom: "1px solid"
            }
           }
          >
            Already have an account? Signin.
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
    }
  };
};  
  
export default Signup