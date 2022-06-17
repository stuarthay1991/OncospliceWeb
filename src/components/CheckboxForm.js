import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

function CheckboxForm(props)
{
	const [state, setState] = React.useState({
	    checked: false,
	  });

	  const handleChange = (event) => {
	    setState({ ...state, [event.target.name]: event.target.checked });
	    props.updateBQPanel(event.target.checked);
	  };

	return(
	<Tooltip title="Recommended for first time users. View a basic query's output and explore in the data viewer.">
	<div style={{marginLeft: 3, fontSize: 22}}>
	<input label="Use Default Query"
		   id="defaultquerycheckbox"
		   type="checkbox" 
		   checked={state.checked} 
		   onChange={handleChange}
		   name="checkedB"
		   style={{transform: 'scale(2, 2)'}}
	/>
	<label htmlFor={"defaultquerycheckbox"} style={{marginLeft: 11}}>Use Default Query</label>
	</div>
	</Tooltip>
	);
}

export default CheckboxForm;