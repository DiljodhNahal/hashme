import React from 'react';
import axios from "axios";

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {Grid, ButtonGroup, Button, TextField, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Input} from '@material-ui/core';
import {DropzoneArea} from "material-ui-dropzone";

import Navbar from "./components/Navbar";
import Copyright from "./components/Copyright";


const theme = createMuiTheme({
    palette: {
      type: "dark",
      secondary: {
        main: "#FFFFFF"
      }
    }
  })


const useStyles = theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      marginLeft: '20%',
      marginRight: '20%',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
});


class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoaded: false,
      error: null,
      activeEncoder: 0,
      items: [],
      buttons: [],
      titleText: "Loading...",
      textFieldValue: "",
      outputValue: "",
      saltValue: "",
      bitValue: null,
      modalOpen: false,
      shake: false,
    }
  }

  componentDidMount() {

    axios.get(`https://hashme.herokuapp.com/api/`, {headers: {'KEY': '3c0ce0e0f6befa66ff18d9276f72f795d551774207f5b81feb438d661de07082'}})
        .then(res => {
          const data = res.data['encoders'];
          let buttons = [];
          for (let i = 0; i < data.length; i++) {
            buttons.push(<Button key={data[i]} onClick={(e) => this.buttonClick(e, i)}>{data[i].replace("_", " ")}</Button>);
          }
          this.setState({
            isLoaded: true,
            items: data,
            buttons: buttons,
            titleText: data[this.state.activeEncoder].replace("_", " ")
          });
        })
  }

  buttonClick(event, i) {
    let shake = false;
    if (this.state.items[i].includes("shake")) {
      shake = true;
    }
    this.setState({
      activeEncoder: i,
      titleText: this.state.items[i].replace("_", " "),
      shake: shake
    });
  }

  handleTextFieldChange(event) {
    this.setState({
      textFieldValue: event.target.value
    });
    console.log(event.target.value);
  }

  handleSaltFieldChange(event) {
    this.setState({
      saltValue: event.target.value
    });
  }

  handleBitFieldChange(event) {
    let currentValue = parseInt(event.target.value);
    if (currentValue > 2048) {
      currentValue = 2048;
    } else if (isNaN(currentValue)) {
      currentValue = null;
    }
    this.setState({
      bitValue: currentValue
    });
  }

  encrypt(event) {
    let options = {
      headers: {'KEY': '3c0ce0e0f6befa66ff18d9276f72f795d551774207f5b81feb438d661de07082'}
    };
    let enteredText = this.state.textFieldValue;
    let enteredSalt = this.state.saltValue;
    let body = {'encoder': this.state.items[this.state.activeEncoder], 'data': enteredText + enteredSalt}
    if (this.state.bitValue == null) {
      body['bits'] = 8;
    } else {
      body['bits'] = this.state.bitValue;
    }
    axios.post(`https://hashme.herokuapp.com/api/`, body, options)
        .then(res => {
          let hashed = res.data['hashed'];
          this.setState({
            outputValue: hashed
          });
        })
  }

  modalState(event) {
    if (this.state.modalOpen === true) {
      this.setState({
        modalOpen: false
      });
    } else {
      this.setState({
        modalOpen: true
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Navbar />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h4" align="center" style={{marginBottom: 12}}>
                {this.state.titleText}
              </Typography>
              <Grid container spacing={1} justify={"center"}>
                <Grid container item lg={10} xs={12}>
                  <React.Fragment>
                    <TextField
                        id={"data"}
                        label={"Input"}
                        multiline
                        rows={8}
                        size={"medium"}
                        fullWidth
                        variant={"outlined"}
                        color={"secondary"}
                        value={this.state.textFieldValue}
                        onChange={(e) => this.handleTextFieldChange(e)}
                    />
                    <Grid item xs={5} className={classes.root}>
                        <Button variant="contained" onClick={(e) => this.encrypt(e)}>Hash</Button>
                        <Button variant="contained" onClick={(e) => this.modalState(e)}>Add Salt</Button>
                    </Grid>
                    <Grid item xs={2}>
                      { this.state.shake ?
                      <Input
                            id={"bits"}
                            type={"number"}
                            color={"secondary"}
                            endAdornment={"bits"}
                            value={this.state.bitValue}
                            onChange={(e) => this.handleBitFieldChange(e)}
                        /> : null }
                    </Grid>
                    <TextField
                      id={"hashed"}
                      label={"Output"}
                      multiline
                      rows={8}
                      fullWidth
                      size={"medium"}
                      variant={"outlined"}
                      color={"secondary"}
                      value={this.state.outputValue}
                    />
                  </React.Fragment>
                </Grid>
                <Grid container item lg={2} xs={12} justify={"center"}>
                  <ButtonGroup
                    orientation={"vertical"}
                    color={"inherit"}
                    variant={"text"}
                  >
                    {this.state.buttons}
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Paper>
            <Copyright />
          </main>
        </React.Fragment>
        <Dialog open={this.state.modalOpen} onClose={(e) => this.modalState(e)} aria-labelledby={"form-dialog-title"} fullWidth>
          <DialogTitle id={"form-dialog-title"}>Add Salt</DialogTitle>
          <DialogContent>
            <TextField
              id={"salt"}
              label={"Salt"}
              multiline
              fullWidth
              rows={4}
              size={"medium"}
              variant={"outlined"}
              color={"secondary"}
              value={this.state.saltValue}
              onChange={(e) => this.handleSaltFieldChange(e)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => this.modalState(e)} color={"secondary"} variant={"outlined"}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }
}

export default withStyles(useStyles)(App);