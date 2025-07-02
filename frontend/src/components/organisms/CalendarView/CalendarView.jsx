import React, { useState } from 'react';
import styles from './CalendarView.module.css';
import CalendarHeader from '../../molecules/CalendarHeader/CalendarHeader';
import CalendarWeekdays from '../../molecules/CalendarWeekdays/CalendarWeekdays';
import CalendarGrid from '../../molecules/CalendarGrid/CalendarGrid';
import CalendarEventList from '../../molecules/CalendarEventList/CalendarEventList';

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const CalendarView = ({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
  events = {}, // { '2024-06-10': [{title, time}], ... }
  className = '',
  style = {},
}) => {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfWeek(month, year) || 7; // 0=Domingo, 1=Lunes...
  const today = new Date();

  // Construir array de días para el grid
  const days = [];
  // Días del mes anterior para rellenar
  const prevMonthDays = (firstDay === 0 ? 6 : firstDay - 1);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthTotal = getDaysInMonth(prevMonth, prevYear);
  for (let i = prevMonthTotal - prevMonthDays + 1; i <= prevMonthTotal; i++) {
    days.push({ day: i, isDisabled: true });
  }
  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      isToday:
        i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      isSelected: selectedDay === i,
      hasEvent: !!events[dateKey],
      badge: events[dateKey] ? 'Evento' : '',
      onClick: () => setSelectedDay(i),
    });
  }
  // Días del siguiente mes para rellenar
  const nextDays = 42 - days.length;
  for (let i = 1; i <= nextDays; i++) {
    days.push({ day: i, isDisabled: true });
  }

  // Eventos del día seleccionado
  const selectedDateKey = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;
  const dayEvents = selectedDateKey && events[selectedDateKey] ? events[selectedDateKey] : [];

  // DEBUG LOGS
  console.log('CalendarView render');
  console.log('days', days);
  console.log('dayEvents', dayEvents);
  console.log('typeof days[0]', typeof days[0]);
  console.log('typeof dayEvents[0]', typeof dayEvents[0]);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDay(null);
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDay(null);
  };

  return (
    <div className={[styles.calendarView, className].join(' ').trim()} style={style}>
      <CalendarHeader
        month={month}
        year={year}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <CalendarWeekdays />
      <CalendarGrid days={days} />
      <CalendarEventList events={dayEvents} />
    </div>
  );
};

export default CalendarView; 