import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Professional } from '../types';
import { UserPlus, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  department: string;
};

export function ProfessionalList() {
  const { professionals, rooms, updateProfessional } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProfessional, setNewProfessional] = useState(false);

  const ProfessionalForm = ({ professional, onCancel }: { professional?: Professional; onCancel: () => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      defaultValues: professional ? {
        name: professional.name,
        department: professional.department,
      } : undefined
    });

    const onSubmit = (data: FormData) => {
      if (professional) {
        updateProfessional({
          ...professional,
          ...data,
        });
        setEditingId(null);
      } else {
        updateProfessional({
          id: `p${Date.now()}`,
          ...data,
        });
        setNewProfessional(false);
      }
    };

    return (
      <form className="space-y-4 p-4 bg-gray-50 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            placeholder="Name"
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <select
            {...register('department', { required: 'Department is required' })}
            className={`w-full p-2 border rounded ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Department</option>
            <option value="Medicina General">Medicina General</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Traumatología">Traumatología</option>
            <option value="Oftalmología">Oftalmología</option>
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
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

  const hasAssignedRoom = (professionalId: string) => {
    return rooms.some(room => room.currentProfessionalId === professionalId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Medical Professionals</h3>
        <button
          onClick={() => setNewProfessional(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <UserPlus className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        {newProfessional && (
          <ProfessionalForm
            onCancel={() => setNewProfessional(false)}
          />
        )}
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="border rounded-lg p-4 space-y-2"
          >
            {editingId === professional.id ? (
              <ProfessionalForm
                professional={professional}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{professional.name}</h4>
                  <p className="text-sm text-gray-600">
                    {professional.department}
                  </p>
                  <p className={`text-sm mt-1 ${hasAssignedRoom(professional.id) ? 'text-green-600' : 'text-red-600'}`}>
                    {hasAssignedRoom(professional.id) 
                      ? 'Consultorio asignado'
                      : 'Sin consultorio asignado'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(professional.id)}
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