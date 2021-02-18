import { mount, shallow } from 'enzyme';
import { ActionElement, ValueEditor, ValueSelector } from '../controls/index';
import { Rule } from '../Rule';
import { OperatorSelectorProps } from '../types';

describe('<Rule />', () => {
  let controls, classNames, schema, props;
  beforeEach(() => {
    //set defaults
    controls = {
      fieldSelector: (props) => (
        <select onChange={(e) => props.handleOnChange(e.target.value)}>
          <option value="field">Field</option>
          <option value="any_field">Any Field</option>
        </select>
      ),
      operatorSelector: (props) => (
        <select onChange={(e) => props.handleOnChange(e.target.value)}>
          <option value="operator">Operator</option>
          <option value="any_operator">Any Operator</option>
        </select>
      ),
      valueEditor: (props) => (
        <input type="text" onChange={(e) => props.handleOnChange(e.target.value)} />
      ),
      removeRuleAction: (props) => <button onClick={(e) => props.handleOnClick(e)}>x</button>
    };
    classNames = {
      fields: 'custom-fields-class',
      operators: 'custom-operators-class',
      removeRule: 'custom-removeRule-class'
    };
    schema = {
      fields: [
        { name: 'field1', label: 'Field 1' },
        { name: 'field2', label: 'Field 2' }
      ],
      controls: controls,
      classNames: classNames,
      getOperators: (field) => [
        { name: '=', value: 'is' },
        { name: '!=', value: 'is not' }
      ],
      getValueEditorType: (field, operator) => 'text',
      getInputType: (field, operator) => 'text',
      getValues: (field, operator) => [
        { name: 'one', label: 'One' },
        { name: 'two', label: 'Two' }
      ],
      onPropChange: (field, value, id) => {},
      onRuleRemove: (ruleId, parentId) => {},
      getLevel: () => 0
    };
    props = {
      key: 'key',
      id: 'id',
      field: 'field',
      value: 'value',
      operator: 'operator',
      schema: schema,
      parentId: 'parentId',
      translations: {
        fields: {
          title: 'Fields'
        },
        operators: {
          title: 'Operators'
        },
        value: {
          title: 'Value'
        },
        removeRule: {
          label: 'x',
          title: 'Remove rule'
        },
        removeGroup: {
          label: 'x',
          title: 'Remove group'
        },
        addRule: {
          label: '+Rule',
          title: 'Add rule'
        },
        addGroup: {
          label: '+Group',
          title: 'Add group'
        },
        combinators: {
          title: 'Combinators'
        }
      }
    };
  });

  it('should exist', () => {
    expect(Rule).toBeDefined();
  });

  it('should have a className of "rule"', () => {
    const dom = shallow(<Rule {...props} />);

    expect(dom.find('div').hasClass('rule')).toBe(true);
  });

  describe('field selector as <ValueSelector />', () => {
    beforeEach(() => {
      controls.fieldSelector = ValueSelector;
    });

    it('should have options set to expected fields', () => {
      const expected_fields = [
        { name: 'firstName', label: 'First Label' },
        { name: 'secondName', label: 'Second Label' }
      ];
      schema.fields = expected_fields;
      const dom = shallow(<Rule {...props} />);

      expect(dom.find(ValueSelector).props().options).toEqual(expected_fields);
    });

    behavesLikeASelector('field', 'rule-fields', 'custom-fields-class');
  });

  describe('operator selector as <ValueSelector />', () => {
    beforeEach(() => {
      controls.operatorSelector = ValueSelector;
    });

    it('should have options set to fields returned from "getOperators"', () => {
      const expected_operators = [
        { name: '=', label: '=' },
        { name: '!=', label: '!=' }
      ];
      schema.getOperators = (field) => {
        return expected_operators;
      };
      const dom = shallow(<Rule {...props} />);

      expect(dom.find(ValueSelector).props().options).toEqual(expected_operators);
    });

    it('should have field set to selected field', () => {
      props.field = 'selected_field';
      const dom = shallow(<Rule {...props} />);

      expect((dom.find(ValueSelector).props() as OperatorSelectorProps).field).toBe(
        'selected_field'
      );
    });

    behavesLikeASelector('operator', 'rule-operators', 'custom-operators-class');
  });

  describe('value editor as <ValueEditor />', () => {
    beforeEach(() => {
      controls.valueEditor = ValueEditor;
    });

    it('should have field set to selected field', () => {
      props.field = 'selected_field';
      const dom = shallow(<Rule {...props} />);

      expect(dom.find(ValueEditor).props().field).toBe('selected_field');
    });

    it('should have fieldData set to selected field data', () => {
      props.field = 'field1';
      const dom = shallow(<Rule {...props} />);

      expect(dom.find(ValueEditor).props().fieldData.name).toBe('field1');
      expect(dom.find(ValueEditor).props().fieldData.label).toBe('Field 1');
    });

    it('should have operator set to selected operator', () => {
      props.operator = 'selected_operator';
      const dom = shallow(<Rule {...props} />);

      expect(dom.find('ValueEditor').props().operator).toBe('selected_operator');
    });

    it('should have value set to specified value', () => {
      props.value = 'specified_value';
      const dom = shallow(<Rule {...props} />);

      expect(dom.find('ValueEditor').props().value).toBe('specified_value');
    });

    it('should have the onChange method handler', () => {
      const dom = shallow(<Rule {...props} />);

      expect(typeof dom.find(ValueEditor).props().handleOnChange).toBe('function');
    });

    it('should trigger change handler', () => {
      const mockEvent = { target: { value: 'foo' } };
      let onChange = jest.fn();
      const dom = shallow(<ValueEditor level={0} handleOnChange={onChange} />);
      dom.find('input').simulate('change', mockEvent);
      expect(onChange).toHaveBeenCalled();
    });
    //TODO spy on value change handler and verify it is triggered
  });

  describe('rule remove action as <ActionElement />', () => {
    beforeEach(() => {
      controls.removeRuleAction = ActionElement;
    });

    it('should have label set to "x"', () => {
      const dom = shallow(<Rule {...props} />);

      expect(dom.find('ActionElement').props().label).toBe('x');
    });

    it('should have the default className', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find('ActionElement').props().className).toContain('rule-remove');
    });

    it('should have the custom className', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find('ActionElement').props().className).toContain('custom-removeRule-class');
    });

    it('should have the onChange method handler', () => {
      const dom = shallow(<Rule {...props} />);

      expect(typeof dom.find(ActionElement).props().handleOnClick).toBe('function');
    });

    //TODO spy on value change handler and verify it is triggered
  });

  describe('onElementChanged methods', () => {
    let actualProperty, actualValue, actualId;
    beforeEach(() => {
      schema.onPropChange = (property, value, id) => {
        actualProperty = property;
        actualValue = value;
        actualId = id;
      };
    });

    describe('onFieldChanged', () => {
      it('should call onPropChange with the rule id', () => {
        const dom = mount(<Rule {...props} />);
        dom.find('.rule-fields').simulate('change', { target: { value: 'any_field' } });

        expect(actualProperty).toBe('field');
        expect(actualValue).toBe('any_field');
        expect(actualId).toBe('id');
      });
    });

    describe('onOperatorChanged', () => {
      it('should call onPropChange with the rule id', () => {
        const dom = mount(<Rule {...props} />);
        dom.find('.rule-operators').simulate('change', { target: { value: 'any_operator' } });

        expect(actualProperty).toBe('operator');
        expect(actualValue).toBe('any_operator');
        expect(actualId).toBe('id');
      });
    });

    describe('onValueChanged', () => {
      it('should call onPropChange with the rule id', () => {
        const dom = mount(<Rule {...props} />);
        dom.find('.rule-value').simulate('change', { target: { value: 'any_value' } });

        expect(actualProperty).toBe('value');
        expect(actualValue).toBe('any_value');
        expect(actualId).toBe('id');
      });
    });
  });

  describe('removeRule', () => {
    it('should call onRuleRemove with the rule and parent id', () => {
      let myRuleId, myParentId;
      schema.onRuleRemove = (ruleId, parentId) => {
        myRuleId = ruleId;
        myParentId = parentId;
      };
      const dom = mount(<Rule {...props} />);
      dom.find('.rule-remove').simulate('click');

      expect(myRuleId).toBe('id');
      expect(myParentId).toBe('parentId');
    });
  });

  function behavesLikeASelector(value, defaultClassName, customClassName) {
    it('should have the selected value set correctly', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find('ValueSelector').props().value).toBe(value);
    });

    it('should have the default className', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find('ValueSelector').props().className).toContain(defaultClassName);
    });

    it('should have the custom className', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find('ValueSelector').props().className).toContain(customClassName);
    });

    it('should have the onChange method handler', () => {
      const dom = shallow(<Rule {...props} />);
      expect(typeof dom.find(ValueSelector).props().handleOnChange).toBe('function');
    });

    it('should have the level of the Rule', () => {
      const dom = shallow(<Rule {...props} />);
      expect(dom.find(ValueSelector).props().level).toBe(0);
    });
  }
});
