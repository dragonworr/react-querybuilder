import type { RuleGroupTypeAny, RuleType } from '@react-querybuilder/ts/src/index.noReact';
import produce from 'immer';

const remapProperties = (
  obj: Record<string, any>,
  propertyMap: Record<string, string>,
  deleteRemappedProperties: boolean
) =>
  produce(obj, draft => {
    for (const [k, v] of Object.entries(propertyMap)) {
      draft[v] = draft[k];
      if (deleteRemappedProperties) {
        delete draft[k];
      }
    }
  });

interface QueryTransformerOptions {
  /**
   * When a rule is encountered in the hierarchy, it will be replaced
   * with the result of this function.
   *
   * @default r => r
   */
  ruleProcessor?: (rule: RuleType) => any;
  /**
   * When a group is encountered in the hierarchy, it will be replaced
   * with the result of this function. Note that the `rules` property from
   * the original group will be processed as normal and reapplied to the
   * new group object.
   *
   * @default rg => rg
   */
  ruleGroupProcessor?: (ruleGroup: RuleGroupTypeAny) => Record<string, any>;
  /**
   * For each rule and group in the query, any properties matching a key
   * in this object will be renamed to the corresponding value. To retain both
   * the new _and_ the original properties, set `deleteRemappedProperties`
   * to `false`.
   *
   * @default {}
   *
   * @example
   *   transformQuery(
   *     { combinator: 'and', rules: [] },
   *     { propertyMap: { combinator: 'AndOr' } }
   *   )
   *   // Returns: { AndOr: 'and', rules: [] }
   */
  propertyMap?: Record<string, string>;
  /**
   * Any combinator values (including independent combinators) will be translated
   * from the key in this object to the value.
   *
   * @default {}
   *
   * @example
   *   transformQuery(
   *     { combinator: 'and', rules: [] },
   *     { combinatorMap: { and: '&&', or: '||' } }
   *   )
   *   // Returns: { combinator: '&&', rules: [] }
   */
  combinatorMap?: Record<string, string>;
  /**
   * Any operator values will be translated from the key in this object to the value.
   *
   * @default {}
   *
   * @example
   *   transformQuery(
   *     { combinator: 'and', rules: [{ field: 'name', operator: '=', value: 'Steve Vai' }] },
   *     { operatorMap: { '=': 'is' } }
   *   )
   *   // Returns:
   *   // {
   *   //   combinator: 'and',
   *   //   rules: [{ field: 'name', operator: 'is', value: 'Steve Vai' }]
   *   // }
   */
  operatorMap?: Record<string, string>;
  /**
   * Original properties remapped according to the `propertyMap` option will be removed.
   *
   * @default true
   *
   * @example
   *   transformQuery(
   *     { combinator: 'and', rules: [] },
   *     { propertyMap: { combinator: 'AndOr' }, deleteRemappedProperties: false }
   *   )
   *   // Returns: { combinator: 'and', AndOr: 'and', rules: [] }
   */
  deleteRemappedProperties?: boolean;
}

/**
 * Recursively process a query heirarchy with this versatile utility function.
 *
 * Documentation: https://react-querybuilder.js.org/docs/api/misc#transformquery
 *
 * @param query The query to transform
 * @param options
 * @returns The transformed query
 */
export const transformQuery = (query: RuleGroupTypeAny, options: QueryTransformerOptions = {}) => {
  const {
    ruleProcessor = r => r,
    ruleGroupProcessor = rg => rg,
    propertyMap = {},
    combinatorMap = {},
    operatorMap = {},
    deleteRemappedProperties = true,
  } = options;

  const processGroup = (rg: RuleGroupTypeAny & { path: number[] }): any => ({
    ...ruleGroupProcessor(
      remapProperties(
        {
          ...rg,
          ...('combinator' in rg
            ? { combinator: combinatorMap[rg.combinator] ?? rg.combinator }
            : {}),
        },
        propertyMap,
        deleteRemappedProperties
      ) as RuleGroupTypeAny
    ),
    rules: rg.rules.map((r: any, idx) => {
      if (typeof r === 'string') {
        // independent combinators
        return combinatorMap[r] ?? r;
      } else if ('rules' in r) {
        // sub-groups
        return processGroup({ ...r, path: [...rg.path, idx] });
      }
      // rules
      return ruleProcessor(
        remapProperties(
          {
            ...{ ...r, path: [...rg.path, idx] },
            operator: operatorMap[r.operator] ?? r.operator,
          },
          propertyMap,
          deleteRemappedProperties
        ) as RuleType
      );
    }),
  });

  return processGroup({ ...query, path: [] });
};
