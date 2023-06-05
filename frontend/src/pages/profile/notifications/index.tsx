import { Notification } from "@/interfaces";
import {GetServerSideProps} from 'next'
import { parseCookies } from "nookies";
import {useContext} from 'react'
import UserContext from "@/context/UserContext";
import { Box, Text,Flex } from "@chakra-ui/react";
import Layout from "@/components/layout";

function Notifications() {

    const {notifications} = useContext(UserContext);

    return(
        <Layout>
            <Flex width={'100%'} color={'white'} p={10}>
                {
                    notifications && notifications.length>0
                    ?
                        notifications.map((notification:Notification) => (
                            <Box p={2} key={notification.id}>
                                <Text>{notification.text}</Text>
                            </Box>
                        ))
                    :
                        <Text>Não há notificações</Text>
                }
            </Flex>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { "championship-token" : token } = parseCookies(context);
    if(!token){
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
        }
    }
}

export default Notifications;
