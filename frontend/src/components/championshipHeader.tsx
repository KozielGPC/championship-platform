import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Image,
  Button,
  Select,
  useToast,
  Flex,
  Grid,
  Center,
} from "@chakra-ui/react";
import { Championship, Match, Team } from "@/interfaces";
import { addTeam } from "@/services/championship/add";
import { useRouter } from "next/router";
import { ConfirmModal } from "./confirmModal";
import UserContext from "@/context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import ChampionshipPreview from "./championshipPreview";
import axios from "axios";
import { getTeams } from "@/services/team/retrieve";
import { createMatch } from "@/services/matches/create";
import MatchComponent from "./matchComponent";
import { editChampionship } from "@/services/championship/update";
import { getChampionshipById } from "@/services/championship/retrieve";
import { getMatchesByChampionshipId } from "@/services/matches/retrieve";

interface ChampionshipTeam {
  team_id: number;
  championship_id?: number;
}

interface ChampionshipHeaderProps {
  championship?: Championship;
  teams?: Array<Team>;
  championshipTeams?: Array<Team>;
  matchesChampionship?: Array<Match>;
}

const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({
  championship,
  teams,
  championshipTeams,
  matchesChampionship,
}) => {
  const { id } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [championshipState, setChampionshipState] = useState<Championship>();
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<number>(0);
  const toast = useToast();
  const [teamsChampionship, setTeamsChampionship] = useState(Array<Team>);
  const [teamsChampionshipNextRound, setTeamsChampionshipNextRound] = useState(
    Array<Team>
  );
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const [champion, setChampion] = useState<Team>();
  const [isChampion, setIsChampion] = useState(false);
  const [base, setBase] = useState(1);
  const [matches, setMatches] = useState<Array<Match>>();
  const [championshipStarted, setChampionshipStarted] = useState(false);
  const [chaveamento, setChaveamento] = useState<Array<Match>>();
  const [tabIndex, setTabIndex] = useState<Number>(1);

  useEffect(() => {
    if (matches) {
      setChampionshipStarted(true);
    }
  }),
    [matches];

  useEffect(() => {
    console.log(matchesChampionship);

    setChampionshipState(championship);
    if (matchesChampionship?.length !== 0) {
      setMatches(matchesChampionship);
      setChampionshipStarted(true);
      const bases = [4, 8, 16, 32];
      var encontrado = false;
      bases.forEach((base_for) => {
        if (
          (championshipTeams?.length ? championshipTeams.length : 0) <=
            base_for &&
          !encontrado
        ) {
          setBase(base_for);
          encontrado = true;
        }
      });
    }

    var cont = 0;
    const array_teams: Team[] = [];
    var foundTeam: Team | undefined;
    console.log("matchesChampionship");
    console.log(matchesChampionship);
    if (matchesChampionship) {
      matchesChampionship.forEach((match) => {
        if (
          (match.round != null ? match.round : "0") ==
          (championship?.round != null ? championship.round : 1)
        ) {
          cont++;
          console.log(match);
          console.log(match.winner_team_id);
          if (match.winner_team_id !== null) {
            foundTeam = championshipTeams?.find(
              (team) => team.id === match.winner_team_id
            );
            if (foundTeam) array_teams.push(foundTeam);
          }
        }
      });
      console.log(cont);
      console.log(foundTeam);
      if (cont == 1 && foundTeam != null) {
        setIsChampion(true);
        setChampion(foundTeam);
      }
    }
    if (championshipTeams) {
      setTeamsChampionship(championshipTeams);
    }
  }, [championship, matchesChampionship, championshipTeams]);

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(Number(event.target.value));
  };

  function handleConfirmModal() {
    if (selectedTeam == 0) {
      toast({
        title: "Select a team",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsOpenConfirmModal(true);
  }

  const handleButtonClick = async () => {
    setIsLoading(true);
    const championshipTeam: ChampionshipTeam = {
      team_id: selectedTeam,
      championship_id: championshipState?.id,
    };
    const response = await addTeam(championshipTeam);
    if (response) {
      toast({
        title: response.message,
        status: response.status,
        duration: 3000,
        isClosable: true,
      });
      if (response.status == "success") {
        const response2 = await getTeams();
        const teamsChampionships = response2.data?.filter((team: Team) => {
          const filtredChampionships = team.championships.filter(
            (championship_filter: Championship) =>
              championship_filter.id ==
              (championshipState ? championshipState.id : 0)
          );
          if (filtredChampionships.length !== 0) {
            return filtredChampionships;
          }
        });
        if (teamsChampionships) {
          setTeamsChampionship(teamsChampionships);
        }
      }
      setIsLoading(false);
      setIsOpenConfirmModal(false);
    }
  };

  function gerarChaveamento() {
    console.log(chaveamento);
    var teams_lenght = 0;
    if (teamsChampionship?.length) {
      teams_lenght = teamsChampionship.length;
    }
    const bases = [2, 4, 8, 16, 32];
    const rodada = 1;
    if (
      (teamsChampionship?.length ? teamsChampionship.length : 0) >=
      (championshipState?.min_teams ? championshipState?.min_teams : -1)
    ) {
      var base_acima;
      var encontrado = false;
      bases.forEach((base) => {
        if (teams_lenght <= base && !encontrado) {
          base_acima = base;
          setBase(base_acima);
          encontrado = true;
        }
      });
      var num_matches_no_oponnent =
        (base_acima ? base_acima : 0) - teams_lenght;
      if (teamsChampionship && championshipState) {
        const compararAleatoriamente = () => Math.random() - 0.5;
        const timesAleatorizados: Team[] = [...teamsChampionship].sort(
          compararAleatoriamente
        );
        setTeamsChampionship(timesAleatorizados);
        if (timesAleatorizados.length >= championshipState.min_teams) {
          setChaveamento(
            gerar_partidas(timesAleatorizados, rodada, num_matches_no_oponnent)
          );
        }
      }
    } else {
      toast({
        title: "Error generating brackets",
        description:
          "Number of teams is lower than the minimun of teams of championship!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  function gerar_partidas(
    teams: any[],
    num_rodada: number,
    num_matches_no_oponnent: number
  ) {
    // gera as partidas da rodada 'num_rodada' do campeonato, com os times vindos em 'teams'
    if (!championshipState) {
      return [];
    } else {
      let bracket = 1;
      const array_matches: Match[] = [];
      for (let i = 0; i < teams.length - num_matches_no_oponnent; i += 2) {
        const team: Team[] = teams.slice(i, i + 2);
        if (team[1]) {
          const match: Match = {
            championship_id: championshipState?.id,
            team_1_id: team[0].id,
            team_2_id: team[1].id,
            round: num_rodada,
            bracket: bracket,
          };
          array_matches.push(match);
        }
        bracket++;
      }
      for (
        let i = teams.length - num_matches_no_oponnent;
        i < teams.length;
        i += 1
      ) {
        var match: Match = {
          championship_id: championshipState?.id,
          team_1_id: teams[i].id,
          team_2_id: null,
          winner_team_id: teams[i].id,
          result: "No opponent",
          round: num_rodada,
          bracket: bracket,
        };
        array_matches.push(match);
        bracket++;
      }
      return array_matches;
    }
  }

  async function iniciarCampeonato() {
    if (chaveamento) {
      try {
        if (
          championshipState?.name != null &&
          championshipState?.start_time != null &&
          championshipState?.min_teams != null &&
          championshipState?.max_teams != null &&
          championshipState?.prizes != null &&
          championshipState?.rules != null &&
          championshipState?.contact != null &&
          championshipState?.visibility != null
        ) {
          const championshipUpdate = {
            name: championshipState?.name,
            start_time: championshipState?.start_time,
            min_teams: championshipState?.min_teams,
            max_teams: championshipState?.max_teams,
            prizes: championshipState?.prizes,
            format: championshipState?.format,
            rules: championshipState?.rules,
            round: "1",
            contact: championshipState?.contact,
            visibility: championshipState?.visibility,
          };

          const request = {
            id: championshipState?.id || 0,
            data: championshipUpdate,
          };

          const response2 = await editChampionship(request);
          if (response2.status !== "success") {
            throw new Error(response2.message);
          } else {
            toast({
              title: "Updating the championship",
              description: response2.message,
              status: response2.status,
              duration: 3000,
              isClosable: true,
            });
            if (championshipState) {
              championshipState.round = 1;
            }
          }
        }

        const promises = chaveamento.map(async (match) => {
          const response = await createMatch(match);
          if (response.status !== "success") {
            throw new Error(response.message);
          }
        });
        setMatches(chaveamento);

        await Promise.all(promises);
        toast({
          title: "Championship started with success!",
          description: "Matches registered, round updated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setChaveamento([]);
        handleMatchResult();
        return;
      } catch (error: any) {
        toast({
          title: "Error starting championship:",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } else {
      toast({
        title: "Error to start championship",
        description: "The bracket has not been generated yet!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function avancarEtapa() {
    if (matches) {
      var condition = true;
      var ArrayTeams;
      const array_teams: Team[] = [];
      matches.forEach((match) => {
        if (condition) {
          if (
            (match.round != null ? match.round : "0") ==
            (championshipState?.round != null ? championshipState.round : 1)
          ) {
            if (match.winner_team_id == null) {
              toast({
                title: "Error advancing championship round!",
                description: "There are matches without results.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              condition = false;
            } else {
              const foundTeam = teamsChampionship.find(
                (team) => team.id === match.winner_team_id
              );
              if (foundTeam) array_teams.push(foundTeam);
            }
          }
        }
      });

      if (condition) {
        setTeamsChampionshipNextRound(array_teams);
        if (array_teams.length == 1) {
          const championship_winner = array_teams[0];
          setIsChampion(true);
          setChampion(championship_winner);
          toast({
            title: "TEAM: " + championship_winner.name + " IS CHAMPION!",
            description: "Congratulations",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          return;
        } else {
          if (championshipState) {
            const matchesNextRodada: Array<Match> = gerar_partidas(
              array_teams,
              championshipState.round + 1,
              0
            );
            try {
              if (
                championshipState?.name != null &&
                championshipState?.start_time != null &&
                championshipState?.min_teams != null &&
                championshipState?.max_teams != null &&
                championshipState?.prizes != null &&
                championshipState?.rules != null &&
                championshipState?.contact != null &&
                championshipState?.visibility != null
              ) {
                const championshipUpdate = {
                  name: championshipState?.name,
                  start_time: championshipState?.start_time,
                  min_teams: championshipState?.min_teams,
                  max_teams: championshipState?.max_teams,
                  prizes: championshipState?.prizes,
                  format: championshipState?.format,
                  rules: championshipState?.rules,
                  round: championshipState.round + 1,
                  contact: championshipState?.contact,
                  visibility: championshipState?.visibility,
                };

                const request = {
                  id: championshipState?.id || 0,
                  data: championshipUpdate,
                };

                const response2 = await editChampionship(request);
                if (response2.status !== "success") {
                  condition = false;
                  throw new Error(response2.message);
                } else {
                  toast({
                    title: "Championship updated!",
                    description: response2.message,
                    status: response2.status,
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }
              const promises = matchesNextRodada.map(async (match) => {
                const response = await createMatch(match);
                if (response.status !== "success") {
                  condition = false;
                  throw new Error(response.message);
                }
              });

              await Promise.all(promises);
              toast({
                title: "Round of the championship successfully advanced!",
                description: "Matches registered, round updated",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            } catch (error: any) {
              toast({
                title: "Error to advance round of championship:",
                description: error.message,
                status: error.status,
                duration: 3000,
                isClosable: true,
              });
              condition = false;
              return;
            }
          } else {
            toast({
              title: "Error to start championship",
              description: "No championship",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            condition = false;
            return;
          }
        }
      }
      if (condition) {
        toast({
          title: "Advancing championship round!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleMatchResult();
        handleChampionshipRound();
        //router.reload()
      }
    }
  }

  const handleMatchResult = async () => {
    if (championshipState) {
      const response = await getMatchesByChampionshipId(
        championshipState.id.toString()
      );
      if (response.status == "error") {
        toast({
          title: response.message,
          status: response.status,
          duration: 3000,
          isClosable: true,
        });
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      } else {
        setMatches(response.data);
      }
    }
  };

  const handleChampionshipRound = async () => {
    if (championshipState) {
      const response = await getChampionshipById(
        championshipState.id.toString()
      );
      if (response.status == "error") {
        toast({
          title: response.message,
          status: response.status,
          duration: 3000,
          isClosable: true,
        });
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      } else {
        setChampionshipState(response.data);
      }
    }
  };

  return (
    <Box textColor={"black"}>
      <Image
        width={"100%"}
        maxHeight={"200px"}
        objectFit={"cover"}
        overflow={"hidden"}
        alt={"lol-image"}
        src={
          championshipState?.game_id == 0
            ? "https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt8979808f7798ecf5/6216ee875fe07272a8a2447a/2021_Key_art.jpg"
            : "https://iili.io/HrHUeYG.png"
        }
        borderLeft="1px solid white"
        borderBottom="1px solid white"
        borderRight="1px solid white"
      />
      <Heading textAlign={"center"} color={"white"} pt={"20px"} h={"10vh"}>
        {championshipState?.name}
      </Heading>
      <Tabs
        onChange={(index) => setTabIndex(index)}
        color={"white"}
        marginTop={"5"}
        colorScheme={"whiteAlpha"}
        size={"md"}
        textAlign={"center"}
        align={"center"}
        borderColor={"white"}
      >
        <TabList>
          <Tab>Rules</Tab>
          <Tab>Prizes</Tab>
          <Tab>Teams</Tab>
          <Tab>Contact</Tab>
          <Tab>Brackets</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{championshipState?.rules}</TabPanel>
          <TabPanel>{championshipState?.prizes}</TabPanel>
          <TabPanel>
            {teamsChampionship?.map((team, index) => (
              <p key={index}>{team.name}</p>
            ))}
          </TabPanel>
          <TabPanel>{championshipState?.contact}</TabPanel>
          <TabPanel>
            <Box w="100%" h={"10vh"}>
              <Box float="left">
                Times no campeonato: {teamsChampionship?.length}
              </Box>
              <Box float="right">
                {chaveamento?.length != 0 &&
                chaveamento &&
                !championshipStarted ? (
                  <Button
                    onClick={() => iniciarCampeonato()}
                    colorScheme="blue"
                  >
                    Iniciar Campeonato
                  </Button>
                ) : (
                  <></>
                )}

                {championshipState?.admin_id == id && !championshipStarted ? (
                  <Button
                    onClick={() => gerarChaveamento()}
                    colorScheme="blue"
                    ml="5px"
                  >
                    Gerar chaveamento
                  </Button>
                ) : (
                  <></>
                )}

                {championshipState?.admin_id == id &&
                championshipStarted &&
                !isChampion ? (
                  <Button
                    onClick={() => avancarEtapa()}
                    colorScheme="blue"
                    ml="5px"
                  >
                    Avançar etapa do championship
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            {chaveamento || matches ? (
              <Box
                w="100%"
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                display={"flex"}
                backgroundColor={"#161B22"}
                border="2px solid white"
                overflow={"auto"}
                pb="20px"
              >
                {Array.from({
                  length: championshipState?.round
                    ? championshipState?.round
                    : 1,
                }).map((_, index) => (
                  <Grid
                    templateColumns={
                      championshipTeams
                        ? `repeat(${Math.ceil(base / 2)}, 1fr)`
                        : "repeat(2, 1fr)"
                    }
                    w="100%"
                    pt="10px"
                    pr="10px"
                    pl="10px"
                  >
                    {matches ? (
                      matches.map((match) => (
                        <>
                          {match.round == index + 1 ? (
                            <MatchComponent
                              match={match}
                              isStarted={matches ? true : false}
                              isAdmin={championshipState?.admin_id == id}
                              championship_id={championshipState?.id || 0}
                              rodada_atual_championship={
                                championshipState?.round || 1
                              }
                              isChampion={isChampion}
                              reqMatches={handleMatchResult}
                            ></MatchComponent>
                          ) : (
                            <></>
                          )}
                        </>
                      ))
                    ) : (
                      <></>
                    )}

                    {chaveamento ? (
                      chaveamento.map((match) => (
                        <MatchComponent
                          match={match}
                          isStarted={false}
                          isAdmin={championshipState?.admin_id == id}
                          championship_id={championshipState?.id || 0}
                          rodada_atual_championship={1}
                          isChampion={isChampion}
                          reqMatches={handleMatchResult}
                        ></MatchComponent>
                      ))
                    ) : (
                      <></>
                    )}
                  </Grid>
                ))}
              </Box>
            ) : (
              <></>
            )}
            {champion ? (
              <Box m="50px"> Champion : {champion.name} </Box>
            ) : (
              <></>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      {!matches ? (
        tabIndex != 4 ? (
          teams != null ? (
            teams.length != 0 ? (
              <Box
                mt="150px"
                w="100%"
                flexDirection={"column"}
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
              >
                <Heading
                  color={"white"}
                  h={"4vh"}
                  size={"sm"}
                  textAlign={"center"}
                  bottom={"10"}
                >
                  Select a team:
                </Heading>
                <Select
                  color={"black"}
                  colorScheme={"blackAlpha"}
                  size={"sm"}
                  mb="10px"
                  width={"30vw"}
                  iconSize={"100px"}
                  name="game_id"
                  value={selectedTeam || ""}
                  onChange={handleTeamChange}
                >
                  <option value="0">Selecione...</option>
                  {teams
                    .filter(
                      (team) =>
                        !teamsChampionship.some(
                          (championshipTeam) => championshipTeam.id === team.id
                        )
                    )
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  ;
                </Select>
                <Button
                  mb="50px"
                  w="10vw"
                  onClick={handleConfirmModal}
                  colorScheme="blue"
                  size={"md"}
                >
                  Join
                </Button>
                <ConfirmModal
                  content="Are you sure you want to join in the championship with this team?"
                  handleConfirm={handleButtonClick}
                  isOpen={isOpenConfirmModal}
                  setIsOpen={setIsOpenConfirmModal}
                />
              </Box>
            ) : (
              <Box
                mb="50px"
                mt="150px"
                w="100%"
                flexDirection={"column"}
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
              >
                <Heading
                  color={"white"}
                  h={"4vh"}
                  size={"sm"}
                  textAlign={"center"}
                >
                  {" "}
                  Looks like you don't have a team yet
                </Heading>
                <Button
                  colorScheme={"blue"}
                  onClick={() => router.push("/profile/teams/new")}
                >
                  Create Team
                </Button>
              </Box>
            )
          ) : (
            <></>
          )
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ChampionshipHeader;
