import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import FormCheck from 'react-bootstrap/FormCheck';
import Tooltip from '@material-ui/core/Tooltip';

//#0F6A8B
/*const SpcCheckbox = withStyles({
  root: {
    color: "#0F6A8B",
    '&$checked': {
      color: "#0F6A8B",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);*/


function CheckboxForm(props)
{
	const [state, setState] = React.useState({
	    checkedB: false,
	  });

	  const handleChange = (event) => {
	    setState({ ...state, [event.target.name]: event.target.checked });
	    props.updateBQPane(event.target.checked);
	    //props.qBDefaultMessage(event.target.checked);
	    console.log(event.target.checked);
	  };

	return(
	<Tooltip title="Recommended for first time users. View a basic query's output and explore in the data viewer.">
	<div style={{marginLeft: 3, fontSize: 22}}>
	<input label="Use Default Query"
		   id="defaultquerycheckbox"
		   type="checkbox" 
		   checked={state.checkedB} 
		   onChange={handleChange}
		   name="checkedB"
		   style={{transform: 'scale(2, 2)'}}
	/>
	<label htmlFor={"defaultquerycheckbox"} style={{marginLeft: 4}}>Use Default Query</label>
	</div>
	</Tooltip>
	);
}

export default CheckboxForm;