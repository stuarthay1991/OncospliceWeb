import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import '@fontsource/roboto';

const labelstyle = makeStyles((theme) => ({
  labelstyle: {
    backgroundColor: '#0F6A8B',
    fontFamily: 'Roboto',
    color: 'white',
    fontSize: 24,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    marginLeft: 2,
    maxWidth: "180px",
    width: "180px",
    minWidth: "180px"
  }
}));

function SpcInputLabel(props)
{
	const classes = labelstyle();
	return (
		<div className={classes.labelstyle}>
		<strong>{props.label}</strong>
		</div>
	);
}

export default SpcInputLabel;