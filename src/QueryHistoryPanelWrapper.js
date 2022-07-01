import React from 'react';
import ReactDOM from 'react-dom';
import QueryHistory from './QueryHistory';
import axios from 'axios';
import targeturl from './targeturl.js';

function none()
{
  return null;
}

//This whole section is likely to be removed in the future. Originally, this was supposed to be a way for users to click back to old
//queries they've made and see the results of those queries. In practice, this is impractical for queries with a large amount of genes
//and/or coordinates.
class QueryHistoryPanelWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inData: [],
      user: "Default"
    }
    updateQueryHistory = updateQueryHistory.bind(this);
  }

  componentDidMount() {
    var bodyFormData = new FormData();
    bodyFormData.append("user",this.state.user);
    axios({
      method: "post",
      url: (targeturl.concat("/backend/queryhistoryaccess.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        var responsedata = response["data"];
        var tmp_array = [];
        //console.log("RESPONSE", responsedata);
        updateQueryHistory(responsedata);
    })

  }

  removeQueryHistory = (index) => {
    const newdat = this.state.inData;
    newdat.splice(index, 1);
    this.setState({
    inData: newdat
    });    
  }

  render()
  {
    return(
      <div>
        {this.state.inData.length > 0 && (
        <QueryHistory Data={this.state.inData} 
          removeQueryHistory={this.removeQueryHistory} 
          goQuery={none}/>
        )}
      </div>
    );
  }
}

function updateQueryHistory(input) {
    this.setState({
    inData: input
    });
}

export default QueryHistoryPanelWrapper;
