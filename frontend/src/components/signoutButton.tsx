
import { Box, Button } from '@chakra-ui/react';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
export const SignoutButton: React.FC = () => {
    
    const router = useRouter();
    const { clearUser} = useContext(UserContext);
    const handleSignout = () => {
        destroyCookie(
            null,
            'championship-token',
            {
                path: '/',
            }
        );
        clearUser();
        router.push('/signin');
    };

    return (
        <Box >
            <Button colorScheme={"blue"} variant="ghost" onClick={handleSignout}>Signout</Button>
        </Box>
    );
};