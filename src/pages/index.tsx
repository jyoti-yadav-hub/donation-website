import { authRouteConfig } from "./auth";
import { initialUrl } from "shared/constants/AppConst";
import Error403 from "./errorPages/Error403";
import React from "react";
import { dashBoardConfigs } from "./dashboards";
import { BlockedUserConfig, usersConfigs } from "./users";
// import { UserDetails } from "./users";
import { settingConfigs } from "./settings";
import { errorLogConfigs } from "./errorlogs";
import { foodrequestsConfigs } from "./foodrequests";
import { errorPagesConfigs } from "./errorPages";
import { extraPagesConfigs } from "./extraPages";
import { cmsConfigs } from "./cms";
import { homeCmsConfigs } from "./cms";
import { emailTempConfigs } from "./emailtemplates";
import { categoryConfigs } from "./category";
import { eventConfigs } from "./eventform";
import { foodListConfigs } from "./foodList";
import { DeletedNGOConfig, NGOListConfigs } from "./NGO";
import { NGODetails } from "./NGO";
import {
  AdminDonationListConfig,
  PaymentGatewayConfig,
  SaayamTransactionsConfig,
  TaxBenefitsConfig,
} from "./transactions";
import { FeaturedListConfig } from "./transactions";
import { DonationListConfig } from "./transactions";
import { NGODonationConfig } from "./NGO";
import { PlansConfig } from "./planslist";
import { BanksConfig } from "./manage-banks";
// import { GenericCauseDetailConfig } from './generic-cause'
import { ManageReqConfigs } from "./manage-requests";
import { ManageCountryCurrencyConfig } from "./manage-country-currency";
import { CausesDetailConfig } from "./manage-requests";
import { RaceListConfig } from "./Race-Religion";
import { ReligionListConfig } from "./Race-Religion";
import { DeleteAccFormConfig } from "./delete-account";
import { appsConfig } from "./apps";
import {
  EventReportsConfig,
  JudgeReportsConfig,
  ParticipantReportsConfig,
  AudienceReportsConfig,
  OrganizerReportsConfig,
} from "./report";
import { SchoolsConfig } from "./school-list";
import { HospitalsConfig } from "./hospital-list";
import { EmotionalConfig } from "./emotional-messages";
import { CourseConfig } from "./course-list";
import { DiseaseConfig } from "./disease-list";
import { commonSettingConfigs } from "./common-settings";
import { ImagesListsConfig } from "./images-list";
import { FooterStripConfig } from "./footer-strip";
import { UnverifiedSchoolHospital } from "./unverified-hospital-school";
import { BugReportsConfig } from "./bugreports";
import { CSVFilesConfig } from "./csvfiles";
import { TestimonialsConfig } from "./testimonials";
import { RegionsConfig } from "./regions";
import { FundsListConfigs } from "./funds";
import { LanguagesConfig } from "./languages";
import { BankListsConfig } from "./users-bank-list";
import { HelpRequestsConfig } from "./help-requests";
import { DriveTypesConfig } from "./drive-types";
import { DrivesListConfigs } from "./drive-lists";
import { AdminListsConfig } from "./admin-lists";
import { adminLogsConfigs } from "./adminlogs";
import { ShareMessageConfig } from "./sharemessage";
import { RequestAcceptConfig, RequestRejectConfig } from "./volunteers-form";
import { UserRolesConfig } from "./user-roles";
import {
  CorporateReqAcceptConfig,
  CorporateReqRejectConfig,
} from "./corporate-form";
import { FAQConfig } from "./faq";
import { JobTitleConfig } from "./job-title";
import { CorporateTypesConfig } from "./corporate-types";
import { MarkScoreConfig } from "./marks-score";
import { AvRequirementsConfig } from "./av-requirements";
import { AwardsPricesConfig } from "./awards-prices";
import { JudgementCriteriaConfig } from "./judgement-criteria";
import { TermsConditionsConfig } from "./terms-conditions";
import { RulesRegulationConfig } from "./rules-regulation";
import { LevelsConfig } from "./levels";
import { subCategoryConfig } from "./sub-category";
import { PrivacyPolicyConfig } from "./privacy-policy";
import { TimeZoneConfig } from "./time-zone";
import { DefaultOtpConfig } from "./default-otp";
import { EventsConfig } from "./events";

const authorizedStructure = {
  fallbackPath: "/signin",
  unAuthorizedComponent: <Error403 />,
  routes: [
    ...dashBoardConfigs,
    ...usersConfigs,
    ...BlockedUserConfig,
    // ...UserDetails,
    ...settingConfigs,
    ...commonSettingConfigs,
    ...cmsConfigs,
    ...homeCmsConfigs,
    ...emailTempConfigs,
    ...categoryConfigs,
    ...eventConfigs,
    ...subCategoryConfig,
    ...errorLogConfigs,
    ...foodrequestsConfigs,
    ...foodListConfigs,
    ...NGOListConfigs,
    ...AdminDonationListConfig,
    ...FeaturedListConfig,
    ...SaayamTransactionsConfig,
    ...DonationListConfig,
    ...NGODonationConfig,
    ...PlansConfig,
    ...EventReportsConfig,
    ...JudgeReportsConfig,
    ...ParticipantReportsConfig,
    ...BanksConfig,
    // ...GenericCauseDetailConfig,
    ...ManageCountryCurrencyConfig,
    ...ManageReqConfigs,
    ...CausesDetailConfig,
    ...NGODetails,
    ...DeletedNGOConfig,
    ...appsConfig,
    ...extraPagesConfigs,
    ...RaceListConfig,
    ...ReligionListConfig,
    ...DeleteAccFormConfig,
    ...SchoolsConfig,
    ...HospitalsConfig,
    ...EmotionalConfig,
    ...CourseConfig,
    ...DiseaseConfig,
    ...PaymentGatewayConfig,
    ...TaxBenefitsConfig,
    ...ImagesListsConfig,
    ...FooterStripConfig,
    ...UnverifiedSchoolHospital,
    ...BugReportsConfig,
    ...CSVFilesConfig,
    ...TestimonialsConfig,
    ...RegionsConfig,
    ...FundsListConfigs,
    ...LanguagesConfig,
    ...BankListsConfig,
    ...HelpRequestsConfig,
    ...DriveTypesConfig,
    ...DrivesListConfigs,
    ...AdminListsConfig,
    ...adminLogsConfigs,
    ...ShareMessageConfig,
    ...RequestAcceptConfig,
    ...RequestRejectConfig,
    ...UserRolesConfig,
    ...CorporateReqAcceptConfig,
    ...CorporateReqRejectConfig,
    ...FAQConfig,
    ...JobTitleConfig,
    ...CorporateTypesConfig,
    ...MarkScoreConfig,
    ...AvRequirementsConfig,
    ...AwardsPricesConfig,
    ...JudgementCriteriaConfig,
    ...TermsConditionsConfig,
    ...RulesRegulationConfig,
    ...LevelsConfig,
    ...PrivacyPolicyConfig,
    ...TimeZoneConfig,
    ...DefaultOtpConfig,
    ...EventsConfig,
    ...AudienceReportsConfig,
    ...OrganizerReportsConfig,
  ],
};

const unAuthorizedStructure = {
  fallbackPath: initialUrl,
  routes: authRouteConfig,
};

const anonymousStructure = {
  routes: errorPagesConfigs,
};

export { authorizedStructure, unAuthorizedStructure, anonymousStructure };
