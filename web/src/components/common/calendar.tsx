// components/Calendar.js
"use client"
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css'; // Tui Calendar styles
import { useRef } from 'react';

const TuiCalendar = dynamic(() => import('@toast-ui/react-calendar'), {
  ssr: false, // Disable server-side rendering
});

interface Schedule {
  id: number;
  title: string;
  body: string;
  start: string;
  end: string;
  category?: string;
}

const Calendar = ({prop, schedule} : {prop: string, schedule: Schedule[]}) => {
  const calendarRef = useRef(null);
  
  // Handle new schedule creation (optional feature)
  const onBeforeCreateSchedule = (event) => {
    console.log('Creating task:', event);
  };

  return (
    <div className=''>
      <TuiCalendar
        // @ts-ignore
        ref={calendarRef}
        height="800px"
        view={prop} // Can be 'day', 'month', 'week'
        useDetailPopup={true}
        useCreationPopup={true}
        onBeforeCreateSchedule={onBeforeCreateSchedule}
        schedules={schedule}  // Passing the schedule
        timezones={[
          {
            timezoneName: 'Asia/Kolkata',
            displayLabel: 'UTC+5:30',
            tooltip: 'IST'
          }
        ]}
      />
    </div>
  );
};

export default Calendar;
