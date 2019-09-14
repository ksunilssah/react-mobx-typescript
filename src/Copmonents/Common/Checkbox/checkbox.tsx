import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

export interface ICheckboxBasicExampleState {
  isChecked: boolean;
}

export  default class CheckBox extends React.Component<{}, ICheckboxBasicExampleState> {
  constructor(props: {}) {
    super(props);

    this._onCheckboxChange = this._onCheckboxChange.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Checkbox label="Standard checkbox" onChange={this._onCheckboxChange} />
        fasf fasdf
      </div>
    );
  }

  private _onCheckboxChange() {
    console.log('he option has been changed to ');
  }
}