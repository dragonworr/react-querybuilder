import { DragHandleIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { forwardRef, type ComponentPropsWithRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';

type IBP = ComponentPropsWithRef<typeof IconButton>;

type ChakraDragHandleProps = DragHandleProps &
  Omit<IBP, 'aria-label'> &
  Partial<Pick<IBP, 'aria-label'>>;

export const ChakraDragHandle = forwardRef<HTMLSpanElement, ChakraDragHandleProps>(
  (
    {
      className,
      title,
      disabled,
      // Props that should not be in extraProps
      testID: _testID,
      level: _level,
      path: _path,
      label: _label,
      context: _context,
      validation: _validation,
      ...extraProps
    },
    dragRef
  ) => (
    <span ref={dragRef} className={className} title={title}>
      <IconButton
        isDisabled={disabled}
        size="xs"
        icon={<DragHandleIcon />}
        aria-label={title ?? /* istanbul ignore next */ ''}
        {...extraProps}
      />
    </span>
  )
);

ChakraDragHandle.displayName = 'ChakraDragHandle';
