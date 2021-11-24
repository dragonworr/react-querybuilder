import type {
  ExportFormat,
  Field,
  QueryBuilderProps,
  RuleGroupType,
  RuleGroupTypeIC,
  RuleType
} from 'react-querybuilder/src/types';
import {
  AntDActionElement,
  AntDDragHandle,
  AntDNotToggle,
  AntDValueEditor,
  AntDValueSelector
} from '@react-querybuilder/antd';
import {
  BootstrapDragHandle,
  BootstrapNotToggle,
  BootstrapValueEditor
} from '@react-querybuilder/bootstrap';
import {
  ChakraActionElement,
  ChakraDragHandle,
  ChakraNotToggle,
  ChakraValueEditor,
  ChakraValueSelector
} from '@react-querybuilder/chakra';
import {
  MaterialActionElement,
  MaterialDragHandle,
  MaterialNotToggle,
  MaterialValueEditor,
  MaterialValueSelector
} from '@react-querybuilder/material';
import { generateID } from 'react-querybuilder';

export type StyleName = 'default' | 'bootstrap' | 'antd' | 'material' | 'chakra';

export const npmLink = 'https://www.npmjs.com/package/react-querybuilder';
export const docsLink = 'https://react-querybuilder.js.org';

export const validator = (r: RuleType) => !!r.value;

export const styleOptions: { [s in StyleName]: QueryBuilderProps } = {
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
      value: 'form-control form-control-sm'
    },
    controlElements: {
      dragHandle: BootstrapDragHandle,
      notToggle: BootstrapNotToggle,
      valueEditor: BootstrapValueEditor
    }
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
      dragHandle: AntDDragHandle
    }
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
      dragHandle: MaterialDragHandle
    }
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
      dragHandle: ChakraDragHandle
    }
  }
};

export const fields: Field[] = [
  { name: 'firstName', label: 'First Name', placeholder: 'Enter first name', validator },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    defaultOperator: 'beginsWith',
    validator
  },
  { name: 'age', label: 'Age', inputType: 'number', validator },
  {
    name: 'isMusician',
    label: 'Is a musician',
    valueEditorType: 'checkbox',
    operators: [{ name: '=', label: 'is' }],
    defaultValue: false
  },
  {
    name: 'instrument',
    label: 'Instrument',
    valueEditorType: 'select',
    values: [
      { name: 'Guitar', label: 'Guitar' },
      { name: 'Piano', label: 'Piano' },
      { name: 'Vocals', label: 'Vocals' },
      { name: 'Drums', label: 'Drums' }
    ],
    defaultValue: 'Piano',
    operators: [{ name: '=', label: 'is' }]
  },
  {
    name: 'gender',
    label: 'Gender',
    operators: [{ name: '=', label: 'is' }],
    valueEditorType: 'radio',
    values: [
      { name: 'M', label: 'Male' },
      { name: 'F', label: 'Female' },
      { name: 'O', label: 'Other' }
    ]
  },
  { name: 'height', label: 'Height', validator },
  { name: 'job', label: 'Job', validator }
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
      operator: 'beginsWith'
    },
    {
      id: generateID(),
      field: 'lastName',
      value: 'Vai, Vaughan',
      operator: 'in'
    },
    {
      id: generateID(),
      field: 'age',
      operator: '>',
      value: '28'
    },
    {
      id: generateID(),
      combinator: 'or',
      rules: [
        {
          id: generateID(),
          field: 'isMusician',
          operator: '=',
          value: true
        },
        {
          id: generateID(),
          field: 'instrument',
          operator: '=',
          value: 'Guitar'
        }
      ]
    }
  ]
};

export const initialQueryIC: RuleGroupTypeIC = {
  not: false,
  rules: [
    {
      id: generateID(),
      field: 'firstName',
      value: 'Stev',
      operator: 'beginsWith'
    },
    'and',
    {
      id: generateID(),
      field: 'lastName',
      value: 'Vai, Vaughan',
      operator: 'in'
    },
    'and',
    {
      id: generateID(),
      field: 'age',
      operator: '>',
      value: '28'
    },
    'and',
    {
      id: generateID(),
      rules: [
        {
          id: generateID(),
          field: 'isMusician',
          operator: '=',
          value: true
        },
        'or',
        {
          id: generateID(),
          field: 'instrument',
          operator: '=',
          value: 'Guitar'
        }
      ]
    }
  ]
};

export const formatMap: { fmt: ExportFormat; lbl: string }[] = [
  { fmt: 'json_without_ids', lbl: 'JSON without identifiers' },
  { fmt: 'json', lbl: 'JSON' },
  { fmt: 'sql', lbl: 'SQL' },
  { fmt: 'parameterized', lbl: 'Parameterized SQL' },
  { fmt: 'parameterized_named', lbl: 'Parameterized (named) SQL' },
  { fmt: 'mongodb', lbl: 'MongoDB' }
];
