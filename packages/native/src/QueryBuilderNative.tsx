import { QueryBuilderContext } from '@react-querybuilder/ctx';
import type { RuleGroupType, RuleGroupTypeIC } from 'react-querybuilder';
import { useQueryBuilder } from 'react-querybuilder';
import { defaultNativeControlElements } from './defaults';
import { RuleGroupNative } from './RuleGroupNative';
import type { QueryBuilderNativeProps } from './types';

export const QueryBuilderNative = <RG extends RuleGroupType | RuleGroupTypeIC = RuleGroupType>(
  props: QueryBuilderNativeProps<RG>
) => {
  const controlElements = { ...defaultNativeControlElements, ...props.controlElements };
  const qb = useQueryBuilder({ ...props, controlElements });

  return (
    <QueryBuilderContext.Provider value={qb.rqbContext}>
      <RuleGroupNative
        ruleGroup={qb.query}
        path={[]}
        translations={qb.translations}
        schema={qb.schema}
        actions={qb.actions}
      />
    </QueryBuilderContext.Provider>
  );
};
