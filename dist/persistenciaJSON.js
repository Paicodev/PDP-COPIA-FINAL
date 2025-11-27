"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenciaJSON = void 0;
const fs = __importStar(require("fs"));
const tareas_1 = require("./tareas");
const RUTA_ARCHIVO = './tareas.json';
class PersistenciaJSON {
    guardar(tareas) {
        try {
            const datos = JSON.stringify(tareas, null, 2);
            fs.writeFileSync(RUTA_ARCHIVO, datos, 'utf-8');
        }
        catch (error) {
            console.error("Error al guardar JSON:", error);
        }
    }
    cargar() {
        if (!fs.existsSync(RUTA_ARCHIVO))
            return [];
        try {
            const datos = fs.readFileSync(RUTA_ARCHIVO, 'utf-8');
            const json = JSON.parse(datos);
            // Rehidratación de objetos
            return json.map((t) => {
                const tarea = new tareas_1.Tarea(t.titulo, t.descripcion, t.dificultad, t.fechaVencimiento ? new Date(t.fechaVencimiento) : undefined);
                // Truco para asignar privados
                tarea.id = t.id;
                tarea.estado = t.estado;
                tarea.fechaCreacion = new Date(t.fechaCreacion);
                tarea.ultimaEdicion = new Date(t.ultimaEdicion);
                return tarea;
            });
        }
        catch (error) {
            return [];
        }
    }
}
exports.PersistenciaJSON = PersistenciaJSON;
