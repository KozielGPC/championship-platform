
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode"
import { Championship, User } from "../interfaces";
import { Box, Button, NumberInput, NumberInputField, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext'
import Layout from '@/components/layout';
import ShowChampionships from '@/components/showChampionships';
import { ChampionshipFiltersProps, getChampionships, getChampionshipsFiltered } from '@/services/championship/retrieve';
import axios from 'axios';


const championshipsFilter: ChampionshipFiltersProps = {name: '', min_teams: undefined, max_teams: undefined};

function Home() {
  const { id,setId,username,setUsername} = useContext(UserContext);
  const [championships, setChampionships] = useState(Array<Championship>);
  const [championshipsFiltered, setChampionshipsFiltered] = useState(Array<Championship>);
  const [buttonContent, setButtonContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleMinimumChange = (value: number | string) => {
    if (typeof value === "string") {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setMinTeams(undefined);
      } else {
        setMinTeams(parsedValue);
      }
    } else {
      setMinTeams(value);
    }
  };

  const handleMaximumChange = (value: number | string) => {
    if (typeof value === "string") {
      value = parseInt(value, 10);
    }
    setMaxTeams(value);
};

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.log(value)
        setSearchTerm(value);
  }

  const handleSearchClick = async() => {
        console.log(minTeams)
        if(searchTerm !== '' || minTeams !== undefined || maxTeams !== undefined){
          if((minTeams) && isNaN(minTeams)){
            championshipsFilter.min_teams = undefined;
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
          const response = await getChampionshipsFiltered(championshipsFilter);
          if(response){
            if(response.status=="success"){
              if(response.data && response.data.length !== 0){  
                  setChampionshipsFiltered(response.data);  
                  toast(
                    {
                      title: "Campeonato(s) encontrado(s) com sucesso",
                      status: response.status,
                      duration: 3000,
                      isClosable: true,
                    }
                  ) 
                
              }else if(response.data && response.data.length == 0){             
                toast(
                {
                  title: "Campeonato(s) não encontrado(s) com os filtros selecionados",
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
        }else{
          setChampionshipsFiltered([]);
          toast(
            {
              title: "Selecione algum filtro",
              status: "error",
              duration: 3000,
              isClosable: true,
            }
          )
          
        }
  }

  return (
    <Layout>
      <Box ml={'1'}>
        <Button onClick={handleButtonClick}
        colorScheme={'blue'}
        >Show filters 
        </Button>
      </Box>
      <Box>
        {(buttonContent) ? 
          <Box 
          bg={'whiteAlpha.500'}
          h={'30%'}
          w={'25%'}
          mt={'2'}
          ml={'1'}
          >
              <Box display={'inline-block'}>
                Nome do campeonato:
                <input
                  type="text"
                  placeholder="Digite o nome do campeonato"
                  style={{ width: '90%' }} 
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                Minimo de times:
                <NumberInput onChange={handleMinimumChange}>
                  <NumberInputField h={'10%'}/>
                </NumberInput>
                Maximo de times:
                <NumberInput onChange={handleMaximumChange}>
                  <NumberInputField h={'10%'}/>
                </NumberInput>
                <Button colorScheme='blackAlpha' variant='outline' size={'sm'} w={'25%'} onClick={handleSearchClick}>Search</Button>
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

