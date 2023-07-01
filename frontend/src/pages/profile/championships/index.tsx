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
import { getChampionships } from "@/services/championship/retrieve";
import { Championship } from "@/interfaces";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { User } from "@/interfaces";
import jwt_decode from "jwt-decode";
import { ConfirmModal } from "@/components/confirmModal";
import { UserContext } from "../../../context/UserContext";
import { deleteChampionship } from "@/services/championship/delete";

interface PropsMyChampionships {
  championships: Array<Championship>;
}

export default function MyChampionships({
  championships,
}: PropsMyChampionships) {
  const [championshipsList, setChampionshipsList] = useState<
    Array<Championship>
  >([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [idSelectedChampionship, setIdSelectedChampionship] =
    useState<number>(-1);
  const { id } = useContext(UserContext);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (championships) {
      setChampionshipsList(championships);
    }
  }, [championships]);

  function handleConfirmModal(id: number) {
    setIdSelectedChampionship(id);
    setIsOpenConfirmModal(true);
  }

  async function handleDelete(idChampionship: number) {
    if (idChampionship) {
      const response = await deleteChampionship(idChampionship);
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
          return await getChampionships().then((res) => {
            if (res.status == "success" && res.data) {
              setChampionshipsList(
                res.data?.filter(
                  (championship: Championship) => championship.admin_id == id
                )
              );
              setIsOpenConfirmModal(false);
            }
          });
        }
      }
    }
  }

  return (
    <Layout>
      <Box>
        <Flex width="100%" justifyContent={"space-between"} p={5}>
          <Text fontSize={"25"} color="white" fontWeight={"900"}>
            My Championships
          </Text>
          <Button
            colorScheme={"blue"}
            onClick={() => router.push("/profile/championships/new")}
          >
            Create Championship
          </Button>
        </Flex>
        <Box overflow="auto" height={"500px"}>
          <Grid
            padding={"10"}
            templateColumns="repeat(4, 1fr)"
            gap={4}
            width={"600px"}
          >
            {championshipsList &&
              championshipsList.map((championship, index) => (
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
                    {championship.name}
                  </Text>
                  <Flex justifyContent={"space-between"} width="200px">
                    <Button
                      colorScheme={"blue"}
                      onClick={() =>
                        router.push("/championship/" + championship.id)
                      }
                    >
                      View
                    </Button>
                    <Button
                      colorScheme={"yellow"}
                      onClick={() =>
                        router.push(
                          "/profile/championships/edit/" + championship.id
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleConfirmModal(championship.id)}
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
              handleConfirm={() => handleDelete(idSelectedChampionship)}
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

  const response = await getChampionships();
  if (response.status == "error") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const userData: User = jwt_decode(token);

  const championships = response.data?.filter(
    (championship: Championship) => championship.admin_id == userData.id
  );
  return {
    props: {
      championships: championships,
    },
  };
};
