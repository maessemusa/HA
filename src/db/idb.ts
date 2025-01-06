import { openDB, DBSchema } from 'idb';
import { Patient, Professional, Room, ITAdmin } from '../types';

interface HospitalDB extends DBSchema {
  patients: {
    key: string;
    value: Patient;
  };
  professionals: {
    key: string;
    value: Professional;
  };
  rooms: {
    key: string;
    value: Room;
  };
  itAdmin: {
    key: string;
    value: ITAdmin;
  };
}

const DB_NAME = 'hospital_queue';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB<HospitalDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('patients', { keyPath: 'id' });
        db.createObjectStore('professionals', { keyPath: 'id' });
        db.createObjectStore('rooms', { keyPath: 'id' });
      }
      if (oldVersion < 2) {
        db.createObjectStore('itAdmin', { keyPath: 'id' });
      }
    },
  });
};

export const idb = {
  async getAllPatients(): Promise<Patient[]> {
    const db = await initDB();
    return db.getAll('patients');
  },

  async savePatient(patient: Patient): Promise<void> {
    const db = await initDB();
    await db.put('patients', patient);
  },

  async getAllProfessionals(): Promise<Professional[]> {
    const db = await initDB();
    return db.getAll('professionals');
  },

  async saveProfessional(professional: Professional): Promise<void> {
    const db = await initDB();
    await db.put('professionals', professional);
  },

  async getAllRooms(): Promise<Room[]> {
    const db = await initDB();
    return db.getAll('rooms');
  },

  async saveRoom(room: Room): Promise<void> {
    const db = await initDB();
    await db.put('rooms', room);
  },

  async getITAdmin(): Promise<ITAdmin | undefined> {
    const db = await initDB();
    return db.get('itAdmin', 'admin');
  },

  async saveITAdmin(admin: ITAdmin): Promise<void> {
    const db = await initDB();
    await db.put('itAdmin', { ...admin, id: 'admin' });
  },
};