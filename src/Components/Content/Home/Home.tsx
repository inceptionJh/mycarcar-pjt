import * as React from "react";
import background from "../../../assets/img/slider1.jpg";

class Home extends React.Component {
  render() {
    return (
      <div>
        <img className="background" src={background} />
      </div>
    );
  }
}

export default Home;
