import React from 'react';
import Form from 'react-bootstrap/Form'
import { makeStyles, withStyles } from '@material-ui/core/styles';

//This informs the style of the selection boxes on the build query page.
function BQSelect(props)
{
	return(
		<Form.Control as="select"
          value={props.value}
          onChange={props.handleChange}
          inputProps={{
            name: 'value',
            id: props.inputID,
          }}
          style={{
          	maxWidth: "560px",
		    minWidth: "560px",
          	maxHeight: "50px",
		    minHeight: "50px",
		    fontSize: "24px"
          }}
          >
        {props.children}
        </Form.Control>
    );
}

export default BQSelect;