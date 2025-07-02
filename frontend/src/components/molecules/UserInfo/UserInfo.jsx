import React from 'react';
import styles from './UserInfo.module.css';
import Avatar from '../../atoms/Avatar/Avatar';
import Text from '../../atoms/Text/Text';
import Badge from '../../atoms/Badge/Badge';
import CardSubtitle from '../../atoms/CardSubtitle/CardSubtitle';

const UserInfo = ({
  avatarSrc,
  name,
  subtitle = '',
  badge = '',
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.userInfo, className].join(' ').trim()} style={style} {...rest}>
      <Avatar src={avatarSrc} alt={name} size='md' />
      <div className={styles.infoText}>
        <Text as='span' className={styles.name}>{name}</Text>
        {subtitle && <CardSubtitle className={styles.subtitle}>{subtitle}</CardSubtitle>}
        {badge && <Badge className={styles.badge}>{badge}</Badge>}
      </div>
    </div>
  );
};

export default UserInfo; 