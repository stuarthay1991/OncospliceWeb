import React from 'react';

function PreQueueMessage(props) 
{
  return(
      <div>
      <div>{props.name}</div>
      <div>{props.value}</div>
      </div>
    );
}

export default PreQueueMessage;