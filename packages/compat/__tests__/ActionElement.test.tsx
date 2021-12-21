import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ActionWithRulesProps } from 'react-querybuilder';

const defaultProps: ActionWithRulesProps = {
  handleOnClick: () => {},
  className: '',
  level: 0,
  path: [],
};

export const testActionElement = (ActionElement: React.ComponentType<ActionWithRulesProps>) => {
  const title = ActionElement.displayName ?? 'ActionElement';
  const props = { ...defaultProps, title };

  describe(title, () => {
    it('should have the label passed into the <button />', () => {
      const { container } = render(<ActionElement {...props} label="test" />);
      expect(container).toHaveTextContent('test');
    });

    it('should have the className passed into the <button />', () => {
      const { getByTitle } = render(<ActionElement {...props} className="my-css-class" />);
      expect(getByTitle(title)).toHaveClass('my-css-class');
    });

    it('should call the onClick method passed in', () => {
      const onClick = jest.fn();
      const { getByTitle } = render(<ActionElement {...props} handleOnClick={onClick} />);
      userEvent.click(getByTitle(title));
      expect(onClick).toHaveBeenCalled();
    });

    it('should be disabled by disabled prop', () => {
      const onClick = jest.fn();
      const { getByTitle } = render(<ActionElement {...props} handleOnClick={onClick} disabled />);
      userEvent.click(getByTitle(title));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
};
