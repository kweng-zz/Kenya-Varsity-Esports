"use client";

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';

interface TournamentCalendarProps {
  events: CalendarEvent[];
  gameSlug: string;
}

export const TournamentCalendar: React.FC<TournamentCalendarProps> = ({ events, gameSlug }) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [animationClass, setAnimationClass] = useState('');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get events for current month
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
  });

  // Get events for a specific date
  const getEventsForDate = (date: number): CalendarEvent[] => {
    const targetDate = new Date(currentYear, currentMonth, date);
    return monthEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === targetDate.toDateString();
    });
  };

  // Navigation functions with animation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setAnimationClass(direction === 'next' ? 'slide-left' : 'slide-right');
    
    setTimeout(() => {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'next') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        return newDate;
      });
      setAnimationClass('');
    }, 150);
  };

  // Get event type color
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'registration': return 'bg-blue-600';
      case 'match': return 'bg-green-600';
      case 'tournament': return 'bg-[#8c110d]';
      case 'deadline': return 'bg-red-600';
      case 'announcement': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  // Get event type icon
  const getEventTypeIcon = (type: string): string => {
    switch (type) {
      case 'registration': return '📝';
      case 'match': return '⚽';
      case 'tournament': return '🏆';
      case 'deadline': return '⏰';
      case 'announcement': return '📢';
      default: return '📅';
    }
  };



  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-[#8c110d]/20"></div>
      );
    }
    
    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, date).toDateString();
      const isSelected = selectedDate?.toDateString() === new Date(currentYear, currentMonth, date).toDateString();
      
      days.push(
        <div
          key={date}
          className={`h-20 border border-[#8c110d]/20 cursor-pointer transition-all duration-200 hover:bg-[#8c110d]/10 ${
            isToday ? 'bg-[#8c110d]/20' : ''
          } ${isSelected ? 'bg-[#8c110d]/30' : ''}`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, date))}
        >
          <div className="p-1 h-full flex flex-col">
            <div className={`text-sm font-bold ${isToday ? 'text-[#8c110d]' : 'text-white'}`}>
              {date}
            </div>
            <div className="flex-1 overflow-hidden">
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs px-1 mb-1 text-white truncate rounded ${getEventTypeColor(event.type)} ${
                    event.isImportant ? 'animate-pulse ring-2 ring-yellow-400' : ''
                  }`}
                  title={`${event.title} - ${event.time || 'No time specified'}`}
                >
                  {getEventTypeIcon(event.type)} {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-[#8c110d] font-bold">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div 
      className="relative bg-black/60 border border-[#8c110d] p-8 md:p-12"
      style={{
        backgroundImage: 'url(/images/Mask Group.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-center text-[#8c110d]">
            Tournament Calendar
          </h2>
          <p className="text-lg text-center text-white">
            Important dates and events for the tournament
          </p>

        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="bg-[#8c110d] hover:bg-[#8c110d]/80 text-white px-4 py-2 transition-colors duration-200"
          >
            ← Previous
          </button>
          
          <h3 className={`text-xl md:text-2xl font-bold text-white transition-all duration-300 ${animationClass}`}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="bg-[#8c110d] hover:bg-[#8c110d]/80 text-white px-4 py-2 transition-colors duration-200"
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-black/90 border border-[#8c110d] overflow-hidden mb-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-[#8c110d]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-white font-bold">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className={`grid grid-cols-7 transition-all duration-300 ${animationClass}`}>
            {generateCalendarDays()}
          </div>
        </div>

        {/* Event Legend */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-4">Event Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { type: 'registration', label: 'Registration', icon: '📝' },
              { type: 'match', label: 'Matches', icon: '⚽' },
              { type: 'tournament', label: 'Tournament', icon: '🏆' },
              { type: 'deadline', label: 'Deadlines', icon: '⏰' },
              { type: 'announcement', label: 'Announcements', icon: '📢' }
            ].map(({ type, label, icon }) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${getEventTypeColor(type)}`}></div>
                <span className="text-white text-sm">{icon} {label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-black/80 border border-[#8c110d] p-6 animate-fadeIn">
            <h4 className="text-lg font-bold text-white mb-4">
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            {getEventsForDate(selectedDate.getDate()).length === 0 ? (
              <p className="text-white/60">No events scheduled for this date.</p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate.getDate()).map(event => (
                  <div
                    key={event.id}
                    className={`border-l-4 pl-4 py-2 ${
                      event.isImportant ? 'border-[#8c110d] animate-pulse' : 'border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs text-white ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)} {event.type.toUpperCase()}
                      </span>
                      {event.isImportant && (
                        <span className="text-[#8c110d] text-xs font-bold">IMPORTANT</span>
                      )}
                    </div>
                    <h5 className="text-white font-bold">{event.title}</h5>
                    {event.time && (
                      <p className="text-white/60 text-sm">Time: {event.time}</p>
                    )}
                    {event.description && (
                      <p className="text-white/80 text-sm mt-1">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="text-white/60 text-sm">Location: {event.location}</p>
                    )}
                    {event.teams && event.teams.length > 0 && (
                      <p className="text-white/60 text-sm">Teams: {event.teams.join(' vs ')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mt-8">
          <h4 className="text-lg font-bold text-[#8c110d] mb-4">Upcoming Events</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 6)
              .map(event => (
                <div
                  key={event.id}
                  className={`bg-black/80 border border-[#8c110d] p-4 hover:bg-[#8c110d]/10 transition-colors duration-200 ${
                    event.isImportant ? 'animate-pulse' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs text-white ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)} {event.type.toUpperCase()}
                    </span>
                    {event.isImportant && (
                      <span className="text-[#8c110d] text-xs font-bold">IMPORTANT</span>
                    )}
                  </div>
                  <h5 className="text-white font-bold mb-1">{event.title}</h5>
                  <p className="text-white/60 text-sm">
                    {new Date(event.date).toLocaleDateString()}
                    {event.time && ` at ${event.time}`}
                  </p>
                  {event.description && (
                    <p className="text-white/80 text-sm mt-2">{event.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slide-left {
          transform: translateX(-20px);
          opacity: 0.7;
        }
        .slide-right {
          transform: translateX(20px);
          opacity: 0.7;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};