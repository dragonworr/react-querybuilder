export default class Rule extends React.Component {
    static get defaultProps() {
        return {
            id: null,
            parentId: null,
            field: null,
            operator: null,
            value: null,
            schema: null
        };
    }

    render() {
        const {field, operator, value, schema: {fields, operators, getEditor, getOperators}} = this.props;

        return (
            <div className="QueryBuilder-rule">
                <select className="Rule-fields"
                        value={field}
                        onChange={event=>this.onValueChanged('field', event.target.value)}>
                        {
                            fields.map(field=> {
                                return (
                                    <option key={field.name} value={field.name}>{field.label}</option>
                                );
                            })
                        }
                </select>
                <select className="Rule-operators"
                        value={operator}
                        onChange={event=>this.onValueChanged('operator', event.target.value)}>
                        {
                            getOperators().map(op=> {
                                return (
                                    <option value={op.name} key={op.name}>{op.label}</option>
                                );
                            })
                        }
                </select>

                 {
                     getEditor({
                         field,
                         value,
                         operator,
                         onChange: value=>this.onValueChanged('value', value)
                     })
                 }

                <button className="Rule-remove"
                        onClick={event=>this.removeRule(event)}>x
                </button>
            </div>
        );
    }

    onValueChanged(field, value) {
        const {id, schema: {onPropChange}} = this.props;

        onPropChange(field, value, id);
    }

    removeRule(event) {
        event.preventDefault();
        event.stopPropagation();

        this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
    }


}
