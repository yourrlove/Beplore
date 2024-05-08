'use strict';

const cloudinary = require('../configs/cloudinary.config');

const folderName = 'Beplore/';

const uploadImage = async ({ path, name }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: name,
            folder: folderName
        });
        return {
            image_url: result.secure_url
        }
    } catch (err) {
        throw new Error(err);
    }
}

const uploadMultipleImages = async ({ files, folderName, name}) => {
    const imagesToUpload = files.map( async (file, index) => {
        return await uploadImageFromLocal({
            path: file.path,
            name: `${name}-${index}`,
            folderName: folderName
        });
    });
    return await Promise.all(imagesToUpload);
}

const destroyImage = async (path) => {
    return await cloudinary.uploader.destroy(`${folderName}${path.split('/').pop().split('.')[0]}`);
}

module.exports = {
    uploadImage,
    uploadMultipleImages,
    destroyImage
}