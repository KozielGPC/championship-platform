
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

const championshipsFilter: ChampionshipFiltersProps = {name: '', min_teams: undefined, max_teams: undefined, game_id: undefined};

function Home() {
  const { id,setId,username,setUsername} = useContext(UserContext);
  const [championships, setChampionships] = useState(Array<Championship>);
  const [championshipsFiltered, setChampionshipsFiltered] = useState(Array<Championship>);
  const [buttonContent, setButtonContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<number | undefined>(undefined);
  const [minTeams, setMinTeams] = useState<number | undefined>(undefined);
  const [maxTeams, setMaxTeams] = useState<number | undefined>(undefined);
  const [minteamError, setMinTeamError] = useState<boolean>(false);
  const [maxteamError, setMaxTeamError] = useState<boolean>(false);
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
      if (isNaN(parsedValue) || parsedValue < 0) {
        setMinTeams(undefined);
        setMinTeamError(true);
      } else {
        setMinTeams(parsedValue);
        setMinTeamError(false);
      }
    } else {
      setMinTeams(value);
    }
  };

  const handleMaximumChange = (value: number | string) => {
    if (typeof value === "string") {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setMaxTeams(undefined);
      } else {
        setMaxTeams(parsedValue);
      }
    } else {
      setMaxTeams(value);
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
        console.log(minteamError)
        if(searchTerm !== '' || minTeams !== undefined || maxTeams !== undefined || selectedGame !== undefined && minteamError==false){
          if((minTeams) && isNaN(minTeams)){
            championshipsFilter.min_teams = undefined;
          }
          if((maxTeams) && isNaN(maxTeams)){
            championshipsFilter.max_teams = undefined;
          }
          if((selectedGame) && isNaN(selectedGame)){
            championshipsFilter.game_id = undefined;
          }
          if(searchTerm !== ''){
             championshipsFilter.name = searchTerm;
          }
          if(searchTerm == ''){
            championshipsFilter.name = '';
          }
          if(minTeams != undefined){
            championshipsFilter.min_teams = minTeams;
          }
          if(maxTeams != undefined){
            championshipsFilter.max_teams = maxTeams;
          }
          if(selectedGame != undefined){
            championshipsFilter.game_id = selectedGame
          }
          if(minteamError == true){
            championshipsFilter.min_teams = undefined;
          }
          const response = await getChampionshipsFiltered(championshipsFilter);
          if(response){
            if(response.status=="success"){
              if(response.data && response.data.length !== 0){  
                  setChampionshipsFiltered(response.data);  
                  toast(
                    {
                      title: "Championship(s) found successfully",
                      status: response.status,
                      duration: 3000,
                      isClosable: true,
                    }
                  ) 
                
              }else if(response.data && response.data.length == 0){            
                toast(
                {
                  title: "Championship(s) not found with the selected filters",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                }
              )
              if(response.data){
                setChampionshipsFiltered([]);
              }
              }
            }else{
              toast(
                {
                  title: response.message,
                  status: response.status,
                  duration: 3000,
                  isClosable: true,
                }
              )
            }
          }

        }else if(minTeams == undefined && minteamError == true){
            toast(
              {
                title: "Minimun of teams value must be greather than zero",
                status: "error",
                duration: 3000,
                isClosable: true,
              }
            )  
            setMinTeamError(false);  
        }else{
          setChampionshipsFiltered([]);
          toast(
            {
              title: "Select a filter",
              status: "error",
              duration: 3000,
              isClosable: true,
            }
          )
          
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
            <Select h="5%"
              w="96%"
              value={selectedGame}
              onChange={handleSelectChange}
              bg={"white"}
              borderRadius={'none'}
            >
              <option value='undefined'>Select...</option>
              <option value="0">League of Legends</option>
              <option value="1">Valorant</option>
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
          championshipsFiltered.length === 0
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

  return(
    {
      props: {}
    }
  )

};  

export default Home

