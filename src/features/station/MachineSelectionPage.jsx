import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeMachineModal from './components/modals/ChangeMachineModal';

export default function MachineSelectionPage() {
  const navigate = useNavigate();
  const selectMachine = machine => {
    const shiftTeam = { name: machine.team, leader: machine.leader, count: machine.members.length };
    const search = machine.type === 'production' ? `?machine=${encodeURIComponent(machine.id)}` : '';
    navigate(`/${machine.type}${search}`, { replace: true, state: { shiftTeam } });
  };
  return <ChangeMachineModal isOpen initialScreen onClose={() => {}} onSelectMachine={selectMachine} />;
}
