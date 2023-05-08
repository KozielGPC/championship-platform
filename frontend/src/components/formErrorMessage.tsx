
import { Text } from '@chakra-ui/react';


interface FormErrorMessageProps {
    content: string;
  }
export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({content}) => {
    return (
        <Text marginLeft={'5px'} fontSize={'smaller'} color={"rgb(220,20,60)"}>
            {content}
        </Text>
    );
};