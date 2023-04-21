import { ColorMode, useColorMode, Text, Box, Flex
, Heading, Button, FormControl, FormLabel, Input, useColorModeValue

} from "@chakra-ui/react"
import { useState } from "react";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(`Username: ${username}, Password: ${password}`);
    };

    return (
       <Box
      bg="#555555"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="#ffffff"
        p="8"
        rounded="md"
        boxShadow="md"
        w={{ base: "90%", sm: "80%", md: "50%" }}
      >
        <Heading mb="6" textAlign="center">
          Signin
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="username" mb="4" isRequired>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </FormControl>
          <FormControl id="password" mb="4" isRequired>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" w="100%">
            Login
          </Button>
        </form>
      </Box>
    </Box>
    )
  }
  