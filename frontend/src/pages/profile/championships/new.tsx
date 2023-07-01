import Layout from "../../../components/layout";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  Heading,
} from "@chakra-ui/react";
import { createChampionship } from "../../../services/championship/create";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { dateTime } from "../../../utils/dateTime";
import { FormErrorMessage } from "../../../components/formErrorMessage";
import { getGames } from "@/services/games/retrieve";
import { Game } from "@/interfaces";
interface ChampionshipFormData {
  name: string;
  start_time: string;
  created_at: string;
  min_teams: number;
  max_teams: number;
  prizes: string;
  format: string;
  rules: string;
  contact: string;
  visibility: string;
  game_id: number;
  admin_id: number;
}

interface ChampionshipErrors {
  name: string;
  start_time: string;
  created_at: string;
  min_teams: string;
  max_teams: string;
  prizes: string;
  format: string;
  rules: string;
  contact: string;
  visibility: string;
  game_id: string;
  admin_id: string;
}

const defaultFormData: ChampionshipFormData = {
  name: "",
  start_time: "",
  created_at: dateTime(),
  min_teams: 0,
  max_teams: 0,
  prizes: "",
  format: "chaveamento",
  rules: "",
  contact: "",
  visibility: "publico",
  game_id: 0,
  admin_id: 0,
};

interface Props {
  games: Game[];
}

export default function CreateChampionship({ games }: Props) {
  const router = useRouter();
  const { id } = useContext(UserContext);
  //eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] =
    useState<ChampionshipFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setFormErrors] = useState<ChampionshipErrors>();
  const toast = useToast();

  useEffect(() => {
    if (id) {
      let createdAt = dateTime();
      setFormData((prevState: ChampionshipFormData) => ({
        ...prevState,
        created_at: createdAt,
        admin_id: Number(id),
      }));
    }
  }, [id]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const errors = validateChampionship(formData);
    if (Object.values(errors).every((val) => val === "")) {
      const response = await createChampionship(formData);
      if (response) {
        toast({
          title: response.message,
          status: response.status,
          duration: 3000,
          isClosable: true,
        });
        if (response.status == "success") {
          setFormData(defaultFormData);
          router.push("/profile/championships");
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setFormErrors(errors);
      toast({
        title: "Erro ao criar campeonato",
        description: "Verifique os campos e tente novamente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  function validateChampionship(values: ChampionshipFormData) {
    let errors: ChampionshipErrors = {
      name: "",
      start_time: "",
      created_at: "",
      min_teams: "",
      max_teams: "",
      prizes: "",
      format: "",
      rules: "",
      contact: "",
      visibility: "",
      game_id: "",
      admin_id: "",
    };

    if (!values.name) {
      errors.name = "Required";
    }

    if (!values.start_time) {
      errors.start_time = "Required";
    }

    if (Number(values.min_teams) <= 0) {
      errors.min_teams = "Must be greater than zero";
    }

    if (Number(values.max_teams) <= 0) {
      errors.max_teams = "Must be greater than zero";
    }

    if (Number(values.min_teams) > Number(values.max_teams)) {
      errors.min_teams = "Cannot be greater than maximum number of teams";
    }

    if (!values.prizes) {
      errors.prizes = "Required";
    }

    if (!values.format) {
      errors.format = "Required";
    }

    if (!values.rules) {
      errors.rules = "Required";
    }

    if (!values.contact) {
      errors.contact = "Required";
    }

    if (!values.visibility) {
      errors.visibility = "Required";
    }

    if (values.game_id == null || values.game_id == undefined) {
      errors.game_id = "Required";
    }

    if (!values.admin_id) {
      errors.admin_id = "Required";
    }
    errors;
    return errors;
  }

  return (
    <Layout>
      <Flex
        width="100%"
        height="94vh"
        bg="#555555"
        justifyContent={"center"}
        alignItems="center"
      >
        <Box
          bg="#ffffff"
          p="8"
          rounded="md"
          boxShadow="md"
          w={{ base: "90%", sm: "80%", md: "70%" }}
          h={"max-content"}
          maxHeight={"90%"}
          overflowY={"auto"}
        >
          <Heading mb="6" textAlign="center">
            New Championship
          </Heading>
          <form onSubmit={handleFormSubmit}>
            <FormControl>
              <FormLabel display={"flex"} alignItems="center">
                Name
                {errors && errors.name && (
                  <FormErrorMessage content={errors.name} />
                )}
              </FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Type the name of championship"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Start date and time
                {errors && errors.start_time && (
                  <FormErrorMessage content={errors.start_time} />
                )}
              </FormLabel>
              <Input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Minimum of teams
                {errors && errors.min_teams && (
                  <FormErrorMessage content={errors.min_teams} />
                )}
              </FormLabel>
              <Input
                type="number"
                name="min_teams"
                min={1}
                max={formData.max_teams}
                value={formData.min_teams}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Maximum of teams
                {errors && errors.max_teams && (
                  <FormErrorMessage content={errors.max_teams} />
                )}
              </FormLabel>
              <Input
                type="number"
                name="max_teams"
                min={formData.min_teams}
                value={formData.max_teams}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Prizes
                {errors && errors.prizes && (
                  <FormErrorMessage content={errors.prizes} />
                )}
              </FormLabel>
              <Textarea
                name="prizes"
                value={formData.prizes}
                onChange={handleInputChange}
                placeholder="Type the prizes of championship"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Format
                {errors && errors.format && (
                  <FormErrorMessage content={errors.format} />
                )}
              </FormLabel>
              <Select
                name="format"
                value={formData.format}
                onChange={handleSelectChange}
              >
                <option value="chaveamento">Brackets</option>
                <option value="pontos_corridos">Round-Robin</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Rules
                {errors && errors.rules && (
                  <FormErrorMessage content={errors.rules} />
                )}
              </FormLabel>
              <Textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                placeholder="Type the rules of championship"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Contact
                {errors && errors.contact && (
                  <FormErrorMessage content={errors.contact} />
                )}
              </FormLabel>
              <Input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Type the contact of championship"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Visibility
                {errors && errors.visibility && (
                  <FormErrorMessage content={errors.visibility} />
                )}
              </FormLabel>
              <Select
                name="visibility"
                value={formData.visibility}
                onChange={handleSelectChange}
              >
                <option value="publico">Public</option>
                <option value="privado">Private</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel display={"flex"} alignItems="center">
                Game
                {errors && errors.game_id && (
                  <FormErrorMessage content={errors.game_id} />
                )}
              </FormLabel>
              <Select
                name="game_id"
                value={formData.game_id}
                onChange={handleSelectChange}
              >
                {games.map((game: Game, index) => {
                  return (
                    <option key={index} value={game.id}>
                      {game.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <Button
              type="submit"
              mt={4}
              disabled={isLoading}
              colorScheme="blue"
            >
              <>{isLoading ? "Creating..." : "Create Championship"}</>
            </Button>
          </form>
        </Box>
      </Flex>
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

  const response = await getGames();

  const games = response.data || [];

  return {
    props: {
      games: games,
    },
  };
};
