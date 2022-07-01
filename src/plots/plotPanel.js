import SpcInputLabel from '../components/SpcInputLabel';
import Box from '@material-ui/core/Box';

const spboxProps = {border: 3};

function PlotPanel(props){
	return(
	<div style={{marginBottom: 10}}>
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