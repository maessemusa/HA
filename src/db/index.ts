import { db } from './client';
import { schema } from './schema';
import { Professional, Room, Patient } from '../types';

// Initialize database tables
export async function initializeDatabase() {
  try {
    for (const [_, query] of Object.entries(schema)) {
      await db.execute(query);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Professional operations
export async function getProfessionals(): Promise<Professional[]> {
  const result = await db.execute('SELECT * FROM professionals');
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    department: row.department as string,
    specialization: row.specialization as string,
    status: row.status as string,
  }));
}

export async function saveProfessional(professional: Professional) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO professionals (id, name, department, specialization, status)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      professional.id,
      professional.name,
      professional.department,
      professional.specialization,
      professional.status,
    ],
  });
}

// Room operations
export async function getRooms(): Promise<Room[]> {
  const result = await db.execute('SELECT * FROM rooms');
  return result.rows.map(row => ({
    id: row.id as string,
    number: row.number as string,
    type: row.type as string,
    status: row.status as string,
    currentPatientId: row.current_patient_id as string | undefined,
    currentProfessionalId: row.current_professional_id as string | undefined,
  }));
}

export async function saveRoom(room: Room) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO rooms (id, number, type, status, current_patient_id, current_professional_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      room.id,
      room.number,
      room.type,
      room.status,
      room.currentPatientId,
      room.currentProfessionalId,
    ],
  });
}

// Patient operations
export async function getPatients(): Promise<Patient[]> {
  const result = await db.execute('SELECT * FROM patients');
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    ticketNumber: row.ticket_number as string,
    department: row.department as string,
    status: row.status as string,
    room: row.room as string | undefined,
    professionalId: row.professional_id as string | undefined,
    estimatedWaitTime: row.estimated_wait_time as number | undefined,
  }));
}

export async function savePatient(patient: Patient) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO patients (
        id, name, ticket_number, department, status, room, professional_id, estimated_wait_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      patient.id,
      patient.name,
      patient.ticketNumber,
      patient.department,
      patient.status,
      patient.room,
      patient.professionalId,
      patient.estimatedWaitTime,
    ],
  });
}