import React from 'react';
import { Drawer, Hidden } from '@mui/material';

const useStyles = {
  drawer: {
    '@media (min-width: 840px)': {
      width: "340px",
      flexShrink: 0,
    },
  },
  toolbar: {
    minHeight: "64px"
  },
  drawerPaper: {
    background: "#fff",
    width: "328px",
    pr: "12px",
    "border-top-right-radius": 16,
    "border-bottom-right-radius": 16,
    " .MuiButtonBase-root": {
      "border-top-right-radius": 32,
      "border-bottom-right-radius": 32,
    },
    " .MuiDivider-root": {
      maxWidth: "300px"
    }
  },
};

const ResponsiveDrawer = (props: any) => {
  const { window, children } = props;
  const classes: any = useStyles;
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <nav style={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          PaperProps={{
            sx: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
            sx: {
              backdropFilter: "blur(4px)"
            }
          }}
        >
          {children}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          PaperProps={{
            sx: {
              ...classes.drawerPaper,
              border: "none",
            }
          }}
          variant="permanent"
          sx={{
            flexShrink: 0,
            position: "fixed",
          }}
          open
        >
          <div style={classes.toolbar} />
          {children}
        </Drawer>
      </Hidden>
    </nav >
  );
}

export default ResponsiveDrawer;
