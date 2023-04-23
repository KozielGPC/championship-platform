
import { Box, Button } from '@chakra-ui/react';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
export const SignoutButton: React.FC = () => {
    
    const { signout } = useContext(UserContext);
    const handleSignout = () => {
        signout();
    };

    return (
        <Box >
            <Button colorScheme={"blue"} variant="ghost" onClick={handleSignout}>Signout</Button>
        </Box>
    );
};