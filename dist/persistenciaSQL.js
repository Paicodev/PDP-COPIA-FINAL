"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenciaSQL = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const tareas_1 = require("./tareas");
class PersistenciaSQL {
    constructor() {
        // Esto creará un archivo 'database.sqlite' en la raíz de tu proyecto
        this.db = new better_sqlite3_1.default('database.sqlite');
        this.inicializarTabla();
    }
    inicializarTabla() {
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
    guardar(tareas) {
        // Usamos una transacción para borrar todo e insertar lo actual
        // (Es la forma más fácil de sincronizar el array en memoria con la DB)
        const insert = this.db.prepare(`
            INSERT INTO tareas (id, titulo, descripcion, estado, dificultad, fechaCreacion, fechaVencimiento, ultimaEdicion)
            VALUES (@id, @titulo, @descripcion, @estado, @dificultad, @fechaCreacion, @fechaVencimiento, @ultimaEdicion)
        `);
        const deleteMany = this.db.prepare('DELETE FROM tareas');
        const transaction = this.db.transaction(() => {
            var _a;
            deleteMany.run(); // Limpiamos la tabla
            for (const t of tareas) {
                insert.run({
                    id: t.getId(),
                    titulo: t.getTitulo(),
                    descripcion: t.getDescripcion(),
                    estado: t.getEstado(),
                    dificultad: t.getDificultad(),
                    fechaCreacion: t.getFechaCreacion().toISOString(),
                    fechaVencimiento: ((_a = t.getFechaVencimiento()) === null || _a === void 0 ? void 0 : _a.toISOString()) || null,
                    ultimaEdicion: t.getUltimaEdicion().toISOString()
                });
            }
        });
        transaction();
    }
    cargar() {
        const stmt = this.db.prepare('SELECT * FROM tareas');
        const filas = stmt.all();
        return filas.map((row) => {
            const tarea = new tareas_1.Tarea(row.titulo, row.descripcion, row.dificultad, row.fechaVencimiento ? new Date(row.fechaVencimiento) : undefined);
            tarea.id = row.id;
            tarea.estado = row.estado;
            tarea.fechaCreacion = new Date(row.fechaCreacion);
            tarea.ultimaEdicion = new Date(row.ultimaEdicion);
            return tarea;
        });
    }
}
exports.PersistenciaSQL = PersistenciaSQL;
