"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Importamos tu módulo de entradas (Reemplaza a Inquirer)
const entradas_1 = require("./entradas");
// 2. Importamos el resto de la lógica
const gestorTareas_1 = require("./gestorTareas");
const persistenciaSQL_1 = require("./persistenciaSQL");
// ==========================================
// CONFIGURACIÓN DE LA ESTRATEGIA (PATTERN)
// ==========================================
// Opción A: Usar JSON
// const estrategia = new PersistenciaJSON();
// Opción B: Usar SQL (SQLite)
const estrategia = new persistenciaSQL_1.PersistenciaSQL();
// Inyectamos la estrategia
const gestor = new gestorTareas_1.gestorTareas(estrategia);
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
        const opcion = (0, entradas_1.input)("Elige una opción: ");
        switch (opcion) {
            case '1':
                console.log("\n--- LISTA DE TAREAS ---");
                const tareas = gestor.obtenerTodasLasTareas();
                mostrarTareas(tareas);
                pausa();
                break;
            case '2':
                const termino = (0, entradas_1.input)("\nIngresa palabra clave del título: ");
                const encontradas = gestor.buscarTareasPorTitulo(termino);
                console.log(`\nResultados para "${termino}":`);
                mostrarTareas(encontradas);
                pausa();
                break;
            case '3':
                console.log("\n--- NUEVA TAREA ---");
                const titulo = (0, entradas_1.input)("Título (Obligatorio): ");
                if (!titulo) {
                    console.log("❌ El título no puede estar vacío.");
                }
                else {
                    const desc = (0, entradas_1.input)("Descripción (Opcional): ");
                    console.log("Dificultad: 1. Fácil | 2. Medio | 3. Difícil");
                    const difOpcion = (0, entradas_1.input)("Elige número: ");
                    let dificultad = 'Fácil';
                    if (difOpcion === '2')
                        dificultad = 'Medio';
                    if (difOpcion === '3')
                        dificultad = 'Difícil';
                    // Nota: fechaVencimiento es opcional, lo dejamos undefined por ahora
                    gestor.agregarTarea(titulo, desc, dificultad);
                    console.log("✅ ¡Tarea guardada en SQL!");
                }
                pausa();
                break;
            case '4':
                const idEliminar = (0, entradas_1.input)("\nIngresa el ID de la tarea a eliminar: ");
                const eliminado = gestor.eliminarTarea(idEliminar);
                if (eliminado) {
                    console.log("🗑️ Tarea eliminada (Soft Delete aplicado).");
                }
                else {
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
function mostrarTareas(lista) {
    if (lista.length === 0) {
        console.log("No hay tareas registradas.");
        return;
    }
    lista.forEach((t, i) => {
        console.log(`\n[${i + 1}] Título: ${t.getTitulo()} ${t.getDificultadVisual()}`);
        console.log(`    Estado: ${t.getEstado()} | ID: ${t.getId()}`); // Mostramos ID para poder borrar
        if (t.getDescripcion())
            console.log(`    Desc:   ${t.getDescripcion()}`);
    });
}
// Función para pausar la pantalla
function pausa() {
    (0, entradas_1.input)("\nPresiona ENTER para continuar...");
}
// ¡EJECUTAMOS LA FUNCIÓN! (Esto era lo que faltaba antes)
main();
