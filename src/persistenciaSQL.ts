import Database from 'better-sqlite3';
import { Tarea } from './tareas';
import { IPersistencia } from './IPersistencia';

export class PersistenciaSQL implements IPersistencia {
    private db: any;

    constructor() {
        // Esto creará un archivo 'database.sqlite' en la raíz de tu proyecto
        this.db = new Database('database.sqlite');
        this.inicializarTabla();
    }

    private inicializarTabla() {
        // Crea la tabla si no existe
        const sql = `
            CREATE TABLE IF NOT EXISTS tareas (
                id TEXT PRIMARY KEY,
                titulo TEXT,
                descripcion TEXT,
                estado TEXT,
                dificultad TEXT,
                fechaCreacion TEXT,
                fechaVencimiento TEXT,
                ultimaEdicion TEXT
            )
        `;
        this.db.exec(sql);
    }

    public guardar(tareas: Tarea[]): void {
        // Usamos una transacción para borrar todo e insertar lo actual
        // (Es la forma más fácil de sincronizar el array en memoria con la DB)
        const insert = this.db.prepare(`
            INSERT INTO tareas (id, titulo, descripcion, estado, dificultad, fechaCreacion, fechaVencimiento, ultimaEdicion)
            VALUES (@id, @titulo, @descripcion, @estado, @dificultad, @fechaCreacion, @fechaVencimiento, @ultimaEdicion)
        `);

        const deleteMany = this.db.prepare('DELETE FROM tareas');

        const transaction = this.db.transaction(() => {
            deleteMany.run(); // Limpiamos la tabla
            for (const t of tareas) {
                insert.run({
                    id: t.getId(),
                    titulo: t.getTitulo(),
                    descripcion: t.getDescripcion(),
                    estado: t.getEstado(),
                    dificultad: t.getDificultad(),
                    fechaCreacion: t.getFechaCreacion().toISOString(),
                    fechaVencimiento: t.getFechaVencimiento()?.toISOString() || null,
                    ultimaEdicion: t.getUltimaEdicion().toISOString()
                });
            }
        });

        transaction();
    }

    public cargar(): Tarea[] {
        const stmt = this.db.prepare('SELECT * FROM tareas');
        const filas = stmt.all();

        return filas.map((row: any) => {
             const tarea = new Tarea(
                 row.titulo, 
                 row.descripcion, 
                 row.dificultad, 
                 row.fechaVencimiento ? new Date(row.fechaVencimiento) : undefined
             );
             
             (tarea as any).id = row.id;
             (tarea as any).estado = row.estado;
             (tarea as any).fechaCreacion = new Date(row.fechaCreacion);
             (tarea as any).ultimaEdicion = new Date(row.ultimaEdicion);
             return tarea;
        });
    }
}