import type { FormatQueryOptions, RuleGroupTypeAny } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';
import { defaultOptions, optionOrder } from './_constants';
import type { DemoOption, DemoOptions, DemoOptionsHash } from './_types';

type OptionsAction =
  | { type: 'all' }
  | { type: 'reset' }
  | {
      type: 'update';
      payload: {
        optionName: DemoOption;
        value: boolean;
      };
    }
  | {
      type: 'replace';
      payload: DemoOptions;
    };

export const getOptionsFromHash = (hash: DemoOptionsHash): Partial<DemoOptions> =>
  Object.fromEntries(Object.entries(hash).map(([opt, val]) => [opt, val === 'true']));

export const optionsReducer = (state: DemoOptions, action: OptionsAction): DemoOptions => {
  if (action.type === 'reset') {
    return defaultOptions;
  } else if (action.type === 'all') {
    const allSelected: DemoOptions = { ...defaultOptions };
    for (const opt of optionOrder) {
      allSelected[opt] = opt !== 'disabled';
    }
    return allSelected;
  } else if (action.type === 'replace') {
    return action.payload;
  }
  const { optionName, value } = action.payload;
  return { ...state, [optionName]: value };
};

export const getFormatQueryString = (query: RuleGroupTypeAny, options: FormatQueryOptions) => {
  const formatQueryResult = formatQuery(query, options);
  if (options.format === 'json_without_ids' || options.format === 'mongodb') {
    return JSON.stringify(JSON.parse(formatQueryResult), null, 2);
  } else if (
    options.format === 'parameterized' ||
    options.format === 'parameterized_named' ||
    options.format === 'jsonlogic'
  ) {
    return JSON.stringify(formatQueryResult, null, 2);
  }
  return formatQueryResult;
};
