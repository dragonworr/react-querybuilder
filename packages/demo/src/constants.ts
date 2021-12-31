import { lazy } from 'react';
import { generateID } from 'react-querybuilder';
import type {
  ExportFormat,
  Field,
  QueryBuilderProps,
  RuleGroupType,
  RuleGroupTypeIC,
  RuleType,
} from 'react-querybuilder/src/types';
import { musicalInstruments } from './musicalInstruments';

const AntDActionElement = lazy(() => import('./components/AntDActionElement'));
const AntDDragHandle = lazy(() => import('./components/AntDDragHandle'));
const AntDNotToggle = lazy(() => import('./components/AntDNotToggle'));
const AntDValueEditor = lazy(() => import('./components/AntDValueEditor'));
const AntDValueSelector = lazy(() => import('./components/AntDValueSelector'));
const BootstrapDragHandle = lazy(() => import('./components/BootstrapDragHandle'));
const BootstrapNotToggle = lazy(() => import('./components/BootstrapNotToggle'));
const BootstrapValueEditor = lazy(() => import('./components/BootstrapValueEditor'));
const BulmaActionElement = lazy(() => import('./components/BulmaActionElement'));
const BulmaNotToggle = lazy(() => import('./components/BulmaNotToggle'));
const BulmaValueEditor = lazy(() => import('./components/BulmaValueEditor'));
const BulmaValueSelector = lazy(() => import('./components/BulmaValueSelector'));
const ChakraActionElement = lazy(() => import('./components/ChakraActionElement'));
const ChakraDragHandle = lazy(() => import('./components/ChakraDragHandle'));
const ChakraNotToggle = lazy(() => import('./components/ChakraNotToggle'));
const ChakraValueEditor = lazy(() => import('./components/ChakraValueEditor'));
const ChakraValueSelector = lazy(() => import('./components/ChakraValueSelector'));
const MaterialActionElement = lazy(() => import('./components/MaterialActionElement'));
const MaterialDragHandle = lazy(() => import('./components/MaterialDragHandle'));
const MaterialNotToggle = lazy(() => import('./components/MaterialNotToggle'));
const MaterialValueEditor = lazy(() => import('./components/MaterialValueEditor'));
const MaterialValueSelector = lazy(() => import('./components/MaterialValueSelector'));

export type StyleName = 'default' | 'bootstrap' | 'antd' | 'material' | 'chakra' | 'bulma';

export interface DemoOptions {
  showCombinatorsBetweenRules: boolean;
  showNotToggle: boolean;
  showCloneButtons: boolean;
  resetOnFieldChange: boolean;
  resetOnOperatorChange: boolean;
  autoSelectField: boolean;
  addRuleToNewGroups: boolean;
  validateQuery: boolean;
  independentCombinators: boolean;
  enableDragAndDrop: boolean;
  disabled: boolean;
}

export const npmLink = 'https://www.npmjs.com/package/react-querybuilder';
export const docsLink = 'https://react-querybuilder.js.org';

export const validator = (r: RuleType) => !!r.value;

export const defaultOptions: DemoOptions = {
  showCombinatorsBetweenRules: false,
  showNotToggle: false,
  showCloneButtons: false,
  resetOnFieldChange: true,
  resetOnOperatorChange: false,
  autoSelectField: true,
  addRuleToNewGroups: false,
  validateQuery: false,
  independentCombinators: false,
  enableDragAndDrop: false,
  disabled: false,
};

export const optionsMetadata: Record<
  keyof DemoOptions,
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
};

export const styleNameMap: Record<StyleName, string> = {
  default: 'Default',
  bootstrap: 'Bootstrap',
  material: 'Material',
  antd: 'Ant Design',
  chakra: 'Chakra UI',
  bulma: 'Bulma',
};

export const styleConfigs: Record<StyleName, QueryBuilderProps> = {
  default: {},
  bootstrap: {
    controlClassnames: {
      addGroup: 'btn btn-secondary btn-sm',
      addRule: 'btn btn-primary btn-sm',
      cloneGroup: 'btn btn-secondary btn-sm',
      cloneRule: 'btn btn-secondary btn-sm',
      removeGroup: 'btn btn-danger btn-sm',
      removeRule: 'btn btn-danger btn-sm',
      combinators: 'form-select form-select-sm',
      fields: 'form-select form-select-sm',
      operators: 'form-select form-select-sm',
      value: 'form-control form-control-sm',
    },
    controlElements: {
      dragHandle: BootstrapDragHandle,
      notToggle: BootstrapNotToggle,
      valueEditor: BootstrapValueEditor,
    },
  },
  antd: {
    controlElements: {
      addGroupAction: AntDActionElement,
      addRuleAction: AntDActionElement,
      cloneGroupAction: AntDActionElement,
      cloneRuleAction: AntDActionElement,
      combinatorSelector: AntDValueSelector,
      fieldSelector: AntDValueSelector,
      notToggle: AntDNotToggle,
      operatorSelector: AntDValueSelector,
      removeGroupAction: AntDActionElement,
      removeRuleAction: AntDActionElement,
      valueEditor: AntDValueEditor,
      dragHandle: AntDDragHandle,
    },
  },
  material: {
    controlElements: {
      addGroupAction: MaterialActionElement,
      addRuleAction: MaterialActionElement,
      cloneGroupAction: MaterialActionElement,
      cloneRuleAction: MaterialActionElement,
      combinatorSelector: MaterialValueSelector,
      fieldSelector: MaterialValueSelector,
      notToggle: MaterialNotToggle,
      operatorSelector: MaterialValueSelector,
      removeGroupAction: MaterialActionElement,
      removeRuleAction: MaterialActionElement,
      valueEditor: MaterialValueEditor,
      dragHandle: MaterialDragHandle,
    },
  },
  chakra: {
    controlElements: {
      addGroupAction: ChakraActionElement,
      addRuleAction: ChakraActionElement,
      cloneGroupAction: ChakraActionElement,
      cloneRuleAction: ChakraActionElement,
      combinatorSelector: ChakraValueSelector,
      fieldSelector: ChakraValueSelector,
      notToggle: ChakraNotToggle,
      operatorSelector: ChakraValueSelector,
      removeGroupAction: ChakraActionElement,
      removeRuleAction: ChakraActionElement,
      valueEditor: ChakraValueEditor,
      dragHandle: ChakraDragHandle,
    },
  },
  bulma: {
    controlElements: {
      addGroupAction: BulmaActionElement,
      addRuleAction: BulmaActionElement,
      cloneGroupAction: BulmaActionElement,
      cloneRuleAction: BulmaActionElement,
      combinatorSelector: BulmaValueSelector,
      fieldSelector: BulmaValueSelector,
      notToggle: BulmaNotToggle,
      operatorSelector: BulmaValueSelector,
      removeGroupAction: BulmaActionElement,
      removeRuleAction: BulmaActionElement,
      valueEditor: BulmaValueEditor,
    },
  },
};

export const fields: Field[] = [
  { name: 'firstName', label: 'First Name', placeholder: 'Enter first name', validator },
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
  ],
};

export const initialQueryIC: RuleGroupTypeIC = {
  not: false,
  rules: [
    {
      id: generateID(),
      field: 'firstName',
      value: 'Stev',
      operator: 'beginsWith',
    },
    'and',
    {
      id: generateID(),
      field: 'lastName',
      value: 'Vai, Vaughan',
      operator: 'in',
    },
    'and',
    {
      id: generateID(),
      field: 'age',
      operator: '>',
      value: '28',
    },
    'and',
    {
      id: generateID(),
      rules: [
        {
          id: generateID(),
          field: 'isMusician',
          operator: '=',
          value: true,
        },
        'or',
        {
          id: generateID(),
          field: 'instrument',
          operator: '=',
          value: 'Guitar',
        },
      ],
    },
  ],
};

export const formatMap: { fmt: ExportFormat; lbl: string }[] = [
  { fmt: 'json_without_ids', lbl: 'JSON without identifiers' },
  { fmt: 'json', lbl: 'JSON' },
  { fmt: 'sql', lbl: 'SQL' },
  { fmt: 'parameterized', lbl: 'Parameterized SQL' },
  { fmt: 'parameterized_named', lbl: 'Parameterized (named) SQL' },
  { fmt: 'mongodb', lbl: 'MongoDB' },
];
