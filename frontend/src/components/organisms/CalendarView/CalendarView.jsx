import React, { useState, useMemo, useCallback } from 'react';
import styles from './CalendarView.module.css';
import CalendarHeader from '../../molecules/CalendarHeader/CalendarHeader';
import CalendarWeekdays from '../../molecules/CalendarWeekdays/CalendarWeekdays';
import CalendarGrid from '../../molecules/CalendarGrid/CalendarGrid';
import CalendarEventList from '../../molecules/CalendarEventList/CalendarEventList';
import { createLogger } from '../../../utils/debug.js';

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const CalendarView = React.memo(({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
  events = {}, // { '2024-06-10': [{title, time}], ... }
  className = '',
  style = {},
  onDayClick
}) => {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selectedDay, setSelectedDay] = useState(null);
  const logger = createLogger('CalendarView');

  // Memoizar cálculos costosos
  const { daysInMonth, firstDay, today } = useMemo(() => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfWeek(month, year) || 7; // 0=Domingo, 1=Lunes...
    const today = new Date();
    return { daysInMonth, firstDay, today };
  }, [month, year]);

  // Memoizar array de días para evitar recálculos
  const days = useMemo(() => {
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
        onClick: () => handleDayClick(dateKey),
        dateKey,
        isDisabled: false
      });
    }
    // Días del siguiente mes para rellenar
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push({ day: i, isDisabled: true });
    }
    return days;
  }, [month, year, daysInMonth, firstDay, today, selectedDay, events]);

  // Memoizar eventos del día seleccionado
  const dayEvents = useMemo(() => {
    const selectedDateKey = selectedDay
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
      : null;
    return selectedDateKey && events[selectedDateKey] ? events[selectedDateKey] : [];
  }, [selectedDay, year, month, events]);

  // Callbacks para handlers
  const handleDayClick = useCallback((dateKey) => {
    setSelectedDay(parseInt(dateKey.split('-')[2]));
    if (onDayClick) {
      logger.log('Click en día:', dateKey);
      onDayClick(dateKey);
    }
  }, [onDayClick, logger]);

  const handlePrev = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDay(null);
  }, [month]);

  const handleNext = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDay(null);
  }, [month]);

  // DEBUG LOGS
  logger.log('render');
  logger.log('days', days);
  logger.log('dayEvents', dayEvents);
  logger.log('typeof days[0]', typeof days[0]);
  logger.log('typeof dayEvents[0]', typeof dayEvents[0]);

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
});

CalendarView.displayName = 'CalendarView';

export default CalendarView; 