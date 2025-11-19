import { Tarea, TareaEstado, TareaDificultad } from './tareas';
import { IPersistencia } from './IPersistencia'; // Nuevo import

export class gestorTareas {
    private tareas: Tarea[] = [];
    private persistencia: IPersistencia; // La estrategia elegida

    // Modificamos el constructor para recibir la estrategia
    constructor(estrategia: IPersistencia) {
        this.persistencia = estrategia;
        this.tareas = this.persistencia.cargar(); // Cargamos usando la estrategia
    }

    // Método privado para guardar usando la estrategia actual
    private guardar(): void {
        this.persistencia.guardar(this.tareas);
    }

    public agregarTarea(titulo: string, descripcion?: string, dificultad?: TareaDificultad, fechaVencimiento?: Date): Tarea {
        const nuevaTarea = new Tarea(titulo, descripcion, dificultad, fechaVencimiento);
        this.tareas.push(nuevaTarea);
        this.guardar(); // Guardamos cambios
        return nuevaTarea;
    }

    public obtenerTareaPorId(id: string): Tarea | undefined {
        return this.tareas.find(tarea => tarea.getId() === id);
    }

    public obtenerTodasLasTareas(): Tarea[] {
        return [...this.tareas];
    }
    
    public obtenerTareasActivas(): Tarea[] {
        return this.tareas.filter(tarea => tarea.getEstado() !== 'Cancelada');
    }
    
    public buscarTareasPorTitulo(termino: string): Tarea[] {
        const terminoLower = termino.toLowerCase();
        return this.tareas.filter(tarea => 
            tarea.getTitulo().toLowerCase().includes(terminoLower)
        );
    }

    public actualizarTarea(id: string, titulo: string, descripcion: string, dificultad: TareaDificultad, estado: TareaEstado, fechaVencimiento?: Date): boolean {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea) {
            tarea.update(titulo, descripcion, dificultad, estado, fechaVencimiento);
            this.guardar(); // Guardamos cambios
            return true;
        }
        return false;
    }

    public eliminarTarea(id: string): boolean {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea && tarea.getEstado() !== 'Cancelada') { 
            tarea.setEstado('Cancelada'); 
            this.guardar(); // Guardamos cambios
            return true;
        }
        return false;
    }
}