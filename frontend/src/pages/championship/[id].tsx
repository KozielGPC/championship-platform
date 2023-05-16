import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { Championship, User } from "../../interfaces";
import { getChampionshipById, getChampionships } from "@/services/championship/retrieve";
 
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChampionshipHeader from '@/components/championshipHeader';
 
interface PropsEditChampionship {
  championship:  Championship
}
 
export default function CurrentChampionship({championship}: PropsEditChampionship) {
    const [currentChampionship, setcurrentChampionship] = useState<Championship>();
    const router = useRouter();
 
  useEffect(() => {
    if(championship){
        setcurrentChampionship(championship)
      }
 
    },[])
 
  return(
     <Layout>
        <ChampionshipHeader championship={currentChampionship}></ChampionshipHeader>
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
    console.log(response)
 
    if(response.status == "error"){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
    }
 
    return(
      {
        props: {
           championship: response.data
        }
      }
    )
 
  };