import * as React from 'react';
import Button from '@mui/material/Button';

export const CustomButton = ({ label, href, variant = 'contained', color = 'primary', onClick, ...props }) => {
  return React.createElement(Button, {
    variant,
    color,
    onClick: href ? () => window.open(href, '_blank') : onClick,
    size: 'medium',
    sx: {
      margin: '8px',
      textTransform: 'none',
      ...props.sx
    },
    ...props
  }, label.toString());
}; 