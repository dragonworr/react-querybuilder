import { Button } from 'antd';
import type { ActionProps } from 'react-querybuilder';

const AntDActionElement = ({ className, handleOnClick, label, title, disabled }: ActionProps) => (
  <Button
    type="primary"
    className={className}
    title={title}
    onClick={e => handleOnClick(e)}
    disabled={disabled}>
    {label}
  </Button>
);

AntDActionElement.displayName = 'AntDActionElement';

export default AntDActionElement;
