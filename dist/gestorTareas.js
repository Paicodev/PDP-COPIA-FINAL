"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gestorTareas = void 0;
const tareas_1 = require("./tareas");
class gestorTareas {
    // Modificamos el constructor para recibir la estrategia
    constructor(estrategia) {
        this.tareas = [];
        this.persistencia = estrategia;
        this.tareas = this.persistencia.cargar(); // Cargamos usando la estrategia
    }
    // Método privado para guardar usando la estrategia actual
    guardar() {
        this.persistencia.guardar(this.tareas);
    }
    agregarTarea(titulo, descripcion, dificultad, fechaVencimiento) {
        const nuevaTarea = new tareas_1.Tarea(titulo, descripcion, dificultad, fechaVencimiento);
        this.tareas.push(nuevaTarea);
        this.guardar(); // Guardamos cambios
        return nuevaTarea;
    }
    obtenerTareaPorId(id) {
        return this.tareas.find(tarea => tarea.getId() === id);
    }
    obtenerTodasLasTareas() {
        return [...this.tareas];
    }
    obtenerTareasActivas() {
        return this.tareas.filter(tarea => tarea.getEstado() !== 'Cancelada');
    }
    buscarTareasPorTitulo(termino) {
        const terminoLower = termino.toLowerCase();
        return this.tareas.filter(tarea => tarea.getTitulo().toLowerCase().includes(terminoLower));
    }
    actualizarTarea(id, titulo, descripcion, dificultad, estado, fechaVencimiento) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea) {
            tarea.update(titulo, descripcion, dificultad, estado, fechaVencimiento);
            this.guardar(); // Guardamos cambios
            return true;
        }
        return false;
    }
    eliminarTarea(id) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea && tarea.getEstado() !== 'Cancelada') {
            tarea.setEstado('Cancelada');
            this.guardar(); // Guardamos cambios
            return true;
        }
        return false;
    }
}
exports.gestorTareas = gestorTareas;
