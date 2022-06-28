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
          id={props.inputID}
          name="value"
          style={{
          	maxWidth: "20em",
		        minWidth: "20em",
          	maxHeight: "25%",
		        minHeight: "25%",
		        fontSize: "1.75em"
          }}>
        {props.children}
        </Form.Control>
    );
}

export default BQSelect;