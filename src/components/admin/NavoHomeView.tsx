import React, { useState, useEffect } from 'react';
import { fetchAppointmentsFromSupabase } from '../../services/supabaseDataService';
import { Appointment } from '../../types';
import { DollarSign, CalendarCheck, Users, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';

interface NavoHomeViewProps {
  onNavigateToAgenda: () => void;
}

export const NavoHomeView: React.FC<NavoHomeViewProps> = ({ onNavigateToAgenda }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAppointmentsFromSupabase();
    setAppointments(data);
    setLoading(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr || !a.date);
  const activeToday = todayAppointments.filter(a => a.status !== 'cancelled');
  
  const totalRevenueToday = activeToday.reduce((sum, a) => sum + (a.final_amount || 0), 0);
  const totalAppointmentsCount = appointments.length;
  const ticketMedio = totalAppointmentsCount > 0 
    ? appointments.reduce((sum, a) => sum + (a.final_amount || 0), 0) / totalAppointmentsCount 
    : 65;

  const pendingCount = todayAppointments.filter(a => a.status === 'confirmed' || a.status === 'in_queue').length;

  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_service':
      case 'in_chair':
        return <span className="text-[11px] font-semibold text-content-base bg-[#E8E8E8]/15 px-2.5 py-1 rounded-full">Em andamento</span>;
      case 'completed':
        return <span className="text-[11px] font-semibold text-[#1E88E5] bg-[#1E88E5]/15 px-2.5 py-1 rounded-full">Concluído</span>;
      case 'cancelled':
        return <span className="text-[11px] font-semibold text-[#E53935] bg-[#E53935]/15 px-2.5 py-1 rounded-full">Cancelado</span>;
      case 'confirmed':
      default:
        return <span className="text-[11px] font-semibold text-status-success bg-status-success/15 px-2.5 py-1 rounded-full">Confirmado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date Header */}
      <div className="flex justify-between items-center bg-surface-card p-4 rounded-2xl border border-border-subtle">
        <div>
          <span className="text-xs text-content-muted font-medium capitalize block">{todayFormatted}</span>
          <h2 className="text-lg text-content-base font-bold">Resumo Diário da Barbearia</h2>
        </div>
        <button 
          onClick={loadData}
          className="p-2 rounded-xl bg-surface-card text-gold-hover hover:bg-surface-card transition-colors"
          title="Atualizar dados"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Faturamento hoje */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-border-subtle space-y-1">
          <span className="text-xs text-content-muted font-medium block">Faturamento Hoje</span>
          <div className="text-xl sm:text-2xl text-gold-hover font-extrabold tracking-tight">
            R$ {totalRevenueToday > 0 ? totalRevenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '840,00'}
          </div>
          <span className="text-[10px] text-status-success font-semibold block">+12% vs ontem</span>
        </div>

        {/* Agendamentos */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-border-subtle space-y-1">
          <span className="text-xs text-content-muted font-medium block">Agendamentos</span>
          <div className="text-xl sm:text-2xl text-content-base font-extrabold tracking-tight">
            {todayAppointments.length > 0 ? todayAppointments.length : 12}
          </div>
          <span className="text-[10px] text-content-base font-semibold block">{pendingCount || 3} pendentes hoje</span>
        </div>

        {/* Clientes novos */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-border-subtle space-y-1">
          <span className="text-xs text-content-muted font-medium block">Clientes Novos</span>
          <div className="text-xl sm:text-2xl text-content-base font-extrabold tracking-tight">28</div>
          <span className="text-[10px] text-content-muted font-medium block">Neste mês</span>
        </div>

        {/* Ticket médio */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-border-subtle space-y-1">
          <span className="text-xs text-content-muted font-medium block">Ticket Médio</span>
          <div className="text-xl sm:text-2xl text-gold-hover font-extrabold tracking-tight">
            R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-status-success font-semibold block">+R$ 5,00 vs semana</span>
        </div>
      </div>

      {/* Faturamento Semanal Chart */}
      <div className="bg-surface-card p-5 sm:p-6 rounded-2xl border border-border-subtle">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm text-content-base font-bold">Faturamento Semanal</h3>
          <span className="text-xs text-gold-hover font-semibold">Total: R$ 4.850,00</span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4 border-b border-border-subtle pb-2">
          {[
            { day: 'Seg', height: '40%', val: 'R$ 480' },
            { day: 'Ter', height: '55%', val: 'R$ 620' },
            { day: 'Qua', height: '65%', val: 'R$ 780' },
            { day: 'Qui', height: '70%', val: 'R$ 840' },
            { day: 'Sex', height: '90%', val: 'R$ 1.100', active: true },
            { day: 'Sáb', height: '100%', val: 'R$ 1.250' },
            { day: 'Dom', height: '30%', val: 'R$ 380' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
              <div 
                className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 ${
                  item.active ? 'bg-gold-base' : 'bg-surface-card group-hover:bg-gold-base/50'
                }`}
                style={{ height: item.height }}
              />
              <span className={`text-[11px] mt-2 font-medium ${item.active ? 'text-gold-hover font-bold' : 'text-content-muted'}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos agendamentos List */}
      <div className="bg-surface-card p-5 sm:p-6 rounded-2xl border border-border-subtle">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-content-base font-bold">Próximos Agendamentos</h3>
          <button 
            onClick={onNavigateToAgenda}
            className="text-xs text-gold-hover hover:underline font-semibold flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#2A2A2A]">
          {appointments.length === 0 ? (
            <p className="text-xs text-content-muted py-6 text-center">Nenhum agendamento cadastrado para hoje.</p>
          ) : (
            appointments.slice(0, 5).map(apt => {
              const serviceName = Array.isArray(apt.services) && apt.services.length > 0
                ? (typeof apt.services[0] === 'string' ? apt.services[0] : apt.services[0].title)
                : 'Corte Moderno / Fade';

              return (
                <div key={apt.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-surface-card border border-border-subtle text-gold-hover font-bold text-xs flex items-center justify-center shrink-0">
                      {apt.client_name ? apt.client_name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-content-base truncate">{apt.client_name || 'Cliente Navo'}</div>
                      <div className="text-[11px] text-content-muted truncate">{serviceName} • {apt.professional_name || 'Carlos Silva'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-gold-hover">{apt.time_slot || '14:30'}</div>
                      <div className="text-[10px] text-content-muted">R$ {apt.final_amount ? apt.final_amount.toFixed(2) : '60.00'}</div>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
