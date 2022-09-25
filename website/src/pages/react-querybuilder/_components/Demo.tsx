import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import { clsx } from 'clsx';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ExportFormat, FormatQueryOptions } from 'react-querybuilder';
import {
  convertToIC,
  defaultValidator,
  formatQuery,
  parseCEL,
  parseJsonLogic,
  parseSQL,
  QueryBuilder,
  version as rqbVersion,
} from 'react-querybuilder';
import {
  defaultOptions,
  fields,
  formatMap,
  initialQuery as defaultInitialQuery,
  initialQueryIC as defaultInitialQueryIC,
  optionOrderByLabel,
  optionsMetadata,
} from '../_constants';
import type { CommonRQBProps, StyleName } from '../_constants/types';
import {
  getFormatQueryString,
  getHashFromState,
  getStateFromHash,
  optionsReducer,
} from '../_constants/utils';
import Nav from './Nav';

const infoChar = 'ⓘ';

const getDocsPreferredVersionDefault = () => localStorage.getItem('docs-preferred-version-default');

// Initialize options from URL hash
const initialStateFromHash = getStateFromHash(queryString.parse(location.hash));
const initialOptionsFromHash = initialStateFromHash.options;
const initialQuery = initialStateFromHash.query ?? defaultInitialQuery;
const initialQueryIC = initialStateFromHash.queryIC ?? defaultInitialQueryIC;

const initialSQL = `SELECT *\n  FROM my_table\n WHERE ${formatQuery(initialQuery, 'sql')};`;
const initialCEL = `firstName.startsWith("Stev") && age > 28`;
const initialJsonLogic = JSON.stringify(formatQuery(initialQuery, 'jsonlogic'), null, 2);

const permalinkText = 'Copy link';
const permalinkCopiedText = 'Copied!';

interface DemoProps {
  variant?: StyleName;
}

export default function Demo({ variant = 'default' }: DemoProps) {
  const docsPreferredVersionDefault = useRef(getDocsPreferredVersionDefault());
  const siteLocation = useLocation();
  const [query, setQuery] = useState(initialQuery);
  const [queryIC, setQueryIC] = useState(initialQueryIC);
  const [format, setFormat] = useState<ExportFormat>('json_without_ids');
  const [options, setOptions] = useReducer(optionsReducer, {
    ...defaultOptions,
    ...initialOptionsFromHash,
  });
  const [isSQLInputVisible, setIsSQLInputVisible] = useState(false);
  const [sql, setSQL] = useState(initialSQL);
  const [sqlParseError, setSQLParseError] = useState('');
  const [isCELInputVisible, setIsCELInputVisible] = useState(false);
  const [cel, setCEL] = useState(initialCEL);
  const [celParseError, setCELParseError] = useState('');
  const [isJsonLogicInputVisible, setIsJsonLogicInputVisible] = useState(false);
  const [jsonLogic, setJsonLogic] = useState(initialJsonLogic);
  const [jsonLogicParseError, setJsonLogicParseError] = useState('');
  const [copyPermalinkText, setCopyPermalinkText] = useState(permalinkText);

  const permalinkHash = useMemo(() => `#${queryString.stringify(options)}`, [options]);

  const updateOptionsFromHash = useCallback((e: HashChangeEvent) => {
    const stateFromHash = getStateFromHash(
      queryString.parse(
        queryString.parseUrl(e.newURL, { parseFragmentIdentifier: true }).fragmentIdentifier ?? ''
      )
    );
    const payload = { ...defaultOptions, ...stateFromHash.options };
    setOptions({ type: 'replace', payload });
    if (stateFromHash.query) {
      setQuery(stateFromHash.query);
    }
    if (stateFromHash.queryIC) {
      setQueryIC(stateFromHash.queryIC);
    }
    // TODO: handle `style`
  }, []);

  useEffect(() => {
    history.pushState(null, '', permalinkHash);
    window.addEventListener('hashchange', updateOptionsFromHash);

    return () => window.removeEventListener('hashchange', updateOptionsFromHash);
  }, [permalinkHash, updateOptionsFromHash]);

  const optionsInfo = useMemo(
    () =>
      optionOrderByLabel.map(opt => ({
        ...optionsMetadata[opt],
        default: defaultOptions[opt],
        checked: options[opt],
        setter: (v: boolean) =>
          setOptions({
            type: 'update',
            payload: { optionName: opt, value: v },
          }),
      })),
    [options]
  );

  const formatOptions = useMemo(
    (): FormatQueryOptions => ({
      format,
      fields: options.validateQuery ? fields : undefined,
      parseNumbers: options.parseNumbers,
    }),
    [format, options.parseNumbers, options.validateQuery]
  );
  const q = options.independentCombinators ? queryIC : query;
  const formatString = useMemo(() => getFormatQueryString(q, formatOptions), [formatOptions, q]);

  const loadFromSQL = () => {
    try {
      const q = parseSQL(sql);
      const qIC = parseSQL(sql, { independentCombinators: true });
      setQuery(q);
      setQueryIC(qIC);
      setIsSQLInputVisible(false);
      setSQLParseError('');
    } catch (err) {
      setSQLParseError((err as Error).message);
    }
  };
  const loadFromCEL = () => {
    try {
      const q = parseCEL(cel);
      const qIC = parseCEL(cel, { independentCombinators: true });
      setQuery(q);
      setQueryIC(qIC);
      setIsCELInputVisible(false);
      setCELParseError('');
    } catch (err) {
      setCELParseError((err as Error).message);
    }
  };
  const loadFromJsonLogic = () => {
    try {
      const q = parseJsonLogic(jsonLogic);
      const qIC = convertToIC(q);
      setQuery(q);
      setQueryIC(qIC);
      setIsJsonLogicInputVisible(false);
      setJsonLogicParseError('');
    } catch (err) {
      setJsonLogicParseError((err as Error).message);
    }
  };

  const _getPermalinkUncompressed = () =>
    `${location.origin}${siteLocation.pathname}${permalinkHash}`;

  const getCompressedState = () =>
    encodeURIComponent(
      getHashFromState({
        query,
        queryIC,
        options,
        style: variant,
      })
    );

  const getPermalinkCompressed = () =>
    `${location.origin}${siteLocation.pathname}#s=${getCompressedState()}`;

  const onClickCopyPermalink = async () => {
    try {
      await navigator.clipboard.writeText(getPermalinkCompressed());
      setCopyPermalinkText(permalinkCopiedText);
    } catch (e) {
      console.error('Clipboard error', e);
    }
    setTimeout(() => setCopyPermalinkText(permalinkText), 1214);
  };

  const commonRQBProps = useMemo(
    (): CommonRQBProps => ({
      fields,
      ...options,
      validator: options.validateQuery ? defaultValidator : undefined,
    }),
    [options]
  );

  const qbWrapperId = `rqb-${variant}`;
  const qbWrapperClassName = useMemo(
    () =>
      clsx(
        { validateQuery: options.validateQuery, justifiedLayout: options.justifiedLayout },
        variant === 'default' ? '' : `rqb-${variant}`
      ),
    [options.justifiedLayout, options.validateQuery, variant]
  );

  return (
    <div
      style={{
        padding: 'var(--ifm-global-spacing)',
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        columnGap: 'var(--ifm-global-spacing)',
      }}>
      <div>
        <h3>
          <Link
            href={'/docs/api/querybuilder'}
            title={'Boolean props on the QueryBuilder component (click for documentation)'}
            style={{
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <span>Options</span>
            <span>{infoChar}</span>
          </Link>
        </h3>
        <div>
          {optionsInfo.map(({ checked, label, link, setter, title }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <label>
                <input type="checkbox" checked={checked} onChange={e => setter(e.target.checked)} />
                {label}
              </label>
              {link ? (
                <Link
                  href={`${link}`}
                  title={`${title} (click for documentation)`}
                  style={{ textDecoration: 'none' }}>
                  {infoChar}
                </Link>
              ) : (
                <span title={title} style={{ cursor: 'pointer' }}>
                  {infoChar}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            columnGap: 'var(--ifm-global-spacing)',
            margin: 'var(--ifm-global-spacing) auto',
          }}>
          <div title="Reset the options above to their default values">
            <button type="button" onClick={() => setOptions({ type: 'reset' })}>
              Reset
            </button>
          </div>
          <div
            title={`Enable all features except "${optionsMetadata.disabled.label}" and "${optionsMetadata.independentCombinators.label}"`}>
            <button type="button" onClick={() => setOptions({ type: 'all' })}>
              Select all
            </button>
          </div>
          <div
            title={
              'Copy a URL that will load this demo with the options set as they are currently'
            }>
            <button type="button" onClick={onClickCopyPermalink}>
              {copyPermalinkText}
            </button>
          </div>
        </div>
        <h3>
          <Link
            href={'/docs/api/export'}
            title={'The export format of the formatQuery function (click for documentation)'}
            style={{
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <span>Export</span>
            <span>{infoChar}</span>
          </Link>
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            marginBottom: 'var(--ifm-heading-margin-bottom)',
          }}>
          {formatMap.map(([fmt, lbl, lnk]) => (
            <div
              key={fmt}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <label>
                <input type="radio" checked={format === fmt} onChange={() => setFormat(fmt)} />
                {lbl}
              </label>
              <Link
                href={lnk}
                title={`formatQuery(query, "${fmt}") (click for information)`}
                style={{ textDecoration: 'none' }}>
                {infoChar}
              </Link>
            </div>
          ))}
        </div>
        <h3>
          <Link
            href={'/docs/api/import'}
            title={
              'Use the parse* methods to set the query from SQL/JsonLogic/etc. (click for documentation)'
            }
            style={{
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <span>Import</span>
            <span>{infoChar}</span>
          </Link>
        </h3>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: 'var(--ifm-global-spacing)' }}>
          <button type="button" onClick={() => setIsSQLInputVisible(true)}>
            Import SQL
          </button>
          <button type="button" onClick={() => setIsCELInputVisible(true)}>
            Import CEL
          </button>
          <button type="button" onClick={() => setIsJsonLogicInputVisible(true)}>
            Import JsonLogic
          </button>
          <div>
            <code style={{ fontSize: '8pt', marginBottom: 'var(--ifm-global-spacing)' }}>
              react-querybuilder@{rqbVersion}
            </code>
          </div>
        </div>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', rowGap: 'var(--ifm-global-spacing)' }}>
        <Nav variant={variant} compressedState={getCompressedState()} />
        <div id={qbWrapperId} className={qbWrapperClassName}>
          <QueryBuilderDnD>
            {options.independentCombinators ? (
              <QueryBuilder
                {...commonRQBProps}
                independentCombinators
                key={'queryIC'}
                query={queryIC}
                onQueryChange={q => setQueryIC(q)}
              />
            ) : (
              <QueryBuilder
                {...commonRQBProps}
                independentCombinators={false}
                key={'query'}
                query={query}
                onQueryChange={q => setQuery(q)}
              />
            )}
          </QueryBuilderDnD>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{formatString}</pre>
      </div>
    </div>
  );
}
