import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

const TestPage = () => {
  const modal1 = useDisclosure()
  const modal2 = useDisclosure()
  
  return (
    <>
      <Button onClick={modal1.onOpen}>Open Modal 1</Button>
      <Button onClick={modal2.onOpen}>Open Modal 2</Button>

      <Modal isOpen={modal1.isOpen} onClose={modal1.onClose}>
        <ModalContent>
          <Text> HI </Text>
        </ModalContent>

      </Modal>
      
      <Modal isOpen={modal2.isOpen} onClose={modal2.onClose}>
      </Modal>
    </>
  )
};
export default TestPage;
