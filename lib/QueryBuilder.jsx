import './query-builder.css';
import uniqueId from 'lodash/uniqueId';

import RuleGroup from './RuleGroup';


export default class QueryBuilder extends React.Component {
    static get defaultProps() {
        return {
            rules: [],
            fields: [],
            operators: QueryBuilder.defaultOperators,
            combinators: QueryBuilder.defaultCombinators,
            getEditor: null
        };
    }

    static get propTypes() {
        return {
            rules: React.PropTypes.array,
            fields: React.PropTypes.array,
            operators: React.PropTypes.array,
            combinators: React.PropTypes.array,
            getEditor: React.PropTypes.func
        };
    }


    constructor(...args) {
        super(...args);
        this.state = {
            root: {},
            schema: {},
        };
    }

    static get defaultOperators() {

        return [
            {name: 'null', label: 'Is Null'},
            {name: 'notNull', label: 'Is Not Null'},
            {name: 'in', label: 'In'},
            {name: 'notIn', label: 'Not In'},
            {name: '=', label: '='},
            {name: '!=', label: '!='},
            {name: '<', label: '<'},
            {name: '>', label: '>'},
            {name: '<=', label: '<='},
            {name: '>=', label: '>='},
        ];
    }

    static get defaultCombinators() {

        return [
            {name: 'and', label: 'AND'},
            {name: 'or', label: 'OR'},
        ];
    }

    componentWillMount() {
        const {fields, operators, combinators} = this.props;

        this.setState({
            root: this.createRuleGroup(),
            schema: {
                fields,
                operators,
                combinators,
                createRule: this.createRule.bind(this),
                createRuleGroup: this.createRuleGroup.bind(this),
                onRuleAdd: (...args)=>this.onRuleAdd(...args),
                onGroupAdd: (...args)=>this.onGroupAdd(...args),
                onRuleRemove: (...args)=>this.onRuleRemove(...args),
                onGroupRemove: (...args)=>this.onGroupRemove(...args),
                onPropChange: (...args)=>this.onPropChange(...args),
                getEditor: (...args)=>this.prepareEditor(...args),
            }
        });
    }

    render() {
        const {root: {id, rules, combinator}, schema} = this.state;

        return (
            <RuleGroup rules={rules}
                       combinator={combinator}
                       schema={schema}
                       id={id}
                       parentId={null}/>
        );
    }


    createRule() {
        const {fields, operators} = this.state.schema;

        return {
            id: uniqueId('r-'),
            type: 'rule',
            field: fields[0].name,
            value: 'some value',
            operator: operators[0].name
        };
    }

    createRuleGroup() {
        return {
            id: uniqueId('g-'),
            type: 'ruleGroup',
            rules: [],
            combinator: this.props.combinators[0].name,
        };
    }


    prepareEditor(config) {
        const {field, value, operator, onChange} = config;

        const editor = this.props.getEditor && this.props.getEditor(config);
        if (editor) {
            return editor;
        }

        if (operator === 'null' || operator === 'notNull') {
            return null;
        }

        return (
            <input type="text"
                   value={value}
                   onChange={event=>onChange(event.target.value)}/>
        );
    }

    onRuleAdd(rule, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        parent.rules.push(rule);

        this.setState({root: this.state.root});
    }

    onGroupAdd(group, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        parent.rules.push(group);

        this.setState({root: this.state.root});
    }

    onPropChange(prop, value, ruleId) {
        const rule = this._findRule(ruleId, this.state.root);
        Object.assign(rule, {[prop]: value});

        this.setState({root: this.state.root});
    }

    onRuleRemove(ruleId, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        const index = parent.rules.findIndex(x=>x.id === ruleId);

        parent.rules.splice(index, 1);
        this.setState({root: this.state.root});
    }

    onGroupRemove(groupId, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        const index = parent.rules.findIndex(x=>x.id === groupId);

        parent.rules.splice(index, 1);
        this.setState({root: this.state.root});
    }

    _findRule(id, parent) {
        if (parent.id === id) {
            return parent;
        }

        for (const rule of parent.rules) {
            if (rule.id === id) {
                return rule;
            } else if (rule.type === 'ruleGroup') {
                const subRule = this._findRule(id, rule);
                if (subRule) {
                    return subRule;
                }
            }
        }

    }
}

