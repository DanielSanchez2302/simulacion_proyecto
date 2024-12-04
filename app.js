// 1
const solicitud = async (url) => {
    const respuesta = await fetch(url);
    return await respuesta.json();
};

// 2
const obtenerUsuarios = async () => await solicitud('http://127.0.0.1:3000/usuarios');

// 3
const obtenerCiudades = async () => await solicitud('http://127.0.0.1:3000/ciudades');

// 4
const obtenerTodasLasMaterias = async () => await solicitud('http://127.0.0.1:3000/materias');

// 5
const obtenerMateriasUsuario = async (userId) => 
    await solicitud(`http://127.0.0.1:3000/materias?userId=${userId}`);

const obtenerNotas = async (userId) => 
    await solicitud(`http://127.0.0.1:3000/notas?userId=${userId}`);

// 6
const calcularPromedioNotas = async (materiasUsuario) => {
    const totalNotas = materiasUsuario.reduce((suma, materia) => suma + materia.nota, 0);
    const promedio = materiasUsuario.length ? totalNotas / materiasUsuario.length : 0;
    return promedio;
};

// 7
const cargarDatos = async () => {
    // 8
    const [usuarios, ciudades, todasLasMaterias, ] = await Promise.all([
        obtenerUsuarios(),
        obtenerCiudades(),
        obtenerTodasLasMaterias()
    ]);

    // 9
    const resultados = await Promise.all(
        usuarios.map(async (usuario) => {
            const materiasUsuario = await obtenerMateriasUsuario(usuario.id);
            const promedio = await calcularPromedioNotas(materiasUsuario);

            // 10
            const ciudad = ciudades.find((c) => c.id === usuario.ciudadId);
            const nombreCiudad = ciudad ? ciudad.name : "1:BUCARAMANGA, 2:FLORIDABLANCA, 3:GIRON, 4:PIEDECUESTA, 5:LEBRIJA";

            // 11
            const materiasNoMatriculadas = todasLasMaterias.filter(
                (materia) => !materiasUsuario.some((mat) => mat.id === materia.id)
            );

            return {
                ...usuario,
                ciudad: nombreCiudad,
                promedio,
                materiasMatriculadas: materiasUsuario,
                materiasNoMatriculadas,
            };
        })
    );

    return resultados;
};

// 12
cargarDatos().then((datos) => {
    console.log("Usuarios con detalles completos:", datos);

    // 13
    datos.forEach((usuario) => {
        console.log(`Usuario: ${usuario.nombre}, Ciudad: ${usuario.ciudad}`);
        console.log("Materias Matriculadas:");
        usuario.materiasMatriculadas.forEach((materia) => 
            console.log(`  - Materia: ${materia.nombre}, Nota: ${materia.nota}`)
        );

        console.log("Materias No Matriculadas:");
        usuario.materiasNoMatriculadas.forEach((materia) =>
            console.log(`  - Materia: ${materia.nombre}`)
        );

        console.log(`Promedio de Notas: ${usuario.promedio.toFixed(2)}\n`);
    });
});

/*explicacion:

1. Función que realiza una solicitud y devuelve la respuesta en formato JSON
2. Función para obtener todos los usuarios
3. Función para obtener todas las ciudades
4. Función para obtener todas las materias disponibles
5. Función para obtener las materias matriculadas por el usuario
6. Función para calcular el promedio de las notas de un usuario
7. Función principal que organiza y muestra los datos
8. Obtenemos todos los usuarios, ciudades y materias
9. Procesamos los datos de cada usuario
10. Encontrar la ciudad del usuario
11. Identificar las materias no matriculadas
12. Ejecutar la función principal y mostrar los resultados
13. Mostrar las notas y materias no matriculadas para cada usuario */


