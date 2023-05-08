import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import {
  ColorMode,
  useColorMode,
  Text,
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { createTeam } from "@/services/team/create";
import { User } from "@/interfaces";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import jwt_decode from "jwt-decode";
import Layout from "@/components/layout";

function CreateTeam(data: User) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [owner, setOwner] = useState("");
  const [game, setGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setGame(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //validar campos
    if (!name) {
      toast({
        title: "Name is required.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password is required.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!confirmPassword) {
      toast({
        title: "Confirm Password is required.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!game) {
      toast({
        title: "Game is required.",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);

    //convertendo variaveis para tipo str para number, não sei como passar corretamente o id do game aq.
    var owner_id: number = +owner;
    var game_id: number = +game;

    const response = await createTeam({ name, password, owner_id, game_id });

    if (response) {
      toast({
        title: response.message,
        status: response.status,
        duration: 3000,
        position: "top",
      });
      setIsLoading(false);
      if (response.status != "error") {
        router.push("/");
      }
    }
  };

  return (
    <Layout>
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
            Create Team
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="name" mb="4" isRequired>
              <FormLabel>Name:</FormLabel>
              <Input type="text" value={name} onChange={handleNameChange} />
            </FormControl>
            <FormControl id="password" mb="4" isRequired>
              <FormLabel>Password:</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <FormControl id="confirmPassword" mb="4" isRequired>
              <FormLabel>Confirm your Password:</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </FormControl>
            <FormControl id="game" mb="4" isRequired>
              <FormLabel>Game:</FormLabel>
              <Select
                value={game}
                onChange={(e) => handleGameChange(e)}
                placeholder="Select option"
              >
                <option value="0">League Of Legends</option>
                <option value="1">Valorant</option>
              </Select>
            </FormControl>
            <Button colorScheme="blue" type="submit" w="100%">
              Create team
            </Button>
          </form>
        </Box>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { "championship-token": token } = parseCookies(context);
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default CreateTeam;
