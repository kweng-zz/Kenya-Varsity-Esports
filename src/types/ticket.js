/**
 * Ticket Management System Types
 */
// Subject categories with their default priorities
export const TICKET_SUBJECTS = {
    'General Support': 'medium',
    'Tournament Registration': 'high',
    'Account Issues': 'high',
    'Technical Problems': 'medium',
    'Payment & Billing': 'high',
    'Student Verification': 'medium',
    'Rankings & Leaderboards': 'low',
    'Bug Report': 'medium',
    'Feature Request': 'low'
};
export const TICKET_STATUS_LABELS = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'waiting-for-user': 'Waiting for User',
    'waiting-for-admin': 'Waiting for Admin',
    'resolved': 'Resolved',
    'closed': 'Closed'
};
export const TICKET_PRIORITY_LABELS = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
};
export const TICKET_STATUS_COLORS = {
    'open': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'waiting-for-user': 'bg-orange-500',
    'waiting-for-admin': 'bg-purple-500',
    'resolved': 'bg-green-500',
    'closed': 'bg-gray-500'
};
export const TICKET_PRIORITY_COLORS = {
    'low': 'bg-gray-500',
    'medium': 'bg-blue-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500'
};
