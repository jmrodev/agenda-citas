import React from 'react';
import styles from './CalendarDayInfo.module.css';
import CalendarDay from '../../atoms/CalendarDay/CalendarDay';
import CalendarDot from '../../atoms/CalendarDot/CalendarDot';
import Badge from '../../atoms/Badge/Badge';
import Chip from '../../atoms/Chip/Chip';

const CalendarDayInfo = ({
  day,
  isToday = false,
  isSelected = false,
  isDisabled = false,
  hasEvent = false,
  badge = '',
  chip = '',
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarDayInfo, className].join(' ').trim()} style={style} {...rest}>
      <div className={styles.dayWrapper}>
        <CalendarDay
          day={day}
          isToday={isToday}
          isSelected={isSelected}
          isDisabled={isDisabled}
          onClick={rest.onClick}
        />
        {hasEvent && <CalendarDot className={styles.dot} />}
      </div>
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      {chip && <Chip className={styles.chip}>{chip}</Chip>}
    </div>
  );
};

export default CalendarDayInfo; 