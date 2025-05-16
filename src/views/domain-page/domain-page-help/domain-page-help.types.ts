import { type DomainPageHelpItem } from '../domain-page-help-item-button/domain-page-help-item-button.types';

export type DomainPageHelpGroup = {
  title: string;
  items: Array<DomainPageHelpItem>;
};

export type DomainPageHelpMenuConfig = Array<DomainPageHelpGroup>;
