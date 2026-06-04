import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Clock, 
  CheckCircle,
  MessageSquare,
  FileText,
  AlertCircle,
  Save,
  Edit2,
  X,
  Trash2
} from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: ''
  });

  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const sources = [
    'Website Contact Form',
    'LinkedIn',
    'Referral',
    'Cold Outreach',
    'Google Search',
    'Partner Channel',
    'Other'
  ];

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = () => {
    const data = leadService.getLeadById(id);
    if (!data) {
      setError('Lead not found in database.');
      return;
    }
    setLead(data);
    setEditData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source,
      status: data.status
    });
  };

  const handleFieldChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editData.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!editData.email.trim()) {
      setError('Email is required.');
      return;
    }

    const updated = leadService.updateLead(id, editData);
    if (updated) {
      setLead(updated);
      setIsEditing(false);
      setSuccess('Details saved successfully.');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError('Failed to update lead details.');
    }
  };

  const handleQuickStatusChange = (newStatus) => {
    setError('');
    setSuccess('');
    const updated = leadService.updateLead(id, { status: newStatus });
    if (updated) {
      setLead(updated);
      setEditData(prev => ({ ...prev, status: newStatus }));
      setSuccess(`Status changed to ${newStatus}.`);
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError('Failed to update status.');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setError('');
    const updated = leadService.addNote(id, noteText.trim(), 'Admin');
    if (updated) {
      setLead(updated);
      setNoteText('');
      setSuccess('Note added to timeline.');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError('Failed to add note.');
    }
  };

  const handleDeleteLead = () => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      leadService.deleteLead(id);
      navigate('/leads');
    }
  };

  const getStatusColor = (status) => {
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

  if (error && !lead) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center mt-12">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Error Loading Lead</h3>
        <p className="text-slate-500 mt-2">{error}</p>
        <Link to="/leads" className="inline-block mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm">
          Return to Leads List
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="p-6 space-y-6">
      
      {/* Top action row */}
      <div className="flex justify-between items-center">
        <Link 
          to="/leads" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Lead Management</span>
        </Link>

        <button
          onClick={handleDeleteLead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold text-xs rounded-xl shadow-2xs transition-all duration-200 cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Delete Lead</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Edit */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Lead Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-indigo-100 bg-indigo-50/70 text-indigo-600 font-extrabold flex items-center justify-center text-xl mb-4">
              {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">{lead.name}</h3>
            <span className="text-xs text-slate-400 mt-0.5">{lead.email}</span>
            
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[10px] px-3 py-1 font-bold rounded-full border uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              <span className="text-[10px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-medium font-semibold uppercase tracking-wider">
                {lead.source}
              </span>
            </div>
          </div>

          {/* Details Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm">Prospect Details</h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    loadLead(); // Reset form values
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {success && (
              <div className="mx-6 mt-4 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-xs text-emerald-600 font-medium">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveDetails} className="p-6 space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleFieldChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleFieldChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleFieldChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Lead Source
                  </label>
                  <select
                    name="source"
                    value={editData.source}
                    onChange={handleFieldChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
                  >
                    {sources.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>

              </form>
            ) : (
              <div className="p-6 space-y-4 text-xs">
                
                {/* Email Display */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                  <a href={`mailto:${lead.email}`} className="text-slate-700 font-semibold hover:underline flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    <span>{lead.email}</span>
                  </a>
                </div>

                {/* Phone Display */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</span>
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="text-slate-700 font-semibold hover:underline flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400" />
                      <span>{lead.phone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No phone logged</span>
                  )}
                </div>

                {/* Source Display */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Briefcase size={12} className="text-slate-400" />
                    <span>{lead.source}</span>
                  </div>
                </div>

                {/* Created Date Display */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created Date</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} />
                    <span>
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Quick Status Update Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-3.5">Pipeline Status Actions</h4>
            
            <div className="grid grid-cols-3 gap-2">
              {['New', 'Contacted', 'Converted'].map((status) => {
                const active = lead.status === status;
                let activeBtnStyle = '';
                
                if (status === 'New') activeBtnStyle = active ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-500' : 'hover:bg-amber-50 border-amber-200 text-amber-700';
                if (status === 'Contacted') activeBtnStyle = active ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 border-blue-500' : 'hover:bg-blue-50 border-blue-200 text-blue-700';
                if (status === 'Converted') activeBtnStyle = active ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-emerald-500' : 'hover:bg-emerald-50 border-emerald-200 text-emerald-700';

                return (
                  <button
                    key={status}
                    onClick={() => handleQuickStatusChange(status)}
                    className={`
                      py-2 border rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                      ${activeBtnStyle}
                    `}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Follow-up Notes & Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notes Log & Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col h-[540px]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-slate-400" />
                  <span>Activity Timeline & Notes</span>
                </h4>
                <p className="text-xs text-slate-400">History logs and follow-up activities</p>
              </div>
            </div>

            {/* Note Entry Form */}
            <form onSubmit={handleAddNote} className="mb-6 shrink-0">
              <div className="relative">
                <textarea
                  rows="3"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Log details of the conversation or next step follow-up..."
                  className="block w-full border border-slate-200 rounded-xl p-3.5 pr-20 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                />
                <div className="absolute right-3.5 bottom-3.5">
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:shadow-none text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </form>

            {/* Timeline Log Feed */}
            <div className="flex-1 overflow-y-auto pr-2 relative space-y-5">
              
              {/* Vertical line through timeline */}
              {lead.notes.length > 1 && (
                <div className="absolute top-2 bottom-2 left-4.5 w-0.5 bg-slate-100 z-0" />
              )}

              {lead.notes.length > 0 ? (
                lead.notes.map((note) => {
                  const isSystem = note.author === 'System';
                  return (
                    <div key={note.id} className="relative z-10 flex gap-4">
                      
                      {/* Timeline Icon Badge */}
                      <div className={`
                        w-9 h-9 rounded-full border flex items-center justify-center shrink-0 self-start shadow-2xs
                        ${isSystem 
                          ? 'bg-slate-50 text-slate-400 border-slate-200' 
                          : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }
                      `}>
                        {isSystem ? <Clock size={14} /> : <FileText size={14} />}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 min-w-0 bg-slate-50/50 border border-slate-100/60 p-4 rounded-xl">
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSystem ? 'text-slate-400' : 'text-indigo-600'}`}>
                            {note.author} Action
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(note.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium mt-1.5 break-words">
                          {note.text}
                        </p>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No activities logged yet.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LeadDetail;
