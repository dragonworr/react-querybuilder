import {
  convertToIC,
  type ExportFormat,
  type Field,
  type RuleGroupType,
  type RuleType,
} from '../src';
import { generateID } from '../src/internal';
import { musicalInstruments } from './musicalInstruments';
import type { DemoOption, DemoOptions } from './types';

export const validator = (r: RuleType) => !!r.value;

export const defaultOptions: DemoOptions = {
  showCombinatorsBetweenRules: false,
  showNotToggle: false,
  showCloneButtons: false,
  showLockButtons: false,
  resetOnFieldChange: true,
  resetOnOperatorChange: false,
  autoSelectField: true,
  autoSelectOperator: true,
  addRuleToNewGroups: false,
  validateQuery: false,
  independentCombinators: false,
  enableDragAndDrop: false,
  disabled: false,
  debugMode: false,
  parseNumbers: false,
};

export const optionOrder: DemoOption[] = [
  'showCombinatorsBetweenRules',
  'showNotToggle',
  'showCloneButtons',
  'showLockButtons',
  'resetOnFieldChange',
  'resetOnOperatorChange',
  'autoSelectField',
  'autoSelectOperator',
  'addRuleToNewGroups',
  'validateQuery',
  'independentCombinators',
  'enableDragAndDrop',
  'disabled',
  'debugMode',
  'parseNumbers',
];

export const optionsMetadata: Record<
  DemoOption,
  {
    link: string;
    label: string;
    title: string;
  }
> = {
  showCombinatorsBetweenRules: {
    link: '/docs/api/querybuilder#showcombinatorsbetweenrules',
    label: 'Combinators between rules',
    title: 'Display combinator (and/or) selectors between rules instead of in the group header',
  },
  showNotToggle: {
    link: '/docs/api/querybuilder#shownottoggle',
    label: 'Show "not" toggle',
    title: `Display a checkbox to invert a group's rules (labelled "Not" by default)`,
  },
  showCloneButtons: {
    link: '/docs/api/querybuilder#showclonebuttons',
    label: 'Show clone buttons',
    title: 'Display buttons to clone rules and groups',
  },
  resetOnFieldChange: {
    link: '/docs/api/querybuilder#resetonfieldchange',
    label: 'Reset on field change',
    title: `Operator and value will be reset when a rule's field selection changes`,
  },
  resetOnOperatorChange: {
    link: '/docs/api/querybuilder#resetonoperatorchange',
    label: 'Reset on operator change',
    title: 'The value will reset when the operator changes',
  },
  autoSelectField: {
    link: '/docs/api/querybuilder#autoselectfield',
    label: 'Auto-select field',
    title: 'The default field will be automatically selected for new rules',
  },
  autoSelectOperator: {
    link: '/docs/api/querybuilder#autoselectoperator',
    label: 'Auto-select operator',
    title: 'The default operator will be automatically selected for new rules',
  },
  addRuleToNewGroups: {
    link: '/docs/api/querybuilder#addruletonewgroups',
    label: 'Add rule to new groups',
    title: 'A rule will be automatically added to new groups',
  },
  validateQuery: {
    link: '/docs/api/validation',
    label: 'Use validation',
    title:
      'The validator function(s) will be used to put a purple outline around empty text fields and bold the "+Rule" button for empty groups',
  },
  independentCombinators: {
    link: '/docs/api/querybuilder#independentcombinators',
    label: 'Independent combinators',
    title: 'Combinators between rules can be independently updated',
  },
  enableDragAndDrop: {
    link: '/docs/api/querybuilder#enabledraganddrop',
    label: 'Enable drag-and-drop',
    title: 'Rules and groups can be reordered and dragged to different groups',
  },
  disabled: {
    link: '/docs/api/querybuilder#disabled',
    label: 'Disabled',
    title: 'Disable all components within the query builder',
  },
  showLockButtons: {
    link: '/docs/api/querybuilder#showlockbuttons',
    label: 'Show lock buttons',
    title: 'Display buttons to lock/disable rules and groups',
  },
  debugMode: {
    link: '/docs/api/querybuilder#debugMode',
    label: 'Debug mode',
    title: 'Enable debug logging for QueryBuilder and React DnD',
  },
  parseNumbers: {
    link: '/docs/api/export#parsing-numbers',
    label: 'Parse numbers',
    title: 'Parse real numbers from strings in rule values',
  },
};

export const fields: Field[] = [
  {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    validator,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    defaultOperator: 'beginsWith',
    validator,
  },
  { name: 'age', label: 'Age', inputType: 'number', validator },
  {
    name: 'isMusician',
    label: 'Is a musician',
    valueEditorType: 'checkbox',
    operators: [{ name: '=', label: 'is' }],
    defaultValue: false,
  },
  {
    name: 'instrument',
    label: 'Instrument',
    valueEditorType: 'select',
    values: musicalInstruments,
    defaultValue: 'Piano',
    operators: [{ name: '=', label: 'is' }],
  },
  {
    name: 'gender',
    label: 'Gender',
    operators: [{ name: '=', label: 'is' }],
    valueEditorType: 'radio',
    values: [
      { name: 'M', label: 'Male' },
      { name: 'F', label: 'Female' },
      { name: 'O', label: 'Other' },
    ],
  },
  { name: 'height', label: 'Height', validator },
  { name: 'job', label: 'Job', validator },
  { name: 'description', label: 'Description', valueEditorType: 'textarea' },
  { name: 'birthdate', label: 'Birth Date', inputType: 'date' },
  { name: 'datetime', label: 'Show Time', inputType: 'datetime-local' },
  { name: 'alarm', label: 'Daily Alarm', inputType: 'time' },
  {
    name: 'groupedField1',
    label: 'Grouped Field 1',
    comparator: 'group',
    group: 'group1',
    valueSources: ['field', 'value'],
  },
  {
    name: 'groupedField2',
    label: 'Grouped Field 2',
    comparator: 'group',
    group: 'group1',
    valueSources: ['field', 'value'],
  },
  {
    name: 'groupedField3',
    label: 'Grouped Field 3',
    comparator: 'group',
    group: 'group1',
    valueSources: ['field', 'value'],
  },
  {
    name: 'groupedField4',
    label: 'Grouped Field 4',
    comparator: 'group',
    group: 'group1',
    valueSources: ['field', 'value'],
  },
];

export const initialQuery: RuleGroupType = {
  id: generateID(),
  combinator: 'and',
  not: false,
  rules: [
    {
      id: generateID(),
      field: 'firstName',
      value: 'Stev',
      operator: 'beginsWith',
    },
    {
      id: generateID(),
      field: 'lastName',
      value: 'Vai, Vaughan',
      operator: 'in',
    },
    {
      id: generateID(),
      field: 'age',
      operator: '>',
      value: '28',
    },
    {
      id: generateID(),
      combinator: 'or',
      rules: [
        {
          id: generateID(),
          field: 'isMusician',
          operator: '=',
          value: true,
        },
        {
          id: generateID(),
          field: 'instrument',
          operator: '=',
          value: 'Guitar',
        },
      ],
    },
    { field: 'groupedField1', operator: '=', value: 'groupedField4', valueSource: 'field' },
  ],
};

export const initialQueryIC = convertToIC(initialQuery);

export const formatMap: [ExportFormat, string][] = [
  ['sql', 'SQL'],
  ['parameterized', 'SQL (parameterized)'],
  ['parameterized_named', 'SQL (named parameters)'],
  ['json_without_ids', 'JSON (no identifiers)'],
  ['json', 'JSON'],
  ['mongodb', 'MongoDB'],
  ['cel', 'Common Expression Language (CEL)'],
];
