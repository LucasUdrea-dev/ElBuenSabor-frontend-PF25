// useCloudinary.tsx
import { ChangeEvent, useState } from 'react';

export const useCloudinary = () => {
    const preset_name = "mi_preset";
    const cloud_name = "dpont8evl";

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);



    const uploadImage = async (e: ChangeEvent<HTMLInputElement>): Promise<string | null> => {
        const files = e.target.files;

        //Valida que: files no sea null
        if (!files || files.length === 0) {
            return null;
        }


        //Preparar datos para enviar
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);


        //Activar estado de carga
        setLoading(true);


        //petición a Cloudinary
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();
            setImage(file.secure_url);
            setLoading(false);
            return file.secure_url; // Retornamos la URL para usarla donde queramos

            
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
            return null;
        }
    };

    return {
        image,
        loading,
        uploadImage,
        setImage // Por si necesitas setear la imagen manualmente
    };
};