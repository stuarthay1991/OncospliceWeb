import React from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FilterItem from './components/FilterItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import targeturl from './targeturl.js';
import axios from 'axios';

const BlueRadio = withStyles({
  root: {
    color: '#127ea6',
    '&$checked': {
      color: '#0F6A8B',
    },
    fontSize: "21px"
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 1000,
    fontSize: "1.22em",
    height: 62
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: "1.22em",
    height: 62
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));


function CustomizedInputBase() {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search by keyword, date, or data type"
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

function RadioButtonsGroup() {
  const [value, setValue] = React.useState('ascending');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
	<FormControl component="fieldset">
	    <FormLabel component="legend" style={{fontSize: "21px"}}>Sort by..</FormLabel>
	    <RadioGroup aria-label="sort" name="sort1" value={value} onChange={handleChange}>
	      <FormControlLabel value="ascending" control={<BlueRadio />} label="Ascending" />
	      <FormControlLabel value="descending" control={<BlueRadio />} label="Descending" />
	    </RadioGroup>
	</FormControl>
  );
}

function Panel(props)
{
	console.log("PANEL");
	return(
		<div>
		<div style={{background: "#FFFFFF 0% 0% no-repeat padding-box", borderRadius: "5px", opacity: 1, margin: "50px 100px"}}>
			<CustomizedInputBase />

		</div>
		<div style={{background: "#FFFFFF 0% 0% no-repeat padding-box", borderRadius: "5px", opacity: 1, margin: "50px 100px"}}>
			<RadioButtonsGroup />
	    </div>
		<div>
			{props.children}
		</div>
		</div>
	);
}

function Item(props)
{
	var item_dump = [];
	for(var i = (props.data["obj"].length-1); i >= 0; i--)
	{
		item_dump.push(<FilterItem item={props.data["obj"][i]["val"]} fontSize={15} padding={7}></FilterItem>)
	}
	//const date = props.date;
	console.log("ITEM");
	return(
		<div style={{background: "#FFFFFF 0% 0% no-repeat padding-box", boxShadow: "0px 3px 6px #00000029", borderRadius: "5px", opacity: 1, marginTop: "50px", marginBottom: "50px", marginLeft: "100px", width: "60%"}}>

		    <div style={{fontSize: 18, margin: 9, fontWeight: "bold", textAlign: 'left'}}>
		      <Grid container spacing={2}>
		      <Grid item>
		      <AccessTimeIcon style={{backgroundColor: 'white', color: '#0F6A8B', fontSize: 44}}/>
		      </Grid>
		      <Grid item>
		      <strong style={{color: "Black", fontSize: 19, padding: 4, marginLeft: 2, position: "relative", top: "10px"}}>{props.data["date"]}</strong>
		      </Grid>
		      </Grid>
		    </div>

			<Grid container spacing={2}>
				<Grid item xs={8}>
				<Grid container spacing={1}>
				{item_dump}
				</Grid>
				</Grid>
				<Grid item>
					<Button variant="contained" style={{backgroundColor: "#FFFFFF"}} onClick={() => props.goQuery(props.data["obj"])}><ArrowForwardIcon style={{backgroundColor: 'white', color: '#0F6A8B', fontSize: 27}}/></Button>
				</Grid>
				<Grid item>
					<Button variant="contained" style={{backgroundColor: "#FFFFFF"}} onClick={() => props.removeQueryHistory(props.data["atom"])}><DeleteIcon style={{backgroundColor: 'white', color: '#0F6A8B', fontSize: 27}}/></Button>
				</Grid>
				<Grid item>
					<Button variant="contained" style={{backgroundColor: "#FFFFFF"}}><StarOutlineIcon style={{backgroundColor: 'white', color: '#0F6A8B', fontSize: 27}}/></Button>
				</Grid>				
			</Grid>
		</div>
	);
}

class QueryHistory extends React.Component {
  constructor(props) {
    super(props)
  }

  deleteQuery(selectedquery)
  {
    console.log(selectedquery);
    var bodyFormData = new FormData();
    bodyFormData.append("filename",selectedquery);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistorydelete.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
        console.log("poo");
    })
  }

  render()
  {
  	console.log("QH");
  	const children = [];
  	for(var i = 0; i < this.props.Data.length; i++)
  	{
  		children.push(<Item data={this.props.Data[i]} index={i} removeQueryHistory={this.deleteQuery} goQuery={this.props.goQuery}></Item>);
  	}
    return(
      <div>
      <Panel>
      {children}
      </Panel>
      </div>
    );
  }
}

export default QueryHistory;