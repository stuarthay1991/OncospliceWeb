import React from 'react';
import SpcInputLabel from "./SpcInputLabel";

function FilterHeatmapSelect(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    value: 'Batch number',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    //console.log("metarepost", event.target.value);
    metarepost(event.target.value);
  }

  return (
    <div>
      <SpcInputLabel label={"Show Sample"} />
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          native
          value={state.value}
          onChange={handleChange}
          inputProps={{
            name: 'value',
            id: "HeatmapFilterSelect_id",
          }}
        >
          <option value={state.value}>{state.value}</option>
          {(() => {
            const options = [];
            for (const [key, value] of Object.entries(global_uifielddict)) {
              var name_selected = key.replaceAll("_", " ");
              name_selected = name_selected.charAt(0).toUpperCase() + name_selected.slice(1);
              options.push(<option value={key}>{name_selected}</option>);
            }
            return options;
          })()}
        </Select>
      </FormControl>
    </div>
  );
}

export default FilterHeatmapSelect;