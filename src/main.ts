// 1. Importamos tu módulo de entradas (Reemplaza a Inquirer)
import { input } from './entradas'; 

// 2. Importamos el resto de la lógica
import { gestorTareas } from './gestorTareas';
import { PersistenciaJSON } from './persistenciaJSON';
import { PersistenciaSQL } from './persistenciaSQL';
import { Tarea } from './tareas';

// ==========================================
// CONFIGURACIÓN DE LA ESTRATEGIA (PATTERN)
// ==========================================

// Opción A: Usar JSON
// const estrategia = new PersistenciaJSON();

// Opción B: Usar SQL (SQLite)
const estrategia = new PersistenciaSQL();

// Inyectamos la estrategia
const gestor = new gestorTareas(estrategia);

// ==========================================
// PROGRAMA PRINCIPAL
// ==========================================

function main() {
    let salir = false;

    while (!salir) {
        // Limpiamos consola (opcional, a veces falla en algunas terminales de Windows)
        console.clear(); 
        
        console.log("\n========================================");
        console.log("   GESTOR DE TAREAS (Modo SQL)          ");
        console.log("========================================");
        console.log("1. Ver Mis Tareas");
        console.log("2. Buscar una Tarea");
        console.log("3. Agregar una Tarea");
        console.log("4. Eliminar una Tarea");
        console.log("----------------------------------------");
        console.log("0. Salir");
        console.log("========================================");

        // Usamos tu función input() de entradas.ts
        const opcion = input("Elige una opción: ");

        switch (opcion) {
            case '1':
                console.log("\n--- LISTA DE TAREAS ---");
                const tareas = gestor.obtenerTodasLasTareas();
                mostrarTareas(tareas);
                pausa();
                break;

            case '2':
                const termino = input("\nIngresa palabra clave del título: ");
                const encontradas = gestor.buscarTareasPorTitulo(termino);
                console.log(`\nResultados para "${termino}":`);
                mostrarTareas(encontradas);
                pausa();
                break;

            case '3':
                console.log("\n--- NUEVA TAREA ---");
                const titulo = input("Título (Obligatorio): ");
                
                if (!titulo) {
                    console.log("❌ El título no puede estar vacío.");
                } else {
                    const desc = input("Descripción (Opcional): ");
                    
                    console.log("Dificultad: 1. Fácil | 2. Medio | 3. Difícil");
                    const difOpcion = input("Elige número: ");
                    
                    let dificultad: any = 'Fácil';
                    if (difOpcion === '2') dificultad = 'Medio';
                    if (difOpcion === '3') dificultad = 'Difícil';

                    // Nota: fechaVencimiento es opcional, lo dejamos undefined por ahora
                    gestor.agregarTarea(titulo, desc, dificultad);
                    console.log("✅ ¡Tarea guardada en SQL!");
                }
                pausa();
                break;

            case '4':
                const idEliminar = input("\nIngresa el ID de la tarea a eliminar: ");
                const eliminado = gestor.eliminarTarea(idEliminar);
                if (eliminado) {
                    console.log("🗑️ Tarea eliminada (Soft Delete aplicado).");
                } else {
                    console.log("❌ No se encontró la tarea o ya estaba eliminada.");
                }
                pausa();
                break;

            case '0':
                salir = true;
                console.log("¡Nos vemos!");
                break;

            default:
                console.log("Opción no válida.");
                pausa();
                break;
        }
    }
}

// Función auxiliar para mostrar la lista bonita
function mostrarTareas(lista: Tarea[]) {
    if (lista.length === 0) {
        console.log("No hay tareas registradas.");
        return;
    }
    
    lista.forEach((t, i) => {
        console.log(`\n[${i + 1}] Título: ${t.getTitulo()} ${t.getDificultadVisual()}`);
        console.log(`    Estado: ${t.getEstado()} | ID: ${t.getId()}`); // Mostramos ID para poder borrar
        if (t.getDescripcion()) console.log(`    Desc:   ${t.getDescripcion()}`);
    });
}

// Función para pausar la pantalla
function pausa() {
    input("\nPresiona ENTER para continuar...");
}

// ¡EJECUTAMOS LA FUNCIÓN! (Esto era lo que faltaba antes)
main();