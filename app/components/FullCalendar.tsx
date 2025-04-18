'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';

interface FullCalendarProps {
  events: any[];
}

export default function FullCalendarComponent({ events }: FullCalendarProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-96 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

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
      locales={allLocales}
      locale="th"
      height="auto"
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      businessHours={{
        daysOfWeek: [1, 2, 3, 4, 5], // จันทร์ถึงศุกร์
        startTime: '08:00',
        endTime: '17:00',
      }}
      eventClick={(info) => {
        const bookingId = info.event.id;
        router.push(`/bookings/${bookingId}`);
      }}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hour12: false
      }}
    />
  );
} 