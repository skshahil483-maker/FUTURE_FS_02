import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Plus, 
  User, 
  Mail, 
  Phone,
  Briefcase,
  Calendar,
  AlertCircle
} from 'lucide-react';

const LeadListing = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    setLeads(leadService.getLeads());
  };

  const handleDelete = (id) => {
    leadService.deleteLead(id);
    setDeleteConfirmId(null);
    loadLeads();
  };

  // Get unique sources for filters
  const sources = ['All', ...new Set(leads.map(lead => lead.source).filter(Boolean))];

  // Filtering Logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.source && lead.source.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Colors for lead avatar circles
  const getAvatarBg = (name) => {
    const code = name.charCodeAt(0) % 5;
    const colors = [
      'bg-indigo-500/10 text-indigo-700 border-indigo-200/50',
      'bg-emerald-500/10 text-emerald-700 border-emerald-200/50',
      'bg-amber-500/10 text-amber-700 border-amber-200/50',
      'bg-rose-500/10 text-rose-700 border-rose-200/50',
      'bg-cyan-500/10 text-cyan-700 border-cyan-200/50',
    ];
    return colors[code];
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top filter section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter size={12} />
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Briefcase size={12} />
              Source:
            </span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer max-w-[150px] truncate"
            >
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm !== '' || statusFilter !== 'All' || sourceFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setSourceFilter('All');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-50 transition-all cursor-pointer"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Leads Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Lead Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border font-bold flex items-center justify-center text-xs shrink-0 ${getAvatarBg(lead.name)}`}>
                          {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <Link 
                          to={`/leads/${lead.id}`} 
                          className="font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                        >
                          {lead.name}
                        </Link>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-slate-600 text-xs">
                          <Mail size={12} className="text-slate-400" />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-slate-400 text-xs">
                            <Phone size={12} className="text-slate-400" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                        {lead.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2.5 py-1 font-bold rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-indigo-600 bg-white hover:bg-slate-50 shadow-2xs transition-all duration-150 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Link>
                        
                        {deleteConfirmId === lead.id ? (
                          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 p-1 rounded-lg">
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="text-[10px] font-bold text-red-600 hover:bg-red-100 px-2 py-0.5 rounded-md cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50/50 shadow-2xs transition-all duration-150 cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center">
                      <AlertCircle size={32} className="text-slate-300 mb-2" />
                      <p className="font-semibold text-sm text-slate-500">No matching leads found</p>
                      <p className="text-xs mt-1">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-5 hover:bg-slate-50/30 transition-colors flex flex-col gap-4">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full border font-bold flex items-center justify-center text-xs shrink-0 ${getAvatarBg(lead.name)}`}>
                      {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link 
                        to={`/leads/${lead.id}`} 
                        className="font-bold text-slate-800 hover:text-indigo-600 block leading-tight transition-colors"
                      >
                        {lead.name}
                      </Link>
                      <span className="text-[10px] text-slate-400">Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[9px] px-2.5 py-0.5 font-bold rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/50">
                    <Briefcase size={12} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-[10px] text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">{lead.source}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <Link
                    to={`/leads/${lead.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs bg-white hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>View Detail</span>
                  </Link>

                  {deleteConfirmId === lead.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 p-1 rounded-lg">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-[10px] font-bold text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-md cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-2.5 py-1 rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white shadow-2xs transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              <AlertCircle size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-500">No leads match filters</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeadListing;
