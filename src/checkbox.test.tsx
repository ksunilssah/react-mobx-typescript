import React from 'react';
import { shallow } from 'enzyme';
import { CheckboxBasicExample } from './checkbox';

describe('CheckboxBasic example', () => {
    it('should render correctly', () => {
        const wrapper = shallow(<CheckboxBasicExample></CheckboxBasicExample>);
        expect(wrapper).toMatchSnapshot();
    })
});