import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, Mail, MessageCircle, Eye } from 'lucide-react';
import type { Lead } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LeadsManager = () => {
  // לידים לדוגמה
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      first_name: 'יוסי',
      last_name: 'כהן',
      phone: '050-1234567',
      email: 'yossi@example.com',
      source: 'website',
      status: 'new',
      priority: 'high',
      budget: 80000,
      notes: 'מעוניין במאזדה 3',
      created_at: '2024-10-18T10:00:00Z',
    },
    {
      id: '2',
      first_name: 'שרה',
      last_name: 'לוי',
      phone: '052-9876543',
      whatsapp: '972529876543',
      source: 'whatsapp',
      status: 'contacted',
      priority: 'medium',
      budget: 120000,
      timeline: 'חודש הקרוב',
      notes: 'מחפשת SUV משפחתי',
      created_at: '2024-10-17T14:30:00Z',
    },
    {
      id: '3',
      first_name: 'דוד',
      phone: '054-1112233',
      source: 'phone',
      status: 'qualified',
      priority: 'urgent',
      interest_in_car: '4', // Kia Sportage
      budget: 150000,
      notes: 'מוכן לקנות השבוע',
      created_at: '2024-10-16T09:15:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // סינון
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchTerm ||
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Lead['status']) => {
    const variants = {
      new: { variant: 'primary' as const, text: 'חדש' },
      contacted: { variant: 'secondary' as const, text: 'בטיפול' },
      qualified: { variant: 'success' as const, text: 'מתאים' },
      negotiation: { variant: 'warning' as const, text: 'משא ומתן' },
      won: { variant: 'success' as const, text: 'נסגר' },
      lost: { variant: 'default' as const, text: 'אבד' },
    };
    return variants[status];
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      {/* כותרת וחיפוש */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">ניהול לידים</h1>
          <p className="text-darkGray">סה"כ {filteredLeads.length} לידים</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* סינון לפי סטטוס */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { value: 'all', label: 'הכל' },
          { value: 'new', label: 'חדש' },
          { value: 'contacted', label: 'בטיפול' },
          { value: 'qualified', label: 'מתאים' },
          { value: 'won', label: 'נסגר' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              statusFilter === filter.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-darkGray hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* טבלה */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">שם</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">טלפון</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">מקור</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">סטטוס</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">עדיפות</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">תקציב</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const statusBadge = getStatusBadge(lead.status);
                return (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-dark">
                        {lead.first_name} {lead.last_name || ''}
                      </div>
                      {lead.email && <div className="text-sm text-gray-600">{lead.email}</div>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-darkGray">
                        <Phone className="h-4 w-4" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="default" size="sm">
                        {lead.source === 'website'
                          ? 'אתר'
                          : lead.source === 'whatsapp'
                          ? 'WhatsApp'
                          : lead.source === 'phone'
                          ? 'טלפון'
                          : lead.source}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.text}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${getPriorityColor(lead.priority)}`}>
                        {lead.priority === 'low'
                          ? 'נמוך'
                          : lead.priority === 'medium'
                          ? 'בינוני'
                          : lead.priority === 'high'
                          ? 'גבוה'
                          : 'דחוף'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-darkGray">
                      {lead.budget ? `₪${lead.budget.toLocaleString('he-IL')}` : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="פרטים מלאים"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {lead.whatsapp && (
                          <a
                            href={`https://wa.me/${lead.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 text-secondary hover:bg-secondary/10 rounded transition-colors"
                          title="התקשר"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-16 text-darkGray">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-4">לא נמצאו לידים</p>
          </div>
        )}
      </Card>
    </div>
  );
};

