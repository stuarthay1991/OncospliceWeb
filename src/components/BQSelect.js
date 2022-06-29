import React from 'react';
import Form from 'react-bootstrap/Form'
import { makeStyles, withStyles } from '@material-ui/core/styles';

//This informs the style of the selection boxes on the build query page.

function BQSelect(props)
{
  var componentWidth = props.componentWidth == undefined ? "20em" : props.componentWidth;
  var componentHeight = props.componentHeight == undefined ? "25%" : props.componentHeight;
  var componentFontSize = props.componentFontSize == undefined ? "1.5em" : props.componentFontSize;
	return(
		<Form.Control as="select"
          value={props.value}
          onChange={props.handleChange}
          id={props.inputID}
          name="value"
          style={{
          	maxWidth: componentWidth,
		        minWidth: componentWidth,
          	maxHeight: componentHeight,
		        minHeight: componentHeight,
		        fontSize: componentFontSize
          }}>
        {props.children}
    </Form.Control>
    );
}

export default BQSelect;