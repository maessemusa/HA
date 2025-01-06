import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Room } from '../types';
import { PlusCircle, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

type FormData = {
  number: string;
  type: 'consulta' | 'emergencia' | 'procedimiento';
};

export function RoomList() {
  const { rooms, updateRoom } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState(false);

  const RoomForm = ({ room, onCancel }: { room?: Room; onCancel: () => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      defaultValues: room ? {
        number: room.number,
        type: room.type,
      } : undefined
    });

    const onSubmit = (data: FormData) => {
      if (room) {
        updateRoom({
          ...room,
          ...data,
        });
        setEditingId(null);
      } else {
        updateRoom({
          id: `r${Date.now()}`,
          status: 'mantenimiento',
          ...data,
        });
        setNewRoom(false);
      }
    };

    return (
      <form className="space-y-4 p-4 bg-gray-50 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('number', { 
              required: 'Room number is required',
              pattern: {
                value: /^[A-Za-z0-9-]+$/,
                message: 'Only letters, numbers, and hyphens are allowed'
              }
            })}
            type="text"
            placeholder="Room Number"
            className={`w-full p-2 border rounded ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number.message}</p>}
        </div>

        <div>
          <select
            {...register('type', { required: 'Room type is required' })}
            className={`w-full p-2 border rounded ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Type</option>
            <option value="consulta">Consultation</option>
            <option value="emergencia">Emergency</option>
            <option value="procedimiento">Procedure</option>
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hospital Rooms</h3>
        <button
          onClick={() => setNewRoom(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        {newRoom && (
          <RoomForm
            onCancel={() => setNewRoom(false)}
          />
        )}
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-lg p-4 space-y-2">
            {editingId === room.id ? (
              <RoomForm
                room={room}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Room {room.number}</h4>
                  <p className="text-sm text-gray-600">{room.type}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      room.status === 'ocupado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <button
                  onClick={() => setEditingId(room.id)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}