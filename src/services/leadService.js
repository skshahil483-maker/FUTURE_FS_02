const LEADS_KEY = 'crm_leads';

const MOCK_LEADS = [
  {
    id: 'lead_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.io',
    phone: '+1 (555) 0142',
    source: 'LinkedIn',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    notes: [
      {
        id: 'note_1_1',
        text: 'Initial outreach on LinkedIn regarding enterprise solutions.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      },
      {
        id: 'note_1_2',
        text: 'Status updated from New to Contacted.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      },
      {
        id: 'note_1_3',
        text: 'Had discovery call. Interested in 50-user tier license. Scheduled demo for next week.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      }
    ]
  },
  {
    id: 'lead_2',
    name: 'Michael Chang',
    email: 'm.chang@innovate.co',
    phone: '+1 (555) 0187',
    source: 'Referral',
    status: 'Converted',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    notes: [
      {
        id: 'note_2_1',
        text: 'Referred by Partner Channel. Seeking custom integration capabilities.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      },
      {
        id: 'note_2_2',
        text: 'Status updated from New to Contacted.',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      },
      {
        id: 'note_2_3',
        text: 'Completed product demo and sent customized contract proposal.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      },
      {
        id: 'note_2_4',
        text: 'Status updated from Contacted to Converted.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      },
      {
        id: 'note_2_5',
        text: 'Contract signed! Account passed to onboarding team.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      }
    ]
  },
  {
    id: 'lead_3',
    name: 'Emily Rodriguez',
    email: 'emily.r@designstudio.com',
    phone: '+1 (555) 0123',
    source: 'Website Contact Form',
    status: 'New',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    notes: [
      {
        id: 'note_3_1',
        text: 'Inquiry received via website contact form: "Need design system consulting services starting next month."',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      }
    ]
  },
  {
    id: 'lead_4',
    name: 'David Kim',
    email: 'david.kim@financeflow.net',
    phone: '+1 (555) 0165',
    source: 'Cold Outreach',
    status: 'New',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    notes: [
      {
        id: 'note_4_1',
        text: 'Cold outreach email sent outlining custom banking dashboard designs.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      }
    ]
  },
  {
    id: 'lead_5',
    name: 'Jessica Taylor',
    email: 'jessica.t@retailhub.com',
    phone: '+1 (555) 0211',
    source: 'Google Search',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    notes: [
      {
        id: 'note_5_1',
        text: 'Organic search lead. Filled out demo request form on pricing page.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      },
      {
        id: 'note_5_2',
        text: 'Status updated from New to Contacted.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'System'
      },
      {
        id: 'note_5_3',
        text: 'Sent calendar invite link for demo. Waiting for response.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin'
      }
    ]
  }
];

export const leadService = {
  // Initialize with mock leads if storage is empty
  initialize() {
    if (!localStorage.getItem(LEADS_KEY)) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(MOCK_LEADS));
    }
  },

  // Get all leads
  getLeads() {
    this.initialize();
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  },

  // Get a single lead by ID
  getLeadById(id) {
    const leads = this.getLeads();
    return leads.find(lead => lead.id === id);
  },

  // Add a new lead
  addLead(leadData) {
    this.initialize();
    const leads = this.getLeads();
    
    const newLead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || '',
      source: leadData.source || 'Website Contact Form',
      status: leadData.status || 'New',
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: 'note_' + Date.now(),
          text: `Lead created. Source: ${leadData.source || 'Website Contact Form'}. Initial status: ${leadData.status || 'New'}.`,
          createdAt: new Date().toISOString(),
          author: 'System'
        }
      ]
    };

    leads.unshift(newLead); // Add to the beginning
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return newLead;
  },

  // Update a lead's fields
  updateLead(id, updatedFields) {
    const leads = this.getLeads();
    const leadIndex = leads.findIndex(lead => lead.id === id);
    
    if (leadIndex === -1) return null;
    
    const oldLead = leads[leadIndex];
    const systemNotes = [];
    
    // Auto-create notes for important updates (e.g. status changes)
    if (updatedFields.status && updatedFields.status !== oldLead.status) {
      systemNotes.push({
        id: 'note_sys_' + Date.now() + '_status',
        text: `Status updated from ${oldLead.status} to ${updatedFields.status}.`,
        createdAt: new Date().toISOString(),
        author: 'System'
      });
    }

    const updatedLead = {
      ...oldLead,
      ...updatedFields,
      notes: [...systemNotes, ...oldLead.notes]
    };

    leads[leadIndex] = updatedLead;
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return updatedLead;
  },

  // Add a manual note to a lead
  addNote(leadId, noteText, author = 'Admin') {
    const leads = this.getLeads();
    const leadIndex = leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex === -1) return null;
    
    const newNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      text: noteText,
      createdAt: new Date().toISOString(),
      author: author
    };

    const updatedLead = {
      ...leads[leadIndex],
      notes: [newNote, ...leads[leadIndex].notes] // Prepended so recent notes show first
    };

    leads[leadIndex] = updatedLead;
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return updatedLead;
  },

  // Delete a lead
  deleteLead(id) {
    const leads = this.getLeads();
    const filteredLeads = leads.filter(lead => lead.id !== id);
    localStorage.setItem(LEADS_KEY, JSON.stringify(filteredLeads));
    return true;
  }
};
