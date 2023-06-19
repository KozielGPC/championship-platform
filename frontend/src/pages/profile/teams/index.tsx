import Layout from "../../../components/layout";
import {
  Box,
  Flex,
  Button,
  useToast,
  Text,
  GridItem,
  Grid,
  ScaleFade,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getTeams } from "@/services/team/retrieve";
import jwt_decode from "jwt-decode";
import { User } from "@/interfaces";
import { Team } from "@/interfaces";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteTeam } from "@/services/team/delete";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { ConfirmModal } from "@/components/confirmModal";
import Link from "next/link";

interface PropsMyTeams {
  teams: Array<Team>;
}

export default function MyTeams({ teams }: PropsMyTeams) {
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const router = useRouter();
  const { id } = useContext(UserContext);
  const toast = useToast();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [idSelectedTeam, setIdSelectedTeam] = useState<number>(-1);

  useEffect(() => {
    if (teams) {
      setTeamsList(teams);
    }
  }, [teams]);

  async function handleDelete(idTeam: number) {
    if (idTeam) {
      const response = await deleteTeam(idTeam);
      if (response) {
        toast({
          title: response.message,
          status: response.status,
          duration: 3000,
          isClosable: true,
        });
        if (response.status == "error") {
          return setIsOpenConfirmModal(false);
        }
        if (response.status == "success") {
          return await getTeams().then((res) => {
            if (res.status == "success" && res.data) {
              setTeamsList(
                res.data?.filter((team: Team) => team.owner_id == id)
              );
              setIsOpenConfirmModal(false);
            }
          });
        }
      }
    }
  }

  function handleConfirmModal(id: number) {
    setIdSelectedTeam(id);
    setIsOpenConfirmModal(true);
  }

  return (
    <Layout>
      <Box>
        <Flex width="100%" justifyContent={"space-between"} p={5}>
          <Text fontSize={"25"} color="white" fontWeight={"900"}>
            My Teams
          </Text>
          <Button
            colorScheme={"blue"}
            onClick={() => router.push("/profile/teams/new")}
          >
            Create Team
          </Button>
        </Flex>
        <Box overflow="auto" height={"500px"}>
          <Grid
            padding={"10"}
            templateColumns="repeat(4, 1fr)"
            gap={4}
            width={"600px"}
          >
            {teamsList &&
              teamsList.map((team, index) => (
                <GridItem
                  key={index}
                  colSpan={1}
                  bg="white"
                  borderRadius="md"
                  p={5}
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  maxWidth={"250px"}
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    cursor: "pointer",
                    boxShadow: "lg",
                    borderColor: "blue.500",
                    transform: `scale(1.05, 1.05)`,
                  }}
                >
                  <Text fontSize={"25"} color="black" fontWeight={"900"}>
                    {team.name}
                  </Text>
                  <Flex justifyContent={"space-between"} width="200px">
                    <Button
                      colorScheme={"blue"}
                      onClick={() => router.push("/profile/team/" + team.id)}
                    >
                      View
                    </Button>
                    <Button
                      colorScheme={"yellow"}
                      onClick={() =>
                        router.push("/profile/teams/edit/" + team.id)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleConfirmModal(team.id)}
                      type="button"
                      colorScheme={"red"}
                    >
                      Delete
                    </Button>
                  </Flex>
                </GridItem>
              ))}
            <ConfirmModal
              content="Are you sure you want to delete this team?"
              handleConfirm={() => handleDelete(idSelectedTeam)}
              isOpen={isOpenConfirmModal}
              setIsOpen={setIsOpenConfirmModal}
            />
          </Grid>
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

  const response = await getTeams();
  if (response.status == "error") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const userData: User = jwt_decode(token);

  const teams = response.data?.filter(
    (team: Team) => team.owner_id == userData.id
  );
  return {
    props: {
      teams: teams,
    },
  };
};
