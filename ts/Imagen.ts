export async function subirImagen(imagen: File){

    const formData = new FormData();
    formData.append("imagen", imagen)

    try {
        const response = await fetch(`http://localhost:8080/api/imagenes`, {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            return true
        }else{
            return false
        }

    } catch (error) {
        console.error("Error:", error)
        alert("No se pudo conectar al servidor")
        return false
    }


}

export async function borrarImagen(nombreImagen: string) {
    
    const response = await fetch(`http://localhost:8080/api/imagenes/${nombreImagen}`, {
        method: "DELETE"
    })

    if (response.ok) {
        return true
    } else {
        return false
    }

}

export function obtenerImagen(nombreImagen: string) {
    
    const url: string = `img/${nombreImagen}`

    return url;

}