import * as fs from 'fs';
import { Tarea } from './tareas';
import { IPersistencia } from './IPersistencia';

const RUTA_ARCHIVO = './tareas.json';

export class PersistenciaJSON implements IPersistencia {
    
    public guardar(tareas: Tarea[]): void {
        try {
            const datos = JSON.stringify(tareas, null, 2);
            fs.writeFileSync(RUTA_ARCHIVO, datos, 'utf-8');
        } catch (error) {
            console.error("Error al guardar JSON:", error);
        }
    }

    public cargar(): Tarea[] {
        if (!fs.existsSync(RUTA_ARCHIVO)) return [];
        
        try {
            const datos = fs.readFileSync(RUTA_ARCHIVO, 'utf-8');
            const json = JSON.parse(datos);
            
            // Rehidratación de objetos
            return json.map((t: any) => {
                 const tarea = new Tarea(t.titulo, t.descripcion, t.dificultad, t.fechaVencimiento ? new Date(t.fechaVencimiento) : undefined);
                 // Truco para asignar privados
                 (tarea as any).id = t.id;
                 (tarea as any).estado = t.estado;
                 (tarea as any).fechaCreacion = new Date(t.fechaCreacion);
                 (tarea as any).ultimaEdicion = new Date(t.ultimaEdicion);
                 return tarea;
            });
        } catch (error) {
            return [];
        }
    }
}