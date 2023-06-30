import { Box, Flex, useToast } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Textarea,
    Select,
    Heading
  } from "@chakra-ui/react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { getChampionshipById } from "@/services/championship/retrieve";
import {Team} from '@/interfaces'
import { editTeam } from "../../../../services/team/update";
import { getTeamById } from "@/services/team/retrieve";

interface PropsEditTeam {
  id: number,
  team: Team
}

export interface EditTeam {
  name: string,
  password: string
}

export default function EditTeam({id,team}:PropsEditTeam) {
    const router = useRouter();
    const [formData, setFormData] = useState<EditTeam>(team);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState(formData.password)
    const toast = useToast();
    const [pass, setPass] =  useState(formData.password)

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        const payload = formData;
        if(formData.password !== confirmPassword){
            toast({
                title: "Passwords do not match.",
                description: "Please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        else{
            const response = await editTeam({id: id ,data: payload});
            if(response){
            toast(
                {
                title: response.message,
                status: response.status,
                duration: 3000,
                isClosable: true,
                }
            )
            if(response.status=="success"){
                router.push("/profile/teams");
            }
            setIsLoading(false)
            }
        }
      };
    
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === '') {
        setConfirmPassword(formData.password);
      } else {
        setConfirmPassword(value);
      }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          if (value === ''){
             formData.password = pass;
          } else {
             formData.password = value;
          }
    };

    return(
        <Layout>
            <Flex width="100%" height="94vh" bg="#555555" justifyContent={"center"} alignItems="center">
                <Box
                bg="#ffffff"
                p="8"
                rounded="md"
                boxShadow="md"
                w={{ base: "90%", sm: "80%", md: "70%" }}
                h={"max-content"}
                maxHeight={"90%"}
                overflowY={"auto"}
                >
                    <Heading mb="6" textAlign="center">
                        Edit {team?.name}
                    </Heading>
                    <form onSubmit={handleFormSubmit}>
                            
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                type="text"
                                name="name"
                                value={formData?.name}
                                onChange={handleInputChange}
                                placeholder="Type the name of championship"
                                />

                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                type="password"
                                name="password"
                                onChange={handlePasswordChange}
                                placeholder="Type the password"
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                type="password"
                                name="confirmPassword"               
                                onChange={handleConfirmPasswordChange}
                                placeholder="Confirm the password"
                                />
                            </FormControl>

                            <Button type="submit" mt={4}>
                                <>Edit</>
                            </Button>
                    </form>
                </Box>
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
          permanent: false,
        }
      }
    }

    const { id } = context.query;

    if(!id){
        return {
            redirect: {
              destination: '/profile/teams',
              permanent: false,
            }
          }
    }

    const response = await getTeamById(id.toString());
    if(response.status == "error"){
        return {
            redirect: {
              destination: '/404',
              permanent: false,
            }
          }
    }
    
    const formattedTeam = {
        name: response.data?.name,
        password: response.data?.password
      }

    return({
        props: {
            team:formattedTeam,
            id: id
        }
    })
  };  