export interface Grupo {
  id?: string;
  Descripcion: string;
  Grupo: string;
  HoraInicio: string; // e.g., "5 PM"
  HoraFin: string;    // e.g., "6:30 PM"
  Dias: {
    Domingo: boolean;
    Jueves: boolean;
    Lunes: boolean;
    Martes: boolean;
    Miercoles: boolean;
    Sabado: boolean;
    Viernes: boolean;
  };
}

export interface Login {
  id?: string;
  login: string;
  password?: string;
  ultimoLogin: string; // ISO format or string "2025-01-06 00:00:00"
  usuarioUID: string;
}

export interface Pago {
  id?: string;
  Completado: boolean;
  Evidencia: string; // URL to storage
  MesPago: string;   // e.g., "Enero 2025"
  MetodoDePago: string;
  fechaPago: string;
  montoPago: number;
  prospectUID: string;
}

export interface Plan {
  id?: string;
  Descripcion: string;
  MontoMensual: number;
  Detalles: {
    Entrenamiento: boolean;
    EntrenamientoPersonalizado: boolean;
    ExcursionesPagas: boolean;
    Uniforme: boolean;
  };
}

export interface Subscripcion {
  id?: string;
  PlanUID: string;
  prospectUID: string;
  Estado: {
    Activo: boolean;
    Cancelado: boolean;
    PendientePago: boolean;
    Suspendido: boolean;
  };
  Observaciones: string[];
}

export interface Prospect {
  id?: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Telefono: string;
  Email: string;
  FechaIngreso: string;
  Status: boolean;
  Analisis: Analysis[];
}

export interface Analysis {
  Fecha: string;
  AnalisisCognitivo: string;
  AnalisisFisico: string;
  AnalisisPsicologico: string;
  AnalisisComportamiento: string;
}

export interface User {
  uid: string;
  Email: string;
  DisplayName: string;
  PhotoURL?: string;
  Role: string;
}
