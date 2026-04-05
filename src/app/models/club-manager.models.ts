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
  password: string;
  ultimoLogin: string; // ISO format or string "2025-01-06 00:00:00"
  usuarioUID: string;
  clubID: string;
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
  Nombre: Nombre;
  Celular: string;
  Email: string;
  FechaNacimiento: string;
  EstadoDeSubscripcion: boolean;
  Analisis: Analysis[];
  TutorUID: string;
}
export interface FormProspect {
  id?: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Celular: string;
  Email: string;
  FechaNacimiento: string;
  EstadoDeSubscripcion: boolean;
  Analisis: Analysis[];
  TutorUID: string;
}

export interface Nombre {
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface Analysis {
  Fecha: string;
  AnalisisCognitivo: string;
  AnalisisFisico: string;
  AnalisisPsicologico: string;
  AnalisisComportamiento: string;
}

export interface User {
  Nombre: string;
  DocumentoDeIdentidad: string;
  RoleId: string;
  informacionContacto: {
    Celular: string;
    Email: string;
    Direccion: string[];
    Telefono: string;
  }
}

export interface Role {
  id?: string;
  RoleDescription: string;
  RoleValue: number;
  RoleID: string; // no needed, do not create again something like this, remove once have time
  permissions: Permission[];
}

export interface Permission {
  id?: string;
  NombrePermiso: string;
  IdPermiso: string; // no needed, do not create again something like this, remove once have time
}
