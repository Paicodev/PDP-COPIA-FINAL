import { Tarea } from './tareas'; // Asegúrate que la ruta coincida con tu archivo de Tarea

export interface IPersistencia {
    guardar(tareas: Tarea[]): void;
    cargar(): Tarea[];
}