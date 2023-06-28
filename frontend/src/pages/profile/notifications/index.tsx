import { Notification } from "@/interfaces";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useContext, useEffect } from "react";
import UserContext from "@/context/UserContext";
import { Box, Text, Flex, Button, useToast } from "@chakra-ui/react";
import Layout from "@/components/layout";
import { acceptInvite } from "@/services/team/acceptInvite";

function Notifications() {
  const { id, notifications, getNotifications } = useContext(UserContext);
  const toast = useToast();
  const router = useRouter();

  interface handleInviteProps {
    notification: Notification;
    accept: boolean;
  }

  useEffect(() => {
    getNotifications();
  }, []);

  async function handleInvite({ notification, accept }: handleInviteProps) {
    let data = {
      team_id:notification.team_id ,
      user_id: id,
      notification_id: notification.id,
      accepted: accept,
    };
    const response = await acceptInvite(data);
    if (response) {
      toast({
        title: response.message,
        status: response.status=="error"?"error":'info',
        duration: 3000,
        isClosable: true,
      });
      if (response.status == "success" && response.data) {
        await getNotifications();
        if (accept) {
          return router.push(`/profile/team/${response.data.team_id}`);
        }
      }
    }
  }

  return (
    <Layout>
      <Flex flexDirection={"column"} width={"100%"} color={"white"} p={10}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification: Notification, index) => (
            <Flex
              height={"60px"}
              justifyContent={"space-between"}
              alignItems={"center"}
              p={2}
              key={notification.id}
              width={"200"}
              borderBottom={"1px solid white"}
              opacity={notification.visualized ? 0.5 : 1}
            >
              <Text>
                {notification.sender_name} invited you to team{" "}
                <b>{notification.team_name}</b>
              </Text>

              {!notification.visualized && (
                <Flex width={"170px"} justifyContent={"space-between"}>
                  <Button
                    colorScheme="green"
                    onClick={() =>
                      handleInvite({ notification: notification, accept: true })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() =>
                      handleInvite({
                        notification: notification,
                        accept: false,
                      })
                    }
                  >
                    Deny
                  </Button>
                </Flex>
              )}
            </Flex>
          ))
        ) : (
          <Text>Não há notificações</Text>
        )}
      </Flex>
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

  return {
    props: {},
  };
};

export default Notifications;
