'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';

// Define the Booking interface
interface Booking {
  _id: string;
  roomId: any;
  userId: any;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  status: "confirmed" | "cancelled";
}

// Define props interface to include bookings
export interface FullCalendarProps {
  bookings: Booking[];
}

const FullCalendarComponent: React.FC<FullCalendarProps> = ({ bookings }) => {
  const router = useRouter();

  // Convert bookings to events format that FullCalendar expects
  const events = bookings.map(booking => {
    const [year, month, day] = booking.date.split('T')[0].split('-');
    const startDateTime = `${year}-${month}-${day}T${booking.startTime}:00`;
    const endDateTime = `${year}-${month}-${day}T${booking.endTime}:00`;
    
    return {
      id: booking._id,
      title: booking.title,
      start: startDateTime,
      end: endDateTime,
      extendedProps: {
        room: booking.roomId.name
      }
    };
  });

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      locale={thLocale}
      height="100%"
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }}
      eventContent={(eventInfo) => (
        <div>
          <b>{eventInfo.timeText}</b>
          <p>{eventInfo.event.title}</p>
          <p>{eventInfo.event.extendedProps.room}</p>
        </div>
      )}
      eventClick={(info) => {
        const bookingId = info.event.id;
        router.push(`/bookings/${bookingId}`);
      }}
    />
  );
};

export default FullCalendarComponent; 