import React from 'react';
import { Users, Building2, UserPlus, Shield } from 'lucide-react';
import { PatientManagement } from './admin/PatientManagement';
import { StaffAndRoomsManagement } from './admin/StaffAndRoomsManagement';
import { ProfessionalView } from './admin/ProfessionalView';
import { ITAdminPanel } from './admin/ITAdminPanel';

type TabType = 'patients' | 'staffRooms' | 'professional' | 'it';

export function AdminPanel() {
  const [activeTab, setActiveTab] = React.useState<TabType>('patients');

  const tabs = [
    { id: 'patients', label: 'Gestión de Pacientes', icon: UserPlus },
    { id: 'staffRooms', label: 'Personal y Consultorios', icon: Building2 },
    { id: 'professional', label: 'Vista Profesional', icon: Users },
    { id: 'it', label: 'Administración IT', icon: Shield },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'patients' && <PatientManagement />}
        {activeTab === 'staffRooms' && <StaffAndRoomsManagement />}
        {activeTab === 'professional' && <ProfessionalView />}
        {activeTab === 'it' && <ITAdminPanel />}
      </div>
    </div>
  );
}