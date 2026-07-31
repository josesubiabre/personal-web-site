// Lista única de imágenes del carrusel de portada (public/main/).
// Añade o quita líneas aquí y todas las vistas se actualizan.
export const IMAGES = [
    "main/Farellones.jpg",
    "main/Formigal.jpg",
    "main/Lagos_Auto.jpg",
    "main/Madrid_Manuel_Becerra.jpg",
    "main/Madrid_Retiro.jpg",
    "main/Mendocino_Fungi.jpg",
    "main/Morocco_Fruits.jpg",
    "main/Morocco_Jars.jpg",
    "main/Morocco_Marrakesh.jpg",
    "main/Morocco_Marrakesh_Inside.jpg",
    "main/Morocco_Moto.jpg",
    "main/Morocco_Pray.jpg",
    "main/Papa_Muir_Woods.jpg",
    "main/Peregrino.jpeg",
    "main/San_Francisco_Marina_dia.jpg",
    "main/Tenerife_Airport.jpg",
    "main/Tenerife_Los_Gigantes.jpg",
    "main/Tikal.jpeg",
    "main/Tikal_Templo_Cinco.jpeg",
    "main/Atacama.JPG",
];

// Títulos personalizados por ruta. Si una imagen aparece aquí, se muestra
// este texto en vez del nombre del archivo. Ejemplo:
//   "main/Farellones.jpg": "farellones, cordillera de los andes",
const TITULOS: Record<string, string> = {
    "main/Peregrino.jpeg": "El Peregrino",
};

// "main/La_Reina_De_Babilonia.jpg" -> "La Reina De Babilonia"
export const titleFromSrc = (src: string) =>
    TITULOS[src] ??
    src.split("/").pop()!.replace(/\.[^.]+$/, "").replace(/_/g, " ");
