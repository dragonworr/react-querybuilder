import type { ComponentType } from 'react';
import { Fragment, useCallback, useMemo, useReducer, useState } from 'react';
import type { FormatQueryOptions, QueryBuilderProps, RuleGroupType, RuleGroupTypeIC } from '../src';
import { defaultValidator, QueryBuilder } from '../src';
import {
  defaultOptions,
  emptyQuery,
  emptyQueryIC,
  fields,
  formatMap,
  initialQuery,
  initialQueryIC,
  optionOrder,
} from './constants';
import './styles.scss';
import type { CommonRQBProps } from './types';
import { getFormatQueryString, optionsReducer } from './utils';

export const App = (
  controls: Pick<QueryBuilderProps, 'controlClassnames' | 'controlElements'> & {
    wrapper?: ComponentType<any>;
  }
) => {
  const [query, setQuery] = useState(initialQuery);
  const [queryIC, setQueryIC] = useState(initialQueryIC);
  const [optVals, updateOptions] = useReducer(optionsReducer, defaultOptions);

  const Wrapper = controls.wrapper ?? Fragment;

  const commonRQBProps = useMemo(
    (): CommonRQBProps => ({
      fields,
      ...optVals,
      validator: optVals.validateQuery ? defaultValidator : undefined,
      ...controls,
    }),
    [controls, optVals]
  );

  const formatQueryResults = formatMap.map(([format]) => {
    const formatQueryOptions: FormatQueryOptions = {
      format,
      fields: optVals.validateQuery ? fields : undefined,
      parseNumbers: optVals.parseNumbers,
    };
    const q = optVals.independentCombinators ? queryIC : query;
    return [format, getFormatQueryString(q, formatQueryOptions)] as const;
  });

  const actions = useMemo(
    () =>
      [
        ['Default options', () => updateOptions({ type: 'reset' })],
        ['All options', () => updateOptions({ type: 'all' })],
        [
          'Clear query',
          () => {
            setQuery(emptyQuery);
            setQueryIC(emptyQueryIC);
          },
        ],
        [
          'Default query',
          () => {
            setQuery(initialQuery);
            setQueryIC(initialQueryIC);
          },
        ],
      ] as const,
    []
  );

  const onQueryChange = useCallback((q: RuleGroupType) => setQuery(q), []);
  const onQueryChangeIC = useCallback((q: RuleGroupTypeIC) => setQueryIC(q), []);

  return (
    <>
      <div>
        {optionOrder.map(opt => (
          <label key={opt}>
            <input
              type="checkbox"
              checked={optVals[opt]}
              onChange={e =>
                updateOptions({
                  type: 'update',
                  payload: { optionName: opt, value: e.target.checked },
                })
              }
            />
            <code>{opt}</code>
          </label>
        ))}
        {actions.map(([label, action]) => (
          <span key={label}>
            <button type="button" onClick={action}>
              {label}
            </button>
          </span>
        ))}
      </div>
      <div>
        <Wrapper>
          {!optVals.independentCombinators ? (
            <QueryBuilder
              key="query"
              {...commonRQBProps}
              independentCombinators={false}
              query={query}
              onQueryChange={onQueryChange}
            />
          ) : (
            <QueryBuilder
              key="queryIC"
              {...commonRQBProps}
              independentCombinators
              query={queryIC}
              onQueryChange={onQueryChangeIC}
            />
          )}
        </Wrapper>
        <div id="exports">
          {formatQueryResults.map(([fmt, result]) => (
            <Fragment key={fmt}>
              <code>{fmt}</code>
              <pre>{result}</pre>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
