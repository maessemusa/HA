import { Professional, Room } from '../types';

export const initialProfessionals: Professional[] = [
  {
    id: 'prof_1',
    name: 'Dr. Carlos Rodriguez',
    department: 'Medicina General',
    password: '123456'
  },
  {
    id: 'prof_2',
    name: 'Dra. Ana Martinez',
    department: 'Cardiología',
    password: '123456'
  },
  {
    id: 'prof_3',
    name: 'Dr. Luis Sanchez',
    department: 'Pediatría',
    password: '123456'
  }
];

export const initialRooms: Room[] = [
  {
    id: 'room_1',
    number: '101',
    type: 'consulta',
    status: 'mantenimiento'
  },
  {
    id: 'room_2',
    number: '102',
    type: 'consulta',
    status: 'mantenimiento'
  },
  {
    id: 'room_3',
    number: '103',
    type: 'consulta',
    status: 'mantenimiento'
  }
];