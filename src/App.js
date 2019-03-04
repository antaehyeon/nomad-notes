import React, { Component } from "react";
import { Query } from "react-apollo";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Query />
      </div>
    );
  }
}

export default App;

{
  /* <Query query={GET_NOTES}>{() => null}</Query>; */
}
