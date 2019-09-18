import React from 'react';
import { shallow, render } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import PaymentFormStyles from '../PaymentForm.style';
import theme from '../../../../../../styles/theme';
import { PICKUP_STORE_SHIPPING_KEY, SPACE_KEY } from './../../../../../../constants';
import Checkbox from './../../../../../common/atoms/CheckBox';

import { PaymentFormVanilla } from '../PaymentForm';

const store = {
  subscribe: () => ({}),
  dispatch: () => ({}),
  getState: () => ({
    getIn: () => [],
  }),
};

const props = {
  className: '',
  paymentMethod: 'paypal',
  paymentFailed: '',
  checkoutLabels: fromJS([{}]),
  hidePaymentLoader: jest.fn(),
  cmsLabels: fromJS({
    termsOfService: '',
  }),
  cartData: fromJS({
    shippingAddress: {},
    billingAddress: {},
  }),
  billingAddressOnChange: jest.fn(),
  featureConfigs: fromJS([
    {
      key: '',
      value: '',
    },
  ]),
  paymentErr: '',
  validPaymentSection: jest.fn(),
  isBillingCheckboxChecked: jest.fn(),
  formType: 'billingForm',
  error: {
    text: 'not found',
    code: 404,
  },
  shippingPlaceHolder: 'shippingPlaceHolder',
  paymentWidgitConfigGetter: jest.fn(),
  shippingMethod: {
    key: PICKUP_STORE_SHIPPING_KEY,
  },
  formFields: {
    shippingPlaceHolder: {
      value: 'mock-value',
    },
  },
  isOpen: true,
};

const prevProps = {
  className: '',
  paymentMethod: 'paypal',
  paymentFailed: '',
  checkoutLabels: fromJS([{}]),
  hidePaymentLoader: jest.fn(),
  paymentErr: '',
  validPaymentSection: jest.fn(),
  formType: 'termConditionForm',
  error: {
    text: 'not found',
    code: 404,
  },
  paymentWidgitConfigGetter: jest.fn(),
};
describe('<PaymentForm />', () => {
  let wrapper = '';

  beforeEach(() => {
    wrapper = shallow(<PaymentFormVanilla {...props} />);
  });

  it('should call onChange ', () => {
    const event = {
      target: {
        checked: true,
      },
    };
    const arvatoPayment = shallow(<PaymentFormVanilla {...props} />);
    jest.spyOn(arvatoPayment.instance(), 'onChange');
    wrapper.instance().onChange(event);
  });

  it('should call handleKeyPress', () => {
    const event = {
      target: {
        checked: true,
      },
    };
    const arvatoPayment = shallow(<PaymentFormVanilla {...props} />);
    jest.spyOn(arvatoPayment.instance(), 'handleKeyPress');
    wrapper.instance().handleKeyPress(event, props.formType);
  });

  it('should render correctly - with cartItems', () => {
    const modifiedProps = {
      ...props,
      cartData: fromJS({
        lineItems: [],
      }),
    };
    wrapper = shallow(<PaymentFormVanilla {...modifiedProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleKeyPress correctly - with cartItems', () => {
    const modifiedProps = {
      ...props,
      cartData: fromJS({
        lineItems: [],
      }),
    };
    wrapper = shallow(<PaymentFormVanilla {...modifiedProps} />);
    const handleKeyPress = jest.spyOn(wrapper.instance(), 'handleKeyPress');
    const event = {
      which: SPACE_KEY,
    };
    wrapper
      .find(Checkbox)
      .at(1)
      .props()
      .handleKeyPress(event, 'termConditionForm');

    expect(handleKeyPress).toBeCalledTimes(1);
  });

  it('should call paymentWidgitGetter', () => {
    const paymentToken = '';
    const arvatoPayment = shallow(<PaymentFormVanilla {...props} />);
    jest.spyOn(arvatoPayment.instance(), 'paymentWidgitGetter');
    wrapper.instance().paymentWidgitGetter(paymentToken);
  });

  it('should call componentDidUpdate', () => {
    const arvatoPayment = shallow(<PaymentFormVanilla {...props} />);
    jest.spyOn(arvatoPayment.instance(), 'componentDidUpdate');
    wrapper.instance().componentDidUpdate(prevProps);
  });

  it('should call toggleShippingForm', () => {
    const arvatoPayment = shallow(<PaymentFormVanilla {...props} />);
    jest.spyOn(arvatoPayment.instance(), 'toggleShippingForm');
    wrapper.instance().toggleShippingForm();
  });

  it('should render the component correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the styled component correctly', () => {
    const TestComponent = styled(PaymentFormVanilla)(...PaymentFormStyles);
    const StyledComponent = (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TestComponent {...props} />
        </ThemeProvider>
      </Provider>
    );

    wrapper = render(StyledComponent);
    expect(wrapper).toMatchSnapshot();
  });
});
