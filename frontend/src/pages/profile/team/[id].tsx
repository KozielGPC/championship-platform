import  Layout  from "../../../components/layout";
import { Box, Image, Flex, Button, useToast, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Icon, FormControl, FormLabel, Select} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getTeamById, getTeams } from "@/services/team/retrieve";
import jwt_decode from "jwt-decode";
import { InviteUserToTeam, User } from "@/interfaces";
import { Team } from "@/interfaces";
import { useEffect, useState} from "react";
import {useRouter} from "next/router"; 
import {deleteTeam} from "@/services/team/delete";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import {ConfirmModal} from "@/components/confirmModal"
import { MdDeleteForever, MdStarOutline} from 'react-icons/md'
import { Payload, removeUser } from "@/services/team/remove";
import { getUserById, getUsers } from "@/services/users/retrieve";
import { UserInvite } from "@/services/team/invite";

interface Props {
  teamProp:Team,
  usersProp:Array<User>,
  ownerProp:User
}

export default function ShowTeam ({teamProp, usersProp, ownerProp}: Props) {
    const [team, setTeam] = useState<Team>();
    const [users, setUsers] = useState<Array<User>>();
    const [inviteUser, setInviteUser] = useState(0);
    const router = useRouter();
    const {id} = useContext(UserContext)
    const toast = useToast();
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
    const [idSelectedTeam , setIdSelectedTeam] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(
    () => {
        if(teamProp){
          setTeam(teamProp)
        }
      },[teamProp]
    )

    useEffect(
      () => {
          if(usersProp){
            setUsers(usersProp)
          }
        },[usersProp]
      )

    
    function handleConfirmModal(){
      if (inviteUser == 0) {
        toast({
          title: "Select a user.",
          description: "Please try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      setIsOpenConfirmModal(true);
    }
    
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if(!event.target.value){
        setInviteUser(0);
      }
      setInviteUser(parseInt(event.target.value));
    }

    const handleSubmit  = async () => {

      setIsLoading(true);
      const invite :InviteUserToTeam = {
        team_id: team?.id,
        user_id: inviteUser
      }

      const response = await UserInvite(invite);

      if(response.status == "error"){
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      } else {
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      }
      router.push("/profile/team/"+team?.id);
      setIsOpenConfirmModal(false);

      setIsLoading(false);
      return
    }

    const handleClick = async (user_id: Number)  => {
      const payload: Payload = {
        team_id: team?.id,
        user_id: user_id
      }
      const response = await removeUser(payload);
      if(response.status == 'error'){
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      } else {
        toast(
          {
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
          }
        )
      }
      const response2 = await getTeamById(teamProp.id.toString());
      if(response2.status == 'error'){
        toast(
          {
            title: response2.message,
            status: response2.status,
            duration: 3000,
            isClosable: true,
          }
        )
      } else {
        setTeam(response2.data)
        toast(
          {
            title: response2.message,
            status: response2.status,
            duration: 3000,
            isClosable: true,
          }
        )
      }

      const response3 =  await getUsers();
    
      const usersAllFiltered = response3.data?.filter((user) => !response2.data?.users.some((teamUser) => teamUser.id === user.id));
      const usersAllFiltered2 = usersAllFiltered?.filter((user) => user.id !== response2.data?.owner_id);

      setUsers(usersAllFiltered2)
  
      if(response2.status == "error"){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
      }
    }

    return (
        <Layout>
            <Image
              width={"100%"}
              maxHeight={'200px'}
              objectFit={'cover'}
              overflow={'hidden'}
              alt={'lol-image'}
              src={
                team?.game_id == 0 
                ?'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt8979808f7798ecf5/6216ee875fe07272a8a2447a/2021_Key_art.jpg'
                : 'https://iili.io/HrHUeYG.png'
              }
              borderLeft='1px solid white'
              borderBottom='1px solid white'
              borderRight='1px solid white'
              
              />
            <Box flexDirection={"column"} justifyContent={"center"} alignContent={"center"} display={"flex"} alignItems={"center"} w="100%">
              <Text fontFamily={"sans-serif"} fontWeight={"bold"} textShadow="3px 3px 5px rgba(0, 0, 0, 1)" fontSize={"5xl"} margin={"15px"} textColor={"white"}>
                {team?.name}
              </Text>
              
              <Box>
                <TableContainer>
                  <Table variant='simple' bgColor={"white"} colorScheme="black" border="1px black solid" w="60vw">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Teammates</Th>
                        { 
                        id == team?.owner_id ? 
                        <Th isNumeric>Actions</Th>
                        : 
                        <></>
                        }
                      </Tr>
                    </Thead>
                    <Tbody>
                    <Tr bgColor={"yellow.100"}>
                        <Td>{1}</Td>
                        <Td>{ownerProp.username} <Icon boxSize='15px' as={MdStarOutline}/></Td>
                        {
                        id == team?.owner_id ? (<Td></Td>) : (<></>)
                        }
                    </Tr>
                    {
                    team?.users ? 
                    (team.users).map((user, index) => (
                      user.id == ownerProp.id ?
                      <></>
                      :
                      <Tr key={index}>
                        <Td>{index+1}</Td>
                        <Td>{user.username}</Td>
                          { 
                          id == team?.owner_id ? 
                          <Td isNumeric><Button onClick={() => handleClick(user.id)} colorScheme="red"><Icon boxSize='25px' as={MdDeleteForever}/></Button></Td>
                          : 
                          <></>
                          }
                      </Tr>
                      )
                    )
                    :
                    <></>
                    }

                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              { 
              id == team?.owner_id ? 
              <Box w="25vw" pt="50px">
                <FormControl pb="10px">
                  <FormLabel color={'white'} htmlFor="selectOption">Select a user to invite:</FormLabel>
                  <Select bgColor={"white"} onChange={handleSelectChange} id="selectOption" placeholder={users?.length ? "Select a user": "No have users to invite"}>
                    { 
                    users ?
                      (users).map((user, index) => (
                        <option key={index} value={`${user.id}`}>{user.username}</option>
                      ))
                      : 
                      (<></>)
                    }
                  </Select>
                </FormControl>
                <Button onClick={handleConfirmModal} w="100%" colorScheme="blue"> Invite user to team </Button>
                <ConfirmModal
                      content="Are you sure you want to invite this player to this team?"
                      handleConfirm={handleSubmit}
                      isOpen={isOpenConfirmModal}
                      setIsOpen={setIsOpenConfirmModal}
                />
              </Box>
              : 
              <></>
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
    const userData:User = jwt_decode(token);

    const id_user = userData.id;
    const {id} = context.query; 
    if(!id){
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    const response = await getTeamById(id.toString());

    if(response.status == "error"){
      return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
    }

    if(response.data){
      const user = response.data.users.find(user => user.id === id_user);

      if(!(user || id_user == response.data.owner_id)){
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }

    const response3 = await getUserById((response ? response.data ? response.data.owner_id : -1 : -1).toString());


    if(response3.status == "error"){
      return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
    }
    
    const response2 =  await getUsers();
    
    const usersAllFiltered = response2.data?.filter((user) => !response.data?.users.some((teamUser) => teamUser.id === user.id));
    const usersAllFiltered2 = usersAllFiltered?.filter((user) => user.id !== response.data?.owner_id);

    if(response2.status == "error"){
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
          teamProp: response.data,
          usersProp: usersAllFiltered2,
          ownerProp: response3.data

        }
      }
    )
   
  };  
