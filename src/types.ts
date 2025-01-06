export interface Patient {
  id: string;
  name: string;
  ticketNumber: string;
  department: string;
  status: 'esperando' | 'llamado' | 'en-proceso';
  room?: string;
  estimatedWaitTime?: number;
  professionalId?: string;
}

export interface Professional {
  id: string;
  name: string;
  department: string;
  password: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'consulta' | 'emergencia' | 'procedimiento';
  status: 'ocupado' | 'mantenimiento';
  currentPatientId?: string;
  currentProfessionalId?: string;
}

export interface ITAdmin {
  password: string;
}