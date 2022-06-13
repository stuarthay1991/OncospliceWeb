import Select from '@material-ui/core/Select';
import React from 'react';
import Form from 'react-bootstrap/Form'
import { makeStyles, withStyles } from '@material-ui/core/styles';

//This informs the style of the selection boxes on the build query page.
const widgetlabel = makeStyles((theme) => ({
  root: {
    maxWidth: "360px",
    minWidth: "360px",
    fontSize: "24px"
    }
}));

function BQSelect(props)
{
	const classes = widgetlabel();
	return(
		<Select
          native
          classes={classes}
          value={props.value}
          onChange={props.handleChange}
          inputProps={{
            name: 'value',
            id: props.inputID,
          }}>
        {props.children}
        </Select>
    );
}

export default BQSelect;