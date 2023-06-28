import { Box, Button, FormLabel, Input } from "@chakra-ui/react"
import { useState } from "react"

type Props = {
    content: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    handleConfirm: () => void
    handleResultChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ConfirmResultModal: React.FC<Props>= ({isOpen,setIsOpen,content, handleConfirm, handleResultChange}) => {


    const [resultado, setResultado] = useState("Result");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResultado(event.target.value);
        handleResultChange(event); // Chame a função de callback
      };

    return(
        <Box
            display={isOpen? "block" : "none"}
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="9999"
            backgroundColor="rgba(0,0,0,0.3)"
        >
            <Box
                position="relative"
                width="100%"
                maxWidth="500px"
                top="50%"
                left="50%"
                transform="translate(-50%,-50%)"
                backgroundColor="white"
                p="4"
                borderRadius="md"
                textAlign="center"
            >
                <Box mb="15px"
                    color={"black"}
                    fontSize="xl"
                    fontWeight="bold"
                >
                    {content}
                </Box>
                <Box>
                    <FormLabel ml="5px" color={"black"}> Write result of match:</FormLabel>
                    <Input mb="15px" color={"black"} type="text" placeholder="Write result of match" value={resultado} onChange={handleInputChange}/>
                    
                    <Button colorScheme={'green'} mr="2" p="2" onClick={()=>handleConfirm()}>
                        Confirm
                    </Button>
                    <Button colorScheme="red"  ml="2" p="2" onClick={()=>setIsOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}