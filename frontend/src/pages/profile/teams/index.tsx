import  Layout  from "../../../components/layout";
import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function MyTeams() {

    return (
        <Layout>
            <Box>
                <h1>My Teams</h1>
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