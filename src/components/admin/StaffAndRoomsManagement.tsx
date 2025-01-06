import React from 'react';
import { ProfessionalList } from '../ProfessionalList';
import { RoomList } from '../RoomList';
import { RoomAssignment } from './RoomAssignment';
import { useStore } from '../../store/useStore';
import { Trash2 } from 'lucide-react';

export function StaffAndRoomsManagement() {
  const { patients, updatePatient } = useStore();
  
  const handleClearAllWaitingLists = () => {
    patients.forEach(patient => {
      if (patient.status === 'esperando') {
        updatePatient({
          ...patient,
          status: 'en-proceso',
        });
      }
    });
  };

  const waitingPatientsCount = patients.filter(p => p.status === 'esperando').length;

  return (
    <div className="space-y-6">
      {waitingPatientsCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAllWaitingLists}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vaciar Todas las Listas de Espera
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ProfessionalList />
        </div>
        <div>
          <RoomList />
        </div>
      </div>

      <div>
        <RoomAssignment />
      </div>
    </div>
  );
}