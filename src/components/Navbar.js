import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EnhancedEncryption from '@material-ui/icons/EnhancedEncryption';

const useStyles = theme => ({
  appBar: {
    position: "relative",
    backgroundColor: "dark"
  },
  icon: {
    marginRight: 4
  },

});

class Navbar extends React.Component {

  render() {

    const { classes } = this.props;

    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <EnhancedEncryption className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            hashme
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(useStyles)(Navbar);