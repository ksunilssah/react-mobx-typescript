import { shallow, render } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import styled, { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

import CampaignDefaultView, {
  CampaignDefaultViewVanilla
} from '../CampaignDefaultView';
import styles from './../CampaignDefaultView.style';
import mockData from './../../../templates/pageConfiguration';
import theme from '../../../../../../styles/theme';

describe('<CampaignDefaultView />', () => {
  const props = {
    pageData: fromJS(mockData['beovision-harmony']),
    className: 'class-component',
    locale: 'en',
    submitCampaignForm: jest.fn()
  };

  const state = {
    global: {
      globalData: {
        countryList: []
      }
    }
  };

  const stores = {
    subscribe: () => ({}),
    getState: () => fromJS(state),
    dispatch: () => ({})
  };

  let CampaignConfirmationComponent = '';
  beforeEach(() => {
    CampaignConfirmationComponent = shallow(
      <CampaignDefaultViewVanilla {...props} />
    );
  });

  test('should render correctly', () => {
    expect(CampaignConfirmationComponent).toMatchSnapshot();
  });

  test('should call formSubmitHandler correctly', () => {
    CampaignConfirmationComponent.instance().formSubmitHandler(props.pageData);
    expect(props.submitCampaignForm).toHaveBeenCalledTimes(1);
  });

  it('should render the styled component correctly', () => {
    const TestComponent = styled(CampaignDefaultView)(...styles);
    const StyledComponent = (
      <Provider store={stores}>
        <IntlProvider locale="en">
          <ThemeProvider theme={theme}>
            <TestComponent {...props} />
          </ThemeProvider>
        </IntlProvider>
      </Provider>
    );

    const wrapper = render(StyledComponent);
    expect(wrapper).toMatchSnapshot();
  });
});
