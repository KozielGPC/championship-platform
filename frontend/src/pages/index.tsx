
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { Championship} from "../interfaces";
import { Box, Button,Text,Select, NumberInput, Input, NumberInputField, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext'
import Layout from '@/components/layout';
import ShowChampionships from '@/components/showChampionships';
import { ChampionshipFiltersProps, getChampionships, getChampionshipsFiltered } from '@/services/championship/retrieve';
import { getGames } from '@/services/games/retrieve';
import { Game } from '@/interfaces';

const championshipsFilter: ChampionshipFiltersProps = {name: '', min_teams: undefined, max_teams: undefined, game_id: undefined};
interface Props {
  games: Game[];
}

function Home({games}:Props) {
  const [championships, setChampionships] = useState(Array<Championship>);
  const [championshipsFiltered, setChampionshipsFiltered] = useState<Array<Championship> | undefined>(undefined);
  const [buttonContent, setButtonContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<number | undefined>(undefined);
  const [minTeams, setMinTeams] = useState<number | undefined>(undefined);
  const [maxTeams, setMaxTeams] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

  useEffect(
    () => {
      setIsLoading(true)
      const fetchData = async () => {
        const response = await getChampionships();
        if(response){
          setIsLoading(false)
          if( response.status == "error"){
            toast(
              {
                title: "Championships request failed",
                description: response.message,
                status: "error",
                duration: 3000,
                position: "top"
              }
            )
            return
          }
          if(response.data){
            setChampionships(response.data)
          }
        }
      }
      fetchData()
      .catch(console.error);
    }, [] 
  )

  const handleButtonClick = () => {
        setButtonContent(!buttonContent);
  }

  const handleMinimunChange = (value: number | string) => {
    
    if (typeof value === "string") {
      const parsedValue = parseInt(value, 10);

      if (isNaN(parsedValue)) {
        setMinTeams(undefined);
      } else if(parsedValue < 0) {
        setMinTeams(parsedValue);
      }else{
        setMinTeams(parsedValue)
      }
    } 
    
  };

  const handleMaximumChange = (value: number | string) => {

    if (typeof value === "string") {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setMaxTeams(undefined);
      } else if(parsedValue < 0) {
        setMaxTeams(parsedValue);
      }else{
        setMaxTeams(parsedValue)
      }
    } 
    
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

  
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if(event.target.value == 'undefined'){
      setSelectedGame(undefined);
    }else{
      setSelectedGame(Number(event.target.value));
    }
  };

  const handleSearchClick = async() => {
        if((minTeams) && minTeams < 0){
            toast({
              title: "Minimun of teams value must be greather than zero",
              status: "error",
              duration: 2500,
              isClosable: true,
            })
            return;
        }
        if((maxTeams) && maxTeams < 0){
            toast({
              title: "Maximum of teams value must be greather than zero",
              status: "error",
              duration: 2500,
              isClosable: true,
          })
          return;
        }if(searchTerm == "" && selectedGame == undefined && maxTeams == undefined && minTeams == undefined){
            toast({
            title: "Select a filter",
            status: "error",
            duration: 2500,
            isClosable: true,
        })
        setChampionshipsFiltered(undefined);
        }else{
          championshipsFilter.name = searchTerm;
          championshipsFilter.game_id = selectedGame;
          championshipsFilter.max_teams = maxTeams;
          championshipsFilter.min_teams = minTeams; 
          const response = await getChampionshipsFiltered(championshipsFilter);
          if(response && response.data){
            if(response.data.length !== 0){
              setChampionshipsFiltered(response.data)
              toast({
                  title: "Championship(s) found successfully",
                  status: response.status,
                  duration: 3000,
                  isClosable: true,
              })
            }else{
              toast({
                title: "Championship(s) not found with the selected filter",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            setChampionshipsFiltered([])
            }
          }
        }

  }

  return (
    <Layout>
      <Box ml="15px" mt="2px">
        <Button size='md' onClick={handleButtonClick} colorScheme={buttonContent ? 'red' : 'blue'}>
        {buttonContent ? 'Hide filters' : 'Show filters'}
        </Button>
      </Box>
      <Box>
        {(buttonContent) ? 
          <Box
          bg="whiteAlpha.300"
          textColor={"white"}
          borderRadius="md"
          borderWidth="0.5px"
          borderColor="black"
          h="30%"
          w="35%"
          mt="2"
          ml="15px"
        >
          <Box display="flex" flexDirection="column" alignItems="flex-start" ml="5px" gap={'0.5'} textColor={"black"}>
            <Text>Championship name:</Text>
            <Input
              type="text"
              placeholder="Write the name of the championship"
              w="96%"
              h="5%"
              borderRadius={'none'}
              value={searchTerm}
              bg={"white"}
              onChange={handleInputChange}
            />
            Minimun of teams:
            <NumberInput onChange={handleMinimunChange} w="96%"  bg={"white"}>
              <NumberInputField h="5%" />
            </NumberInput>
            Maximum of teams:
            <NumberInput onChange={handleMaximumChange} w="96%"  bg={"white"}>
              <NumberInputField h="5%" />
            </NumberInput>
            Select a game:
            <Select h="25px"
              w="96%"
              value={selectedGame}
              onChange={handleSelectChange}
              bg={"white"}
              borderRadius={'none'}
            >
              <option value="undefined">
                Select a game...
              </option>
              {
                games.map((game) => {
                  return (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  );
                })
              }
            </Select>
        
            <Button colorScheme="black" variant="outline" size="sm" w="25%" onClick={handleSearchClick} mt={'5px'} mb={'5px'}>
              Search
            </Button>
          </Box>
        </Box>
          :
          <></>}
      </Box>
      <Box>
        {
          championshipsFiltered === undefined
          ? championships && <ShowChampionships championships={championships} />
          : championshipsFiltered && <ShowChampionships championships={championshipsFiltered} />
        } 
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

  const response = await getGames();

  const games = response.data || [];


  return(
    {
      props: {
        games: games
      }
    }
  )

};  

export default Home

