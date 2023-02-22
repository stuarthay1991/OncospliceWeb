import SpcInputLabel from '../components/SpcInputLabel';
import Box from '@material-ui/core/Box';

const spboxProps = {border: 3, margin: 3};

function PlotPanel(props){
	var available_width = window.innerWidth;
	var maxpossiblewidth = 0.290 * available_width;
	return(
	<div style={{margin: 6, display: "inline-block", width: "100%", maxWidth: maxpossiblewidth}}>
	<SpcInputLabel label={props.plotLabel} />
	<Box borderColor="#dbdbdb" {...spboxProps}>
	<div>
		{props.children}
	</div>
	</Box>
	</div>
	);
}

export default PlotPanel;