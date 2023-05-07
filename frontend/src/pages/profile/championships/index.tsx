import  Layout  from "../../../components/layout";
import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function MyChampionships() {

    return (
        <Layout>
            <Box>
                <h1>My Championships</h1>
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