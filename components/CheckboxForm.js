import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

//#0F6A8B
const SpcCheckbox = withStyles({
  root: {
    color: "#0F6A8B",
    '&$checked': {
      color: "#0F6A8B",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


function CheckboxForm(props)
{
	const [state, setState] = React.useState({
	    checkedB: false,
	  });

	  const handleChange = (event) => {
	    setState({ ...state, [event.target.name]: event.target.checked });
	    props.updateBQPane(event.target.checked);
	    props.qBDefaultMessage(event.target.checked);
	    console.log(event.target.checked);
	  };

	return(
	<div style={{marginLeft: 3}}>
	<FormControlLabel
	    control={
	        <SpcCheckbox
	            checked={state.checkedB}
	            onChange={handleChange}
	            name="checkedB"
	        />
	        }
	    label="Use Default Query"
	/>
	</div>
	);
}

export default CheckboxForm;