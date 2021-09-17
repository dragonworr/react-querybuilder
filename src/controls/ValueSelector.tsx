import { ValueSelectorProps } from '../types';

const ValueSelector = ({
  className,
  handleOnChange,
  options,
  title,
  value
}: ValueSelectorProps) => (
  <select
    className={className}
    value={value}
    title={title}
    onChange={(e) => handleOnChange(e.target.value)}
  >
    {options.map((option) => {
      const key = option.id ? `key-${option.id}` : `key-${option.name}`;
      return (
        <option key={key} value={option.name}>
          {option.label}
        </option>
      );
    })}
  </select>
);

ValueSelector.displayName = 'ValueSelector';

export default ValueSelector;
