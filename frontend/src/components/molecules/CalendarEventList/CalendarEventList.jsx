import React from 'react';
import styles from './CalendarEventList.module.css';

const CalendarEventList = ({
  events = [],
  renderEvent,
  emptyText = 'Sin eventos',
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarEventList, className].join(' ').trim()} style={style} {...rest}>
      {events.length === 0 ? (
        <div className={styles.empty}>{emptyText}</div>
      ) : (
        events.map((event, i) =>
          renderEvent ? renderEvent(event, i) : (
            <div className={styles.event} key={i}>
              <span className={styles.eventTitle}>{event.title}</span>
              {event.time && <span className={styles.eventTime}>{event.time}</span>}
            </div>
          )
        )
      )}
    </div>
  );
};

export default CalendarEventList; 