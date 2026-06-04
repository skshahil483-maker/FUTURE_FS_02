import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { 
  Users, 
  UserPlus, 
  PhoneCall, 
  CheckCircle, 
  ArrowUpRight, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0
  });

  useEffect(() => {
    const data = leadService.getLeads();
    setLeads(data);

    const total = data.length;
    const newCount = data.filter(l => l.status === 'New').length;
    const contactedCount = data.filter(l => l.status === 'Contacted').length;
    const convertedCount = data.filter(l => l.status === 'Converted').length;

    setStats({
      total,
      new: newCount,
      contacted: contactedCount,
      converted: convertedCount
    });
  }, []);

  // Prepare Pie Chart Data
  const pieData = [
    { name: 'New', value: stats.new, color: '#f59e0b' },       // Amber
    { name: 'Contacted', value: stats.contacted, color: '#3b82f6' }, // Blue
    { name: 'Converted', value: stats.converted, color: '#10b981' }  // Emerald
  ].filter(item => item.value > 0); // Don't show 0-value items

  // Prepare Area Chart Data (Leads created in last 7 days)
  const getTimelineData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate.toDateString() === d.toDateString();
      }).length;
      data.push({ name: label, Leads: count });
    }
    return data;
  };

  const timelineData = getTimelineData();

  // Get 3 most recently created leads
  const recentLeads = [...leads].slice(0, 3);

  // Get 4 most recent notes across all leads
  const getRecentNotes = () => {
    const allNotes = [];
    leads.forEach(lead => {
      lead.notes.forEach(note => {
        allNotes.push({
          ...note,
          leadId: lead.id,
          leadName: lead.name
        });
      });
    });
    return allNotes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  const recentNotes = getRecentNotes();

  const cards = [
    { 
      name: 'Total Leads', 
      value: stats.total, 
      icon: Users, 
      color: 'indigo', 
      bg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      description: 'All prospects in database'
    },
    { 
      name: 'New Leads', 
      value: stats.new, 
      icon: UserPlus, 
      color: 'amber', 
      bg: 'bg-amber-50 border-amber-100 text-amber-600',
      description: 'Awaiting first contact'
    },
    { 
      name: 'Contacted', 
      value: stats.contacted, 
      icon: PhoneCall, 
      color: 'blue', 
      bg: 'bg-blue-50 border-blue-100 text-blue-600',
      description: 'Engaged in discussions'
    },
    { 
      name: 'Converted', 
      value: stats.converted, 
      icon: CheckCircle, 
      color: 'emerald', 
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      description: 'Successfully closed deals'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div 
            key={card.name}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.name}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{card.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-xs text-slate-500">{card.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800">Leads Acquisition Trend</h4>
              <p className="text-xs text-slate-400">Leads added daily over the last 7 days</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={14} />
              <span>Pipeline Growth</span>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                  }}
                  labelStyle={{ fontWeight: '600', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="Leads" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800">Pipeline Status</h4>
            <p className="text-xs text-slate-400">Current status breakdown</p>
          </div>

          <div className="h-44 my-4 flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No leads available</p>
            )}
            
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800">{stats.total}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Leads</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {pieData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">
                  {item.value} ({Math.round((item.value / stats.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Leads & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Leads Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-slate-800">Recently Added Leads</h4>
                <p className="text-xs text-slate-400">Newest prospects entering the CRM</p>
              </div>
              <Link 
                to="/leads" 
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => {
                  let badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (lead.status === 'Contacted') badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (lead.status === 'Converted') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <div 
                      key={lead.id}
                      className="flex justify-between items-center p-3 border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50/100 rounded-xl transition-all duration-200"
                    >
                      <div>
                        <Link 
                          to={`/leads/${lead.id}`} 
                          className="font-bold text-sm text-slate-800 hover:text-indigo-600 block transition-colors"
                        >
                          {lead.name}
                        </Link>
                        <span className="text-xs text-slate-400">{lead.email} • {lead.source}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 font-bold rounded-full border uppercase tracking-wider ${badgeColor}`}>
                        {lead.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No leads in pipeline yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Follow-up Notes Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800">Recent Follow-up Activity</h4>
            <p className="text-xs text-slate-400">Latest comments and notes logged</p>
          </div>

          <div className="space-y-4 mt-6">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <div className={`p-2 rounded-lg border ${
                    note.author === 'System' 
                      ? 'bg-slate-50 text-slate-500 border-slate-200' 
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  } shrink-0 self-start`}>
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{note.author}</span> logged on{' '}
                      <Link 
                        to={`/leads/${note.leadId}`}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        {note.leadName}
                      </Link>
                    </p>
                    <p className="text-sm text-slate-700 font-medium mt-1 truncate">{note.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(note.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">No follow-ups logged yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
