import { Flex, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { IoMdImages } from "react-icons/io";

const CreatePostActions = ({ inputs, setInput, setImgUrl }) => {
  const imageRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setInput({...inputs, file: file });
    setImgUrl(URL.createObjectURL(file));
    document.getElementById("image-input").value = "";
};
  return (
    <Flex gap={3}>
      <Input
        id="image-input"
        type="file"
        hidden
        ref={imageRef}
        onChange={handleImageChange}
      />
      < IoMdImages
        style={{ cursor: "pointer" }}
        size={20}
        onClick={() => imageRef.current.click()}
      />
    </Flex>
  );
};

export default CreatePostActions;
