/**
 *
 * PaymentForm
 *
 */
// @flow
import { PureComponent } from 'react';
import { List } from 'immutable';
import type { Node } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import withStyles from 'lib/withStyles';
import DeliveryAddressForm from 'components/common/molecules/DeliveryAddressForm';
import { PICKUP_STORE_SHIPPING_KEY, ENTER_KEY, SPACE_KEY, TABINDEX_ZERO } from 'constants';
import CheckBox from 'components/common/atoms/CheckBox';
import { gtmTrackCheckoutImpressionDetails, gtmTrackErrorPageActions, gtmTrackGlobalActions } from 'utils/analytics';
import { renderLinkLabels } from 'utils/utils';
import {
  CHECKOUT_LABEL,
  CHECKBOX_LABEL,
  BILLING_ADDRESS_CHECKBOX,
  BILLING_CHECKBOX_CHECK,
  BILLING_CHECKBOX_UNCHECK,
  CHECKOUT_PAYMENT_DETAILS,
  NEWSLETTER_SUBSCRIBE_CHECKBOX,
  TRACKING_STEPS_ENUM,
} from 'utils/analytics/constants';
import styles from './PaymentForm.style';
import type { State, Props } from './types';
import ArvatoPayment from './../ArvatoPayment';
import { hidePaymentLoader } from './../../templates/CheckoutPage.actions';

// Error Boundary
import withErrorBoundary from '../../../../../utils/errorBoundary';

const billingForm = 'billingForm';
const termConditionForm = 'termConditionForm';
const newsletterSubscription = 'newsletterSubscription';

class PaymentForm extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.newsletterSubscriptionCheckbox = false;
    this.state = {
      validSection: false,
      checkboxStatus: false,
      billingFormCheckbox: true,
    };
  }

  componentDidMount = () => {
    this.props.hidePaymentLoader();
    const { shippingAddress, billingAddress } = this.props.cartData && this.props.cartData.toJS();
    if (!isEmpty(shippingAddress) && !isEmpty(billingAddress)
      && !isEqual(shippingAddress, billingAddress)) {
      this.setState({ billingFormCheckbox: false });
    }
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error && error !== prevProps.error) {
      const { text, code } = error;
      const errorMsg = text;
      const errorCode = code;
      this.trackErrorAnalytics({ errorMsg, errorCode });
    }
  }

  onChange = (event) => {
    const checkboxStatus = event.target.checked;
    this.setState(
      () => ({
        checkboxStatus,
        validSection: checkboxStatus,
      }),
      () => this.props.validPaymentSection(this.state.validSection),
    );

    if (checkboxStatus) {
      const { cartData } = this.props;

      const gtmTrackObject = {
        productDetails: cartData ? cartData.get('lineItems') : List(),
        event: CHECKOUT_LABEL,
        listName: CHECKOUT_LABEL,
        step: TRACKING_STEPS_ENUM.STEP4,
        option: CHECKOUT_PAYMENT_DETAILS,
      };
      gtmTrackCheckoutImpressionDetails(gtmTrackObject);
    }
  };

  onNewsLetterSubscriptionChange = (event) => {
    this.newsletterSubscriptionCheckbox = event.target.checked;
    this.props.onNewsLetterSubscriptionChange(event.target.checked);
    this.trackCheckboxAnalytics(event.target.checked, newsletterSubscription);
  }

  onBillingFormCheckboxChange = (event) => {
    this.props.isBillingCheckboxChecked(event.target.checked, this.toggleShippingForm);
    this.trackCheckboxAnalytics(event.target.checked, billingForm);
  };

  trackCheckboxAnalytics = (isChecked, checkboxType) => {
    const gtmTrackObject = {
      eventName: CHECKBOX_LABEL,
      section: checkboxType === billingForm ?
        BILLING_ADDRESS_CHECKBOX : NEWSLETTER_SUBSCRIBE_CHECKBOX,
      subSection: CHECKOUT_LABEL,
      selection: isChecked ? BILLING_CHECKBOX_CHECK : BILLING_CHECKBOX_UNCHECK,
    };
    gtmTrackGlobalActions(gtmTrackObject);
  }

  trackErrorAnalytics = ({ errorMsg, errorCode }) => {
    const gtmTrackObject = {
      eventAction: errorMsg && errorCode ? `${errorCode}:${errorMsg}` : errorCode || errorMsg,
      referrer: '',
      eventCategory: 'payment submit failed',
    };

    gtmTrackErrorPageActions(gtmTrackObject);
  };

  paymentWidgitGetter = generatePaymentToken =>
    this.props.paymentWidgitConfigGetter(generatePaymentToken);

  handleKeyPress = (event, formType) => {
    if (event.which === ENTER_KEY || event.which === SPACE_KEY) {
      if (formType === billingForm && event.which === ENTER_KEY) {
        this.onBillingFormCheckboxChange(event);
      } else if (formType === termConditionForm) {
        this.onChange(event);
      } else if (formType === newsletterSubscription) {
        this.onNewsLetterSubscriptionChange(event);
      }
    }
  };

  toggleShippingForm = () => {
    this.setState({ billingFormCheckbox: !this.state.billingFormCheckbox }, () => {
      this.props.billingAddressOnChange(this.state.billingFormCheckbox);
    });
  };

  renderAgreementLabels = () => {
    const { checkoutLabels, cmsLabels, featureConfigs } = this.props;
    // mapping extracting and replacing values from the key
    let agreementText = checkoutLabels.get('termsAndconditionsMessage');

    agreementText = renderLinkLabels(agreementText, cmsLabels, featureConfigs, '_blank');

    const embedMessage = template => (
      /* eslint-disable-next-line */
      <div className="margin_left_10" dangerouslySetInnerHTML={{ __html: template }} />
    );
    return embedMessage(agreementText);
  };

  renderDeliveryAddressForm = () => {
    const {
      formFields,
      formLabels,
      formType,
      validateElement,
      isOpen,
      isActive,
      updateForm,
      validateField,
      slnId,
      countryCode,
      checkoutFormSubmit,
      stateData,
      cmsGlobalLabel,
      isValid,
    } = this.props;
    return (
      <DeliveryAddressForm
        formFields={formFields}
        formLabels={formLabels}
        formType={formType}
        validateElement={validateElement}
        isOpen={isOpen}
        isActive={isActive}
        isValid={isValid}
        updateForm={updateForm}
        validateField={validateField}
        slnId={`${slnId}`}
        countryCode={countryCode}
        checkoutFormSubmit={checkoutFormSubmit}
        stateData={stateData}
        cmsGlobalLabel={cmsGlobalLabel}
      />
    );
  }

  render(): Node {
    const {
      error,
      isOpen,
      className,
      checkoutLabels,
      paymentFailed,
      shippingMethod,
      slnId,
      invalidBillingAddress,
    } = this.props;
    const { checkboxStatus, validSection, billingFormCheckbox } = this.state;
    const showCheckbox = checkboxStatus && validSection;
    const termsAndconditionsMessage = this.renderAgreementLabels();
    const billingShippingAddressSameLabel = checkoutLabels.get('billingShippingAddressSameLabel');
    const monthlyNewsletterSubscription = checkoutLabels.get('monthlyNewsletterSubscription');
    const isFormOpen =
      !billingFormCheckbox ||
      (shippingMethod && shippingMethod.key === PICKUP_STORE_SHIPPING_KEY) ||
      invalidBillingAddress;
    const containerClass = classNames({
      'is-expanded': isFormOpen,
    });
    const billingClass = classNames(
      'billing-address',
      {
        'use-margin': billingFormCheckbox,
      },
    );

    return (
      <div className={className}>
        {error && <div className="payment-error">{error.text}</div>}
        <ArvatoPayment
          paymentWidgitGetter={this.paymentWidgitGetter}
          paymentFailed={paymentFailed}
        />
        <div className={billingClass}>
          <CheckBox
            onChecked={this.onBillingFormCheckboxChange}
            handleKeyPress={e => this.handleKeyPress(e, billingForm)}
            className="checkbox-section"
            id="billingAddressCheckbox"
            label={billingShippingAddressSameLabel}
            tabIndex={TABINDEX_ZERO}
            isChecked={billingFormCheckbox}
          />
        </div>
        {isOpen && (
          <div className={`collapsible-section billing-form-section ${containerClass}`}>
            {!billingFormCheckbox ? (
              this.renderDeliveryAddressForm()
                        ) : null}
            <div className="newsletter">
              <CheckBox
                onChecked={this.onNewsLetterSubscriptionChange}
                handleKeyPress={e => this.handleKeyPress(e, newsletterSubscription)}
                className="checkbox-section margin_left_10"
                isChecked={this.newsletterSubscriptionCheckbox}
                id="newsletterSubscription"
                label={monthlyNewsletterSubscription}
                tabIndex={TABINDEX_ZERO}
              />
            </div>
            {!showCheckbox && (
              <div className="terms-condition" data-sln-id={`${slnId}_termNCondContainer`}>
                <CheckBox
                  onChecked={this.onChange}
                  handleKeyPress={e => this.handleKeyPress(e, termConditionForm)}
                  className="checkbox-section"
                  isChecked={checkboxStatus}
                  id="termAndConditions"
                  label={termsAndconditionsMessage}
                  tabIndex={TABINDEX_ZERO}
                  slnId={`${slnId}_termNCond_checkbox`}
                />
              </div>
            )}
          </div>
        )}
        {showCheckbox && (
        <div className="terms-condition">
          <CheckBox
            onChecked={this.onChange}
            handleKeyPress={e => this.handleKeyPress(e, termConditionForm)}
            className="checkbox-section"
            isChecked={checkboxStatus}
            id="termAndConditions"
            label={termsAndconditionsMessage}
            tabIndex={TABINDEX_ZERO}
          />
        </div>
        )}
      </div>
    );
  }
}
PaymentForm.displayName = 'PaymentForm';

/* istanbul ignore next */
const mapStateToProps = state => ({
  paymentLoader: state.getIn(['CheckoutPage', 'paymentLoader']),
  paymentMethod: state.getIn(['CheckoutPage', 'paymentMethod']),
  error: state.getIn(['CheckoutPage', 'error']),
  cmsLabels: state.getIn(['global', 'cmsData', 'Global']),
  featureConfigs: state.getIn(['global', 'globalData', 'siteSettings', 'featureConfigs']),
  countryCode: state.getIn(['global', 'globalData', 'country']),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  hidePaymentLoader: () => dispatch(hidePaymentLoader()),
});

const PaymentFormErrorBoundary = withErrorBoundary(PaymentForm);

const PaymentFormStyles = withStyles(PaymentFormErrorBoundary, styles);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentFormStyles);

export { PaymentForm as PaymentFormVanilla };
