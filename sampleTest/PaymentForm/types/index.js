// @flow
import { Map } from 'immutable';

export type Props = {
  hidePaymentLoader: Function,
  error: Object,
  cartData: Map,
  validPaymentSection: Function,
  formFields: Object,
  formLabels: Object,
  formType: string,
  validateElement: Function,
  className: string,
  isOpen: boolean,
  isActive: boolean,
  isValid: boolean,
  checkoutLabels: Map,
  shippingPlaceHolder: string,
  paymentFailed: string,
  shippingMethod: Object,
  updateForm: Function,
  validateField: Function,
  slnId: string,
  invalidBillingAddress: boolean,
  cmsLabels: Map,
  featureConfigs: Array,
  paymentWidgitConfigGetter: Function,
};
export type State = {};
