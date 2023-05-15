import { Box, Button } from "@chakra-ui/react"

type Props = {
    content: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    handleConfirm: () => void
}

export const ConfirmModal: React.FC<Props>= ({isOpen,setIsOpen,content, handleConfirm}) => {

    //Create a modal to confirm the action of delete a team
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
                <Box mb="4"
                    fontSize="xl"
                    fontWeight="bold"
                >
                    {content}
                </Box>
                <Box>
                    <Button colorScheme={'red'} mr="2" p="2" onClick={()=>handleConfirm()}>
                        Confirm
                    </Button>
                    <Button  ml="2" p="2" onClick={()=>setIsOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}