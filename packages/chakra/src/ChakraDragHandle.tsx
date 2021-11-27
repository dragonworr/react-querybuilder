import { IconButton } from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';
import { forwardRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';

export default forwardRef<HTMLSpanElement, DragHandleProps>(function ChakraDragHandle(
  { className, title },
  dragRef
) {
  return (
    <span ref={dragRef} className={className} title={title}>
      <IconButton aria-label={title ?? ''} size="xs" icon={<DragHandleIcon />} />
    </span>
  );
});
