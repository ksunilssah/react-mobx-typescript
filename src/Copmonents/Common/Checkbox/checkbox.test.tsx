import React from 'react';
import { shallow } from 'enzyme';
import CheckBox  from './';

describe('CheckboxBasic example', () => {
    it('should render correctly', () => {
        const wrapper = shallow(<CheckBox />);
        expect(wrapper).toMatchSnapshot();
    })
});