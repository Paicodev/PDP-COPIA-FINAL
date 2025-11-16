// Imports (si usas una librería para UUID, debe ir aquí) 
import { v4 as uuidv4 } from 'uuid';

// Definición de Tipos/Enums para Estado y Dificultad
export type TareaEstado = 'Pendiente' | 'En Curso' | 'Terminada' | 'Cancelada'; 
export type TareaDificultad = 'Fácil' | 'Medio' | 'Difícil'; 

export class Tarea {
    // Requerimiento: ID único numérico o UUID
    private id: string; 
    private titulo: string; // Requerido, máx 100 caracteres [cite: 65]
    private descripcion: string; // Opcional, máx 500 caracteres [cite: 65]
    private estado: TareaEstado; // Por defecto: Pendiente [cite: 65]
    private dificultad: TareaDificultad; // Por defecto: Fácil [cite: 65]
    
    // Requerimiento: Fechas obligatorias (antes eran Bonus)
    private fechaCreacion: Date; // Automática [cite: 65]
    private fechaVencimiento?: Date; // Opcional [cite: 65, 267]
    private ultimaEdicion: Date; // Si no se edita, igual a Creación [cite: 216, 217]

    // Constructor: Asegura valores por defecto y obligatorios (PE: Validá entradas [cite: 382])
    constructor(
        titulo: string, 
        descripcion?: string,
        dificultad: TareaDificultad = 'Fácil', // Valor por defecto: Fácil [cite: 65]
        fechaVencimiento?: Date
    ) {
        // Asignación de atributos (POO: Oculta detalles internos )
        this.id = uuidv4(); // ¡UUID implementado! [cite: 334]
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


    public ValidarTitulo(titulo: string): void{
    if(!titulo || titulo.length > 100){
        throw new Error("El titulo es obligatorio y debe tener menos de 100 caracteres.");
    }
}

 
    /**
     * Actualiza el estado de la tarea y la fecha de última edición.
     */
    public setEstado(nuevoEstado: TareaEstado): void {
        this.estado = nuevoEstado;
        this.actualizarFechaEdicion();
    }

    /**
     * Actualiza la dificultad de la tarea y la fecha de última edición.
     */
    public setDificultad(nuevaDificultad: TareaDificultad): void {
        this.dificultad = nuevaDificultad;
        this.actualizarFechaEdicion();
    }
    
    /**
     * Actualiza los datos principales de la tarea.
     */
    public update(
        titulo: string, 
        descripcion: string, 
        dificultad: TareaDificultad,
        estado: TareaEstado,
        fechaVencimiento?: Date
    ): void {
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
    private actualizarFechaEdicion(): void {
        this.ultimaEdicion = new Date(); // Actualizar fecha de edición (Bonus/Req. obligatorio) [cite: 216]
    }
    
    // --- Métodos de Acceso (Getters) ---
    // (POO: Exponer sólo lo necesario )

    /**
     * Método para obtener la representación de la dificultad (Bonus/Req. obligatorio) [cite: 186]
     */
    public getDificultadVisual(): string {
        // Implementación de lógica de emojis/caracteres [cite: 186, 187, 188]
        switch (this.dificultad) {
            case 'Fácil': return '★☆☆';
            case 'Medio': return '★★☆';
            case 'Difícil': return '★★★';
            default: return '';
        }
    }
    
    public getId(): string { return this.id; }
    public getTitulo(): string { return this.titulo; }
    public getDescripcion(): string { return this.descripcion; }
    public getEstado(): TareaEstado { return this.estado; }
    public getDificultad(): TareaDificultad { return this.dificultad; }
    public getFechaCreacion(): Date { return this.fechaCreacion; }
    public getFechaVencimiento(): Date | undefined { return this.fechaVencimiento; }
    public getUltimaEdicion(): Date { return this.ultimaEdicion; }

    

    

}

