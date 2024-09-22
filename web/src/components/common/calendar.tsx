// components/Calendar.js
"use client"
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css'; // Tui Calendar styles
import { useRef } from 'react';

const TuiCalendar = dynamic(() => import('@toast-ui/react-calendar'), {
  ssr: false, // Disable server-side rendering
});

const Calendar = ({prop} : {prop: string}) => {
  const calendarRef = useRef(null);
  
//   @ts-ignore
  const onBeforeCreateSchedule = (event) => {
    console.log('Creating task:', event);
    // Handle creating new tasks here
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
      schedules={[]}
    />
    </div>
  );
};

export default Calendar;
