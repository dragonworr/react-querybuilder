import { render, screen } from '@testing-library/react';
import type { Option, OptionGroup, Schema, VersatileSelectorProps } from 'react-querybuilder';
import { QueryBuilder, TestID } from 'react-querybuilder';
import {
  testActionElement,
  testNotToggle,
  testValueEditor,
  userEventSetup,
} from 'react-querybuilder/genericTests';
import { QueryBuilderMantine } from './index';
import { MantineActionElement } from './MantineActionElement';
import { MantineNotToggle } from './MantineNotToggle';
import { MantineValueEditor } from './MantineValueEditor';
import { MantineValueSelector } from './MantineValueSelector';
import { optionListMapNameToValue } from './utils';

declare global {
  // eslint-disable-next-line no-var
  var __RQB_DEV__: boolean;
}
globalThis.__RQB_DEV__ = true;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

testActionElement(MantineActionElement);
testNotToggle(MantineNotToggle);
testValueEditor(MantineValueEditor, { select: true, multiselect: true, betweenSelect: true });

const user = userEventSetup();

describe('MantineValueSelector', () => {
  (window as any).ResizeObserver = ResizeObserver;
  const options: Option[] = [
    { name: 'opt1', label: 'Option 1' },
    { name: 'opt2', label: 'Option 2' },
  ];
  const props: VersatileSelectorProps = {
    testID: TestID.fields,
    options,
    path: [0],
    level: 1,
    schema: {} as Schema,
    handleOnChange: () => {},
  };

  it('handles single select', async () => {
    const handleOnChange = jest.fn();
    const { rerender } = render(
      <MantineValueSelector {...props} handleOnChange={handleOnChange} />
    );
    await user.click(screen.getByTestId(TestID.fields));
    await user.click(screen.getByText('Option 2'));
    expect(handleOnChange).toHaveBeenNthCalledWith(1, 'opt2');
    rerender(
      <MantineValueSelector
        {...props}
        handleOnChange={handleOnChange}
        value={'opt2'}
        listsAsArrays
        clearable
      />
    );
    await user.click(screen.getByRole('combobox').querySelector('button')!);
    expect(handleOnChange).toHaveBeenNthCalledWith(2, '');
  });

  it('handles multiselect', async () => {
    const handleOnChange = jest.fn();
    const { rerender } = render(
      <MantineValueSelector {...props} multiple handleOnChange={handleOnChange} listsAsArrays />
    );
    await user.click(screen.getByTestId(TestID.fields));
    await user.click(screen.getByText('Option 2'));
    expect(handleOnChange).toHaveBeenNthCalledWith(1, ['opt2']);
    rerender(
      <MantineValueSelector
        {...props}
        multiple
        handleOnChange={handleOnChange}
        value={'opt2'}
        listsAsArrays
        clearable
      />
    );
    await user.click(screen.getByRole('combobox').querySelector('button')!);
    expect(handleOnChange).toHaveBeenNthCalledWith(2, []);
  });

  it('handles optgroups', async () => {
    const optGroup: OptionGroup[] = [{ label: 'Test Group', options }];
    const handleOnChange = jest.fn();
    render(
      <MantineValueSelector
        {...props}
        testID={TestID.fields}
        options={optionListMapNameToValue(optGroup)}
        handleOnChange={handleOnChange}
      />
    );
    await user.click(screen.getByTestId(TestID.fields));
    await user.click(screen.getByText('Option 2'));
    expect(handleOnChange).toHaveBeenCalledWith('opt2');
  });
});

describe('MantineValueEditor as select and date picker', () => {});

it('renders with composition', () => {
  render(
    <QueryBuilderMantine>
      <QueryBuilder />
    </QueryBuilderMantine>
  );
  expect(screen.getByTestId(TestID.addRule)).toHaveClass('mantine-Button-root');
});
