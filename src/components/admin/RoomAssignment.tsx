import React from 'react';
import { useStore } from '../../store/useStore';
import { DoorClosed } from 'lucide-react';

export function RoomAssignment() {
  const { professionals, rooms, updateRoom } = useStore();

  const handleRoomAssignment = (professionalId: string, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom({
        ...room,
        currentProfessionalId: professionalId === '' ? undefined : professionalId,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <DoorClosed className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Asignación de Consultorios</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Consultorio {room.number}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  room.status === 'disponible' 
                    ? 'bg-green-100 text-green-800'
                    : room.status === 'ocupado'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {room.status}
                </span>
              </div>
              <select
                value={room.currentProfessionalId || ''}
                onChange={(e) => handleRoomAssignment(e.target.value, room.id)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Sin asignar</option>
                {professionals.map(professional => (
                  <option 
                    key={professional.id} 
                    value={professional.id}
                  >
                    {professional.name} - {professional.specialization}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}