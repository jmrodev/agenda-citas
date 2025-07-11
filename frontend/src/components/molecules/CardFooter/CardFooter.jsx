import React from 'react';
import styles from './CardFooter.module.css';
import CardActions from '../../atoms/CardActions/CardActions';
import Chip from '../../atoms/Chip/Chip';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';

/**
 * CardFooter is a molecule that forms the footer section of a Card component.
 * It typically contains actions (buttons), and can optionally display a Chip or a ProgressBar.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} [props.children] - Content to be rendered inside CardActions, usually Button atoms.
 * @param {string} [props.chip=''] - Text content for a Chip component displayed in the footer.
 * @param {number} [props.progress=null] - A number (0-100) to set the value of a ProgressBar. If null, ProgressBar is not rendered.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the CardFooter's root div.
 * @param {object} [props.style={}] - Inline styles to apply to the CardFooter's root div.
 * @param {object} [props.rest] - Any other props will be spread onto the CardFooter's root div.
 * @returns {JSX.Element} The rendered card footer component.
 */
const CardFooter = ({
  children,
  chip = '',
  progress = null,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.cardFooter, className].join(' ').trim()} style={style} {...rest}>
      {chip && <Chip className={styles.chip}>{chip}</Chip>}
      {progress !== null && <ProgressBar value={progress} className={styles.progress} />}
      <CardActions className={styles.actions}>{children}</CardActions>
    </div>
  );
};

export default CardFooter; 