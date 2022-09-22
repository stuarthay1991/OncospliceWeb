import SpcInputLabel from '../components/SpcInputLabel';
import Box from '@material-ui/core/Box';

const spboxProps = {border: 3, margin: 3};

function PlotPanel(props){
	return(
	<div style={{margin: 6, display: "inline-block", width: "100%", maxWidth: "600px"}}>
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