"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tarea = void 0;
// Imports (si usas una librería para UUID, debe ir aquí) 
const uuid_1 = require("uuid");
class Tarea {
    // Constructor: Asegura valores por defecto y obligatorios (PE: Validá entradas [cite: 382])
    constructor(titulo, descripcion, dificultad = 'Fácil', // Valor por defecto: Fácil [cite: 65]
    fechaVencimiento) {
        // Asignación de atributos (POO: Oculta detalles internos )
        this.id = (0, uuid_1.v4)(); // ¡UUID implementado! [cite: 334]
        this.titulo = titulo;
        this.descripcion = descripcion || "";
        this.estado = 'Pendiente'; // Valor por defecto: Pendiente [cite: 65]
        this.dificultad = dificultad;
        // Fechas
        this.fechaCreacion = new Date();
        this.fechaVencimiento = fechaVencimiento;
        this.ultimaEdicion = this.fechaCreacion; // Inicialmente igual a Creación [cite: 216, 217]
    }
    // --- Métodos Mutadores (Setters) ---
    // (POO: Nomenclatura orientada a acciones [cite: 387])
    ValidarTitulo(titulo) {
        if (!titulo || titulo.length > 100) {
            throw new Error("El titulo es obligatorio y debe tener menos de 100 caracteres.");
        }
    }
    /**
     * Actualiza el estado de la tarea y la fecha de última edición.
     */
    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
        this.actualizarFechaEdicion();
    }
    /**
     * Actualiza la dificultad de la tarea y la fecha de última edición.
     */
    setDificultad(nuevaDificultad) {
        this.dificultad = nuevaDificultad;
        this.actualizarFechaEdicion();
    }
    /**
     * Actualiza los datos principales de la tarea.
     */
    update(titulo, descripcion, dificultad, estado, fechaVencimiento) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.dificultad = dificultad;
        this.estado = estado;
        this.fechaVencimiento = fechaVencimiento;
        this.actualizarFechaEdicion();
    }
    /**
     * Método privado para centralizar la actualización de la fecha de edición.
     * (POO: Oculta detalles internos )
     */
    actualizarFechaEdicion() {
        this.ultimaEdicion = new Date(); // Actualizar fecha de edición (Bonus/Req. obligatorio) [cite: 216]
    }
    // --- Métodos de Acceso (Getters) ---
    // (POO: Exponer sólo lo necesario )
    /**
     * Método para obtener la representación de la dificultad (Bonus/Req. obligatorio) [cite: 186]
     */
    getDificultadVisual() {
        // Implementación de lógica de emojis/caracteres [cite: 186, 187, 188]
        switch (this.dificultad) {
            case 'Fácil': return '★☆☆';
            case 'Medio': return '★★☆';
            case 'Difícil': return '★★★';
            default: return '';
        }
    }
    getId() { return this.id; }
    getTitulo() { return this.titulo; }
    getDescripcion() { return this.descripcion; }
    getEstado() { return this.estado; }
    getDificultad() { return this.dificultad; }
    getFechaCreacion() { return this.fechaCreacion; }
    getFechaVencimiento() { return this.fechaVencimiento; }
    getUltimaEdicion() { return this.ultimaEdicion; }
}
exports.Tarea = Tarea;
