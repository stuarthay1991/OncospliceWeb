import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { AccessAlarm, ExpandMore, OpenInNew, Timeline, GetApp, ChevronRight, Add } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import OKMAP from './OKMAP.js';
import useStyles from './useStyles.js';

const defaultProps = {
  m: 1,
};

const boxProps = {
  border: 3,
};

const boxProps_padding = {
  border: 3,
  margin: 1,
  paddingRight: '10px',
  display: 'inline-block',
};

var stat_table = {};

function updateStats(id, input){
    const bottle = [];
    for (const [key, value] of Object.entries(input)) {
        bottle.push(createData(key, value));
    }
    this.setState({
      curSelect: id,
      curAnnots: bottle,
    });
}

function createData(name, value) {
  return { name, value };
}

var rows = [
  createData('-none selected-', '-none selected-'),
];

function FilterHeatmap(){
  const classes = useStyles();  

  return(
    <Box borderColor="#dbdbdb" {...boxProps}>
      <div id="FH_0">
        <p>Select attributes to filter heatmap</p>
      </div>
      <FilterHeatmapSelect />
      <Typography className={classes.medpadding} />
    </Box>
  )
}

function FilterHeatmapSelect(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    value: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  }

  return (
    <Grid item xs={3}>
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={"HeatmapFilterSelect_id"}>{"Show Sample..."}</InputLabel>
        <Select
          native
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: "HeatmapFilterSelect_id",
          }}
        >
          <option value=""></option>
          {(() => {
            const options = [];
            options.push(<option value={"age range"}>{"age range"}</option>);
            options.push(<option value={"gender_demographic"}>{"gender_demographic"}</option>);
            options.push(<option value={"ethnicity_demographic"}>{"ethnicity_demographic"}</option>);
            return options;
          })()}
        </Select>
      </FormControl>
    </div>
    </Grid>
  );
}


class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curSelect: 0,
      curAnnots: [],
    };
  }

  render()
  {
    var tablerows = this.state.curAnnots;

    return(
    <Box borderColor="#dbdbdb" {...boxProps}>
      <div id="STATS_0">
        <CustomizedTables contents={tablerows}/>
      </div>
    </Box>
    );
  }

}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const tableStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

function CustomizedTables(props) {
  const classes = tableStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="left">Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tablerows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
              <StyledTableCell align="left">{row.value}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


function Heatmap() {
  const classes = useStyles(); 
  return (
    <Box {...defaultProps}>
      <div id="HEATMAP_0"></div>
    </Box>
  );
}

function ViewPane() {
  const [state, setState] = React.useState({
    inData: []
  });

  const classes = useStyles();

  return (
    <div style={{ fontFamily: 'Arial' }}>
    <div>
      <Grid container spacing={1}>    
        <Grid item xs={2}>
          <div className={classes.cntr_viewpane}>Plot Settings</div>
        </Grid>
        <Grid item xs={9}>
        </Grid>
        <Grid item xs={1}>
          <div className={classes.cntr_viewpane}><Button aria-label="Expand"><ExpandMore style={{ fontSize: 32 }}/></Button></div>
        </Grid>
      </Grid>
    </div>
    <Typography className={classes.padding} />
    <div className={classes.hidden_panel} id="ViewPane_SubPane">
    <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
        <div className={classes.baseinput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <TextField id="standard-basic" label="Annotate samples by..." className={classes.input} inputProps={{ 'aria-label': 'Annotate samples by' }}/>
        <IconButton type="submit" className={classes.iconSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
        </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
        <div className={classes.baseinput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <TextField id="standard-basic" label="Select Feature Type" className={classes.input} inputProps={{ 'aria-label': 'Select Feature Type' }}/>
        <IconButton type="submit" className={classes.iconSearch} aria-label="search">
          <SearchIcon />
        </IconButton>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Typography className={classes.padding} />
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <div>
            <Button variant="contained" style={{ textTransform: 'none'}}>Select data to plot</Button>
          </div>
          <Box borderColor="#dbdbdb" {...boxProps}>
              <Typography className={classes.medpadding} />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Typography className={classes.padding} />
    </div>
    <div id="ViewPane_MainPane">
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <FilterHeatmap></FilterHeatmap>
          <Stats></Stats>
        </Grid>
        <Grid item xs={7}>
          <Heatmap></Heatmap>
        </Grid>
        <Grid item xs={1}>
          <div className={classes.cntr_btn}><Button variant="contained"><OpenInNew style={{ fontSize: 40 }}/></Button></div>
          <div className={classes.cntr_btn}><Button variant="contained"><Timeline style={{ fontSize: 40 }}/></Button></div>
          <div className={classes.cntr_btn}><Button variant="contained"><GetApp style={{ fontSize: 40 }}/></Button></div>
        </Grid>
      </Grid>
    </div>
    </div>
  );
}
export default ViewPane;