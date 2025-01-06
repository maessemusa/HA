import { create } from 'zustand';
import { Patient, Professional, Room, ITAdmin } from '../types';
import { idb } from '../db/idb';
import { initialProfessionals, initialRooms } from '../db/initialData';
import { emitQueueUpdate } from '../services/socket';

interface HospitalState {
  patients: Patient[];
  professionals: Professional[];
  rooms: Room[];
  initialized: boolean;
  currentProfessional: Professional | null;
  isITAdmin: boolean;
  setPatients: (patients: Patient[]) => void;
  setProfessionals: (professionals: Professional[]) => void;
  setRooms: (rooms: Room[]) => void;
  updatePatient: (patient: Patient) => Promise<void>;
  updateProfessional: (professional: Professional) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  initialize: () => Promise<void>;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginIT: (password: string) => Promise<boolean>;
  logoutIT: () => void;
  updateITPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useStore = create<HospitalState>((set, get) => ({
  patients: [],
  professionals: [],
  rooms: [],
  initialized: false,
  currentProfessional: null,
  isITAdmin: false,

  setPatients: (patients) => {
    set({ patients });
    // Don't emit update here to avoid infinite loop
  },
  
  setProfessionals: (professionals) => set({ professionals }),
  setRooms: (rooms) => set({ rooms }),

  updatePatient: async (patient) => {
    await idb.savePatient(patient);
    const patients = get().patients;
    const updatedPatients = patients.some((p) => p.id === patient.id)
      ? patients.map((p) => (p.id === patient.id ? patient : p))
      : [...patients, patient];
    
    set({ patients: updatedPatients });
    
    // Emit queue update through WebSocket
    emitQueueUpdate(updatedPatients);
  },

  updateProfessional: async (professional) => {
    await idb.saveProfessional(professional);
    const professionals = get().professionals;
    set({
      professionals: professionals.some((p) => p.id === professional.id)
        ? professionals.map((p) => (p.id === professional.id ? professional : p))
        : [...professionals, professional],
    });
  },

  updateRoom: async (room) => {
    await idb.saveRoom(room);
    const rooms = get().rooms;
    set({
      rooms: rooms.some((r) => r.id === room.id)
        ? rooms.map((r) => (r.id === room.id ? room : r))
        : [...rooms, room],
    });
  },

  login: async (id: string, password: string) => {
    const professional = get().professionals.find(p => p.id === id);
    if (professional && professional.password === password) {
      set({ currentProfessional: professional });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentProfessional: null });
  },

  loginIT: async (password: string) => {
    const itAdmin = await idb.getITAdmin();
    if (itAdmin && itAdmin.password === password) {
      set({ isITAdmin: true });
      return true;
    }
    return false;
  },

  logoutIT: () => {
    set({ isITAdmin: false });
  },

  updateITPassword: async (currentPassword: string, newPassword: string) => {
    const itAdmin = await idb.getITAdmin();
    if (itAdmin && itAdmin.password === currentPassword) {
      await idb.saveITAdmin({ password: newPassword });
      return true;
    }
    return false;
  },

  initialize: async () => {
    if (!get().initialized) {
      // Get data from IndexedDB
      let [patients, professionals, rooms, itAdmin] = await Promise.all([
        idb.getAllPatients(),
        idb.getAllProfessionals(),
        idb.getAllRooms(),
        idb.getITAdmin(),
      ]);

      // If no professionals exist, initialize with default data
      if (professionals.length === 0) {
        professionals = initialProfessionals;
        await Promise.all(professionals.map(p => idb.saveProfessional(p)));
      }

      // If no rooms exist, initialize with default data
      if (rooms.length === 0) {
        rooms = initialRooms;
        await Promise.all(rooms.map(r => idb.saveRoom(r)));
      }

      // If no IT admin exists, initialize with default password
      if (!itAdmin) {
        await idb.saveITAdmin({ password: 'admin' });
      }

      set({
        patients,
        professionals,
        rooms,
        initialized: true,
      });
    }
  },
}));