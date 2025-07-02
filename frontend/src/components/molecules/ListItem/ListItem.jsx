import React from 'react';
import styles from './ListItem.module.css';
import Avatar from '../../atoms/Avatar/Avatar';
import Badge from '../../atoms/Badge/Badge';
import Chip from '../../atoms/Chip/Chip';

const ListItem = ({
  avatarSrc,
  icon = null,
  primary,
  secondary = '',
  badge = '',
  chip = '',
  actions = null,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.listItem, className].join(' ').trim()} style={style} {...rest}>
      {avatarSrc ? (
        <Avatar src={avatarSrc} alt={primary} size='sm' />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      <div className={styles.texts}>
        <span className={styles.primary}>{primary}</span>
        {secondary && <span className={styles.secondary}>{secondary}</span>}
      </div>
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      {chip && <Chip className={styles.chip}>{chip}</Chip>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default ListItem; 