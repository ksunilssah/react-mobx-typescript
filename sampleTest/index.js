/**
 *
 * CampaignDefaultView
 *
 */
// @flow
import { PureComponent } from 'react';
import { Map, fromJS } from 'immutable';
import type { Node } from 'react';
import type { Props } from './types';
import {
  gtmDefaultTrackPageLoad,
  addToDatalayer,
  gtmTrackFormActions
} from '../../../../../utils/analytics';
import {
  CLICK,
  FORM_START_LABEL,
  CAMPAIGN,
  CAMPAIGN_FORM
} from '../../../../../utils/analytics/constants';

import styles from './CampaignDefaultView.style';
import withStyles from './../../../../../lib/withStyles';

import ResponsiveImage from './../../../../common/organisms/ResponsiveImage';
import FormGenerator from './../../../../common/organisms/FormGenerator';

// @TODO: Move this to common components
import TitleWithText from './../../../Vouchers/molecules/TitleWithText';
import { getCookie } from '../../../../../utils/utils';

class CampaignDefaultView extends PureComponent<Props> {
  static defaultProps = {
    pageData: Map()
  };

  componentDidMount() {
    const { pageData } = this.props;
    const slug = pageData.get('slug');

    const initialPageData = gtmDefaultTrackPageLoad({
      pageType: `${CAMPAIGN}:${slug}`,
      pageName: CAMPAIGN_FORM
    });
    addToDatalayer(initialPageData);
  }

  formSubmitHandler = (formFields: Array) => {
    const { submitCampaignForm, pageData, locale } = this.props;
    const slug = pageData.get('slug');
    const country = getCookie('country');

    // analytics
    const campaignConfig = {
      event: CLICK,
      eventCategory: `${CAMPAIGN}:${slug}`,
      eventAction: FORM_START_LABEL,
      eventLabel: formFields.country || country
    };
    const updatedFormFields = {
      ...formFields,
      defaultLocale: locale,
      defaultCountry: country
    };
    gtmTrackFormActions(campaignConfig);
    submitCampaignForm(updatedFormFields);
  };

  render(): Node {
    const { pageData, className } = this.props;

    const slnId = 'atm_Campaign';
    const slug = pageData.get('slug');

    const titleTextProps = fromJS({
      pageTitle: pageData.get('title'),
      shortDescription: pageData.get('subTitle'),
      shortDescription2: pageData.get('subTitle2')
    });

    const mediaObject = pageData.getIn(['hero', 'backgroundImage', 'media']);
    const posterImageUrl = mediaObject.get('defaultUrl');
    const altText = mediaObject.get('altText');

    const formFields = pageData.get('formFields');
    const campaignId = pageData.get('id');

    const autoSuggestProps = {
      useDefault: true,
      useIcon: true,
      noUpdate: true,
      fullWidth: true,
      useValue: true,
      disableUrlUpdate: true,
      restrictCountry: true
    };

    const buttonProps = {
      isButton: true,
      variant: 'send',
      className: 'button',
      slnId: `${slnId}_${campaignId}_submit_button`,
      labelText: pageData.get('submitButtonText'),
      type: 'submit',
      wrapperClass: 'button-wrapper'
    };

    const namedProps = {
      language: {
        isPreFilledDropdown: true
      }
    };

    return (
      <div className={`${className} dafault-view`}>
        <ResponsiveImage
          size={ResponsiveImage.SIZES.LARGE}
          src={posterImageUrl}
          alt={altText}
          slnId={`${slnId}_hero_image`}
          inheritedClass="image-container"
          ratio={[11, 4]}
          noDefaultClass
          noImgSize
        />
        <div className="form-container container">
          <div className="row">
            <div className="form-wrapper col-md-offset-3 col-md-6 col-xs-12">
              <div className="form-description">
                <TitleWithText data={titleTextProps} />
              </div>
            </div>
          </div>
          <div className="row">
            <FormGenerator
              slnId={slnId}
              formFields={formFields}
              formSubmitHandler={this.formSubmitHandler}
              formName={campaignId}
              formType="campaign-form"
              autoSuggestProps={autoSuggestProps}
              namedProps={namedProps}
              buttonProps={buttonProps}
              key={slug}
              disableInputFocusOnLoad
              formClass="col-md-offset-3 col-md-6 col-xs-12"
            />
          </div>
        </div>
      </div>
    );
  }
}

CampaignDefaultView.displayName = 'CampaignDefaultView';

export default withStyles(CampaignDefaultView, styles);
export { CampaignDefaultView as CampaignDefaultViewVanilla };
