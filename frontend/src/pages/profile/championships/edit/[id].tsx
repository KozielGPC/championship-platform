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
import {Championship} from '@/interfaces'
import { editChampionship } from "../../../../services/championship/update";

interface PropsEditChampionship {
    id: number,
    championship:  Championship
}

export interface EditChampionship {
    name: string,
    start_time: string,
    created_at: string,
    min_teams: number,
    max_teams: number,
    prizes: string,
    format: string,
    round: number,
    rules: string,
    contact: string,
    visibility: string
}

export default function EditChampionship({id,championship}:PropsEditChampionship) {
    const router = useRouter();
    const [formData, setFormData] = useState<EditChampionship>(championship);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        const payload = formData;
        payload.round = championship.round ? championship.round : 1
        const response = await editChampionship({id: id ,data: payload});
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
            router.push("/profile/championships");
          }
          setIsLoading(false)
        }
        
      };
    

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
    
    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
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
                        Edit Championship
                    </Heading>
                    <form onSubmit={handleFormSubmit}>
                            
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Type the name of championship"
                                required
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Start date and time</FormLabel>
                                <Input
                                type="datetime-local"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                required
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Minimum of teams</FormLabel>
                                <Input
                                type="number"
                                name="min_teams"
                                value={formData.min_teams}
                                onChange={handleInputChange}
                                min="2"
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Maximum of teams</FormLabel>
                                <Input
                                type="number"
                                name="max_teams"
                                value={formData.max_teams}
                                onChange={handleInputChange}
                                min={formData.min_teams}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Prizes</FormLabel>
                                <Textarea
                                name="prizes"
                                value={formData.prizes}
                                onChange={handleInputChange}
                                placeholder="Type the prizes of championship"
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Format</FormLabel>
                                <Select
                                name="format"
                                value={formData.format}
                                onChange={handleSelectChange}
                                >
                                <option value="chaveamento">Brackets</option>
                                <option value="pontos_corridos">Round-Robin</option>
                                </Select>
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Regras</FormLabel>
                                <Textarea
                                name="rules"
                                value={formData.rules}
                                onChange={handleInputChange}
                                placeholder="Type the rules of championship"
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Contact</FormLabel>
                                <Input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                placeholder="Type the contact of championship"
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Visibility</FormLabel>
                                <Select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleSelectChange}
                                >
                                <option value="publico">Public</option>
                                <option value="privado">Private</option>
                                </Select>
                            </FormControl>

                            <Button type="submit" mt={4} disabled={isLoading}>
                                <>{isLoading?"Editing...":"Edit Championship"}</>
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
              destination: '/profile/championships',
              permanent: false,
            }
          }
    }

    const response = await getChampionshipById(id.toString());
    if(response.status == "error"){
        return {
            redirect: {
              destination: '/404',
              permanent: false,
            }
          }
    }
    
    const formattedChampionship = {
        name: response.data?.name,
        start_time: response.data?.start_time,
        min_teams: response.data?.min_teams,
        max_teams: response.data?.max_teams,
        prizes: response.data?.prizes,
        format: response.data?.format,
        rules: response.data?.rules,
        contact: response.data?.contact,
        visibility: response.data?.visibility,
      }

    return({
        props: {
            championship:formattedChampionship,
            id: id
        }
    })
  };  