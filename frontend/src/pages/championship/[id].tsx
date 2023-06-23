import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { Championship, Team, User } from "../../interfaces";
import { getChampionshipById, getChampionships } from "@/services/championship/retrieve";
import { getTeams } from '@/services/team/retrieve';
import jwt_decode from "jwt-decode"
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChampionshipHeader from '@/components/championshipHeader';
 
interface PropsEditChampionship {
  championship:  Championship
}

interface PropsEditTeams {
  teams: Array<Team>
}

interface PropsEditTeamsChampionship{
  teamsChampionships: Array<Team>
}

type PropsEdit = PropsEditChampionship & PropsEditTeams & PropsEditTeamsChampionship;
 
export default function CurrentChampionship({championship, teams, teamsChampionships}: PropsEdit) {
    const [currentChampionship, setCurrentChampionship] = useState<Championship>();
    const [listUserTeam, setListUserTeam] = useState(Array<Team>);
    const [listChampionshipTeams, setListChampionshipTeams] = useState(Array<Team>);
 
  useEffect(() => { 
    if(championship){
        setCurrentChampionship(championship)
        setListUserTeam(teams)
        setListChampionshipTeams(teamsChampionships)
      }

    },[])

    


 
  return(
     <Layout>
        <ChampionshipHeader championship={currentChampionship} teams={listUserTeam.filter((team: Team) => team.game_id == championship.game_id)} championshipTeams={listChampionshipTeams}></ChampionshipHeader>
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
 
    const {id} = context.query;
 
    if(!id){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
    }
    const response = await getChampionshipById(id.toString())
    const response2 = await getTeams()
    //const response3 = await 


    const userData:User = jwt_decode(token);

    if(response.status == "error"){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
    }
    
    if(response2.status == "error"){
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
    }

    const userTeams = response2.data?.filter((team: Team) => team.owner_id == userData.id);

    const teamsChampionships = response2.data?.filter((team: Team) => {
          const filtredChampionships = team.championships.filter((championship: Championship) => championship.id == Number(id))
          if(filtredChampionships.length !== 0){
             return filtredChampionships
          }
        })

    
  

    return(
      {
        props: {
           championship: response.data,
           teams: userTeams,
           teamsChampionships: teamsChampionships,
        }
      }
    )
 
  };