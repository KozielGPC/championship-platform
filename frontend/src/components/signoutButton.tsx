
import { Box, Button } from '@chakra-ui/react';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
export const SignoutButton: React.FC = () => {
    
    const { signout } = useContext(UserContext);
    const handleSignout = () => {
        signout();
    };

    return (
        <Box textAlign={'center'}>
            <Button colorScheme={'cyan'} variant="ghost" onClick={handleSignout}>
                <ArrowBackIcon boxSize={6}></ArrowBackIcon>
                <Box mb="2px " p={"5px"} pr={"10px"}>Signout</Box>
            </Button>
        </Box>
    );
};