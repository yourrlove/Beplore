import { useState } from 'react'

const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
};
    return { handleImageChange, imgUrl };
}

export default usePreviewImage