import React from 'react';
import { inject, observer } from 'mobx-react';
// import { BirdStoreType } from '../../Stores/BirdCage';

@inject('birdStore')
@observer
class AddBirds extends React.Component {
  render() {
    // const { birdStore } = this.props;
    return (
      <div>
        <h1>Bird Cage</h1>
        <h2>Number of birds </h2>
      </div>
    );
  }
}

export default AddBirds;
