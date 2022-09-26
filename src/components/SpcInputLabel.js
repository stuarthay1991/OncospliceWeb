import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import useStyles from '../css/useStyles.js';
import Typography from '@material-ui/core/Typography';
import '@fontsource/roboto';

const labelstyle = makeStyles((theme) => ({
  labelstyle: {
    backgroundColor: '#0F6A8B',
    fontFamily: 'Roboto',
    color: 'white',
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 2
  }
}));

//This is a "special input label"
function SpcInputLabel(props)
{
    var customFontSize = undefined;
    const typographyClasses = useStyles();
	const classes = labelstyle();
    if(props.customFontSize == undefined)
    {
        customFontSize = "1.4em";
    }
	return (
        <>
        {props.noSpaceAbove != true && (
            <Typography style={{padding: 4}} />
        )}
        <div style={{marginBottom: 5, marginTop: 5, fontSize: customFontSize}}>
		<strong className={classes.labelstyle}>{props.label}</strong>
        </div>
        </>
	);
}

export default SpcInputLabel;