import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export const JsonTreeView = ({ data }) => {
  const [open, setOpen] = React.useState({});

  const toggleOpen = (key) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (value, key) => {
    if (value === null) {
      return React.createElement(ListItem, { key: key },
        React.createElement(ListItemText, {
          primary: key.split('-').pop(),
          secondary: "null"
        })
      );
    }

    if (typeof value === 'object' && value !== null) {
      return React.createElement(ListItem, { key: key },
        React.createElement(IconButton, {
          size: 'small',
          onClick: () => toggleOpen(key)
        }, open[key] 
          ? React.createElement(ExpandLess)
          : React.createElement(ExpandMore)
        ),
        React.createElement(ListItemText, {
          primary: key,
          secondary: `${Object.keys(value).length} items`
        }),
        React.createElement(Collapse, {
          in: open[key],
          timeout: 'auto',
          unmountOnExit: true
        },
          React.createElement(List, {
            sx: { paddingLeft: 4 }
          }, Object.entries(value).map(([k, v]) => 
            renderValue(v, `${key}-${k}`)
          ))
        )
      );
    }
    
    return React.createElement(ListItem, { key: key },
      React.createElement(ListItemText, {
        primary: key.split('-').pop(),
        secondary: value.toString()
      })
    );
  };

  return React.createElement(Paper, {
    elevation: 3,
    sx: { padding: 2, margin: 2 }
  },
    React.createElement(List, null,
      Object.entries(data).map(([key, value]) => 
        renderValue(value, key)
      )
    )
  );
}; 