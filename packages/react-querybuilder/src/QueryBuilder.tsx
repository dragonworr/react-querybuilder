import { enableES5 } from 'immer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  defaultCombinators,
  defaultControlClassnames,
  defaultControlElements,
  defaultOperators,
  defaultTranslations,
  standardClassnames,
} from './defaults';
import {
  c,
  filterFieldsByComparator,
  generateID,
  getValueSourcesUtil,
  objectKeys,
  uniqByName,
  uniqOptGroups,
} from './internal';
import type {
  Classnames,
  Controls,
  Field,
  NameLabelPair,
  QueryBuilderProps,
  RuleGroupType,
  RuleGroupTypeIC,
  RuleType,
  Schema,
  TranslationsFull,
  UpdateableProperties,
  ValueSources,
} from './types';
import {
  add,
  getFirstOption,
  isOptionGroupArray,
  isRuleGroup,
  move,
  pathIsDisabled,
  prepareRuleGroup,
  remove,
  update,
} from './utils';

enableES5();

export const QueryBuilderWithoutDndProvider = <RG extends RuleGroupType | RuleGroupTypeIC>({
  defaultQuery,
  query: queryProp,
  fields: fProp,
  operators = defaultOperators,
  combinators = defaultCombinators,
  translations: translationsProp = defaultTranslations,
  enableMountQueryChange = true,
  controlElements,
  getDefaultField,
  getDefaultOperator,
  getDefaultValue,
  getOperators,
  getValueEditorType,
  getValueSources,
  getInputType,
  getValues,
  onAddRule = r => r,
  onAddGroup = rg => rg,
  onQueryChange = () => {},
  controlClassnames,
  showCombinatorsBetweenRules = false,
  showNotToggle = false,
  showCloneButtons = false,
  showLockButtons = false,
  resetOnFieldChange = true,
  resetOnOperatorChange = false,
  autoSelectField = true,
  autoSelectOperator = true,
  addRuleToNewGroups = false,
  enableDragAndDrop = false,
  independentCombinators,
  disabled = false,
  validator,
  context,
  debugMode = false,
  onLog = console.log,
}: QueryBuilderProps<RG>) => {
  const translations = useMemo((): TranslationsFull => {
    const translationsTemp: Partial<TranslationsFull> = {};
    objectKeys(translationsProp).forEach(t => {
      // TODO: type this better (remove/replace `as any`)
      translationsTemp[t] = { ...defaultTranslations[t], ...translationsProp[t] } as any;
    });
    return { ...defaultTranslations, ...translationsTemp };
  }, [translationsProp]);

  const defaultField = useMemo(
    (): Field => ({
      id: translations.fields.placeholderName,
      name: translations.fields.placeholderName,
      label: translations.fields.placeholderLabel,
    }),
    [translations.fields.placeholderLabel, translations.fields.placeholderName]
  );
  const fieldsProp = useMemo(() => fProp ?? [defaultField], [defaultField, fProp]);

  const fields = useMemo(() => {
    let f = Array.isArray(fieldsProp)
      ? fieldsProp
      : objectKeys(fieldsProp)
          .map((fld): Field => ({ ...fieldsProp[fld], name: fld }))
          .sort((a, b) => a.label.localeCompare(b.label));
    if (isOptionGroupArray(f)) {
      if (autoSelectField) {
        f = uniqOptGroups(f);
      } else {
        f = uniqOptGroups([
          { label: translations.fields.placeholderGroupLabel, options: [defaultField] },
          ...f,
        ]);
      }
    } else {
      if (autoSelectField) {
        f = uniqByName(f);
      } else {
        f = uniqByName([defaultField, ...f]);
      }
    }
    return f;
  }, [autoSelectField, defaultField, fieldsProp, translations.fields.placeholderGroupLabel]);

  const fieldMap = useMemo(() => {
    if (!Array.isArray(fieldsProp)) {
      const fp: Record<string, Field> = {};
      objectKeys(fieldsProp).forEach(f => (fp[f] = { ...fieldsProp[f], name: f }));
      if (autoSelectField) {
        return fp;
      } else {
        return { ...fp, [translations.fields.placeholderName]: defaultField };
      }
    }
    const fm: Record<string, Field> = {};
    if (isOptionGroupArray(fields)) {
      fields.forEach(f => f.options.forEach(opt => (fm[opt.name] = opt)));
    } else {
      fields.forEach(f => (fm[f.name] = f));
    }
    return fm;
  }, [autoSelectField, defaultField, fields, fieldsProp, translations.fields.placeholderName]);

  const queryDisabled = useMemo(
    () => disabled === true || (Array.isArray(disabled) && disabled.some(p => p.length === 0)),
    [disabled]
  );
  const disabledPaths = useMemo(() => (Array.isArray(disabled) && disabled) || [], [disabled]);

  const defaultOperator = useMemo(
    (): NameLabelPair => ({
      id: translations.operators.placeholderName,
      name: translations.operators.placeholderName,
      label: translations.operators.placeholderLabel,
    }),
    [translations.operators.placeholderLabel, translations.operators.placeholderName]
  );

  const getOperatorsMain = useCallback(
    (field: string) => {
      const fieldData = fieldMap[field];
      let opsFinal = operators;

      if (fieldData?.operators) {
        opsFinal = fieldData.operators;
      } else if (getOperators) {
        const ops = getOperators(field);
        if (ops) {
          opsFinal = ops;
        }
      }

      if (!autoSelectOperator) {
        if (isOptionGroupArray(opsFinal)) {
          opsFinal = [
            { label: translations.operators.placeholderGroupLabel, options: [defaultOperator] },
            ...opsFinal,
          ];
        } else {
          opsFinal = [defaultOperator, ...opsFinal];
        }
      }

      return isOptionGroupArray(opsFinal) ? uniqOptGroups(opsFinal) : uniqByName(opsFinal);
    },
    [
      autoSelectOperator,
      defaultOperator,
      fieldMap,
      getOperators,
      operators,
      translations.operators.placeholderGroupLabel,
    ]
  );

  const getRuleDefaultOperator = useCallback(
    (field: string) => {
      const fieldData = fieldMap[field];
      if (fieldData?.defaultOperator) {
        return fieldData.defaultOperator;
      }

      if (getDefaultOperator) {
        if (typeof getDefaultOperator === 'function') {
          return getDefaultOperator(field);
        } else {
          return getDefaultOperator;
        }
      }

      const ops = getOperatorsMain(field) ?? /* istanbul ignore next */ [];
      return ops.length
        ? getFirstOption(ops) ?? /* istanbul ignore next */ ''
        : /* istanbul ignore next */ '';
    },
    [fieldMap, getDefaultOperator, getOperatorsMain]
  );

  const getValueEditorTypeMain = useCallback(
    (field: string, operator: string) => {
      if (getValueEditorType) {
        const vet = getValueEditorType(field, operator);
        if (vet) return vet;
      }

      return 'text';
    },
    [getValueEditorType]
  );

  const getValueSourcesMain = useCallback(
    (field: string, operator: string): ValueSources =>
      getValueSourcesUtil(fieldMap[field], operator, getValueSources),
    [fieldMap, getValueSources]
  );

  const getValuesMain = useCallback(
    (field: string, operator: string) => {
      const fieldData = fieldMap[field];
      // Ignore this in tests because Rule already checks for
      // the presence of the values property in fieldData.
      /* istanbul ignore if */
      if (fieldData?.values) {
        return fieldData.values;
      }
      if (getValues) {
        const vals = getValues(field, operator);
        if (vals) return vals;
      }

      return [];
    },
    [fieldMap, getValues]
  );

  const getRuleDefaultValue = useCallback(
    (rule: RuleType) => {
      const fieldData = fieldMap[rule.field];
      if (fieldData?.defaultValue !== undefined && fieldData.defaultValue !== null) {
        return fieldData.defaultValue;
      } else if (getDefaultValue) {
        return getDefaultValue(rule);
      }

      let value: any = '';

      const values = getValuesMain(rule.field, rule.operator);

      if (rule.valueSource === 'field') {
        const filteredFields = filterFieldsByComparator(fieldData, fields, rule.operator);
        if (filteredFields.length > 0) {
          value = getFirstOption(filteredFields);
        } else {
          value = '';
        }
      } else if (values.length) {
        value = getFirstOption(values);
      } else {
        const editorType = getValueEditorTypeMain(rule.field, rule.operator);

        if (editorType === 'checkbox') {
          value = false;
        }
      }

      return value;
    },
    [fieldMap, fields, getDefaultValue, getValueEditorTypeMain, getValuesMain]
  );

  const getInputTypeMain = useCallback(
    (field: string, operator: string) => {
      if (getInputType) {
        const inputType = getInputType(field, operator);
        if (inputType) return inputType;
      }

      return 'text';
    },
    [getInputType]
  );

  const createRule = useCallback((): RuleType => {
    let field = '';
    /* istanbul ignore else */
    if (fields?.length > 0 && fields[0]) {
      field = getFirstOption(fields) ?? /* istanbul ignore next */ '';
    }
    if (getDefaultField) {
      if (typeof getDefaultField === 'function') {
        field = getDefaultField(fields);
      } else {
        field = getDefaultField;
      }
    }

    const operator = getRuleDefaultOperator(field);

    const valueSource = getValueSourcesMain(field, operator)[0] ?? 'value';

    const newRule: RuleType = {
      id: `r-${generateID()}`,
      field,
      operator,
      valueSource,
      value: '',
    };

    const value = getRuleDefaultValue(newRule);

    return { ...newRule, value };
  }, [fields, getDefaultField, getRuleDefaultOperator, getRuleDefaultValue, getValueSourcesMain]);

  const createRuleGroup = useCallback((): RG => {
    if (independentCombinators) {
      return {
        id: `g-${generateID()}`,
        rules: addRuleToNewGroups ? [createRule()] : [],
        not: false,
      } as any;
    }
    return {
      id: `g-${generateID()}`,
      rules: addRuleToNewGroups ? [createRule()] : [],
      combinator: getFirstOption(combinators) ?? /* istanbul ignore next */ '',
      not: false,
    } as any;
  }, [addRuleToNewGroups, combinators, createRule, independentCombinators]);

  const isFirstRender = useRef(true);
  // This state variable is only used when the component is uncontrolled
  const [queryState, setQueryState] = useState(defaultQuery ?? createRuleGroup());
  // We assume here that if `queryProp` is passed in, and it's not the first render,
  // that `queryProp` has already been prepared, i.e. the user is just passing back
  // the `onQueryChange` callback parameter as `queryProp`. This appears to have a huge
  // performance impact.
  const query: RG = queryProp
    ? isFirstRender.current
      ? prepareRuleGroup(queryProp)
      : queryProp
    : queryState;
  isFirstRender.current = false;

  // Run `onQueryChange` on mount, if enabled
  useEffect(() => {
    if (enableMountQueryChange) {
      onQueryChange(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Help prevent `dispatch` from being regenerated on every render
  const queryPropPresent = useMemo(() => !!queryProp, [queryProp]);
  /**
   * Executes the `onQueryChange` function if provided
   * and sets the state when component is uncontrolled
   */
  const dispatch = useCallback(
    (newQuery: RG) => {
      if (!queryPropPresent) {
        setQueryState(newQuery);
      }
      onQueryChange(newQuery);
    },
    [onQueryChange, queryPropPresent]
  );

  const onRuleAdd = useCallback(
    (rule: RuleType, parentPath: number[]) => {
      if (pathIsDisabled(parentPath, query) || queryDisabled) return;
      const newRule = onAddRule(rule, parentPath, query);
      if (!newRule) return;
      const newQuery = add(query, newRule, parentPath);
      dispatch(newQuery);
    },
    [dispatch, onAddRule, queryDisabled, query]
  );

  const onGroupAdd = useCallback(
    (group: RG, parentPath: number[]) => {
      if (pathIsDisabled(parentPath, query) || queryDisabled) return;
      const newGroup = onAddGroup(group, parentPath, query);
      if (!newGroup) return;
      const newQuery = add(query, newGroup, parentPath);
      dispatch(newQuery);
    },
    [dispatch, onAddGroup, queryDisabled, query]
  );

  const onPropChange = useCallback(
    (prop: UpdateableProperties, value: any, path: number[]) => {
      if ((pathIsDisabled(path, query) && prop !== 'disabled') || queryDisabled) return;
      const newQuery = update(query, prop, value, path, {
        resetOnFieldChange,
        resetOnOperatorChange,
        getRuleDefaultOperator,
        getValueSources: getValueSourcesMain,
        getRuleDefaultValue,
      });
      dispatch(newQuery);
    },
    [
      dispatch,
      getRuleDefaultOperator,
      getRuleDefaultValue,
      getValueSourcesMain,
      queryDisabled,
      resetOnFieldChange,
      resetOnOperatorChange,
      query,
    ]
  );

  const onRuleOrGroupRemove = useCallback(
    (path: number[]) => {
      if (pathIsDisabled(path, query) || queryDisabled) return;
      const newQuery = remove(query, path);
      dispatch(newQuery);
    },
    [dispatch, queryDisabled, query]
  );

  const moveRule = useCallback(
    (oldPath: number[], newPath: number[], clone?: boolean) => {
      if (pathIsDisabled(oldPath, query) || pathIsDisabled(newPath, query) || queryDisabled) return;
      const newQuery = move(query, oldPath, newPath, { clone, combinators });
      dispatch(newQuery);
    },
    [combinators, dispatch, queryDisabled, query]
  );

  const { validationResult, validationMap } = useMemo(() => {
    const validationResult = typeof validator === 'function' ? validator(query) : {};
    const validationMap = typeof validationResult === 'object' ? validationResult : {};
    return { validationResult, validationMap };
  }, [query, validator]);

  const classNames = useMemo(
    (): Classnames => ({ ...defaultControlClassnames, ...controlClassnames }),
    [controlClassnames]
  );

  const controls = useMemo(
    (): Controls => ({ ...defaultControlElements, ...controlElements }),
    [controlElements]
  );

  const schema: Schema = useMemo(
    () => ({
      fields,
      fieldMap,
      combinators,
      classNames,
      createRule,
      createRuleGroup,
      onRuleAdd,
      onGroupAdd,
      onRuleRemove: onRuleOrGroupRemove,
      onGroupRemove: onRuleOrGroupRemove,
      onPropChange,
      isRuleGroup,
      controls,
      getOperators: getOperatorsMain,
      getValueEditorType: getValueEditorTypeMain,
      getValueSources: getValueSourcesMain,
      getInputType: getInputTypeMain,
      getValues: getValuesMain,
      moveRule,
      showCombinatorsBetweenRules,
      showNotToggle,
      showCloneButtons,
      showLockButtons,
      autoSelectField,
      autoSelectOperator,
      addRuleToNewGroups,
      enableDragAndDrop,
      independentCombinators: !!independentCombinators,
      validationMap,
      disabledPaths,
    }),
    [
      addRuleToNewGroups,
      autoSelectField,
      autoSelectOperator,
      classNames,
      combinators,
      controls,
      createRule,
      createRuleGroup,
      disabledPaths,
      enableDragAndDrop,
      fieldMap,
      fields,
      getInputTypeMain,
      getOperatorsMain,
      getValueEditorTypeMain,
      getValueSourcesMain,
      getValuesMain,
      independentCombinators,
      moveRule,
      onGroupAdd,
      onPropChange,
      onRuleAdd,
      onRuleOrGroupRemove,
      showCloneButtons,
      showCombinatorsBetweenRules,
      showLockButtons,
      showNotToggle,
      validationMap,
    ]
  );

  const wrapperClassName = useMemo(
    () =>
      c(
        standardClassnames.queryBuilder,
        classNames.queryBuilder,
        query.disabled || queryDisabled ? standardClassnames.disabled : '',
        typeof validationResult === 'boolean'
          ? validationResult
            ? standardClassnames.valid
            : standardClassnames.invalid
          : ''
      ),
    [classNames.queryBuilder, queryDisabled, query.disabled, validationResult]
  );

  useEffect(() => {
    if (debugMode) {
      onLog({ query, queryState, schema });
    }
  }, [debugMode, onLog, queryState, query, schema]);

  return (
    <DndContext.Consumer>
      {() => (
        <div
          className={wrapperClassName}
          data-dnd={enableDragAndDrop ? 'enabled' : 'disabled'}
          data-inlinecombinators={
            independentCombinators || showCombinatorsBetweenRules ? 'enabled' : 'disabled'
          }>
          <controls.ruleGroup
            translations={translations}
            rules={query.rules}
            combinator={'combinator' in query ? query.combinator : undefined}
            schema={schema}
            id={query.id}
            path={[]}
            not={!!query.not}
            disabled={!!query.disabled || queryDisabled}
            parentDisabled={queryDisabled}
            context={context}
          />
        </div>
      )}
    </DndContext.Consumer>
  );
};

QueryBuilderWithoutDndProvider.displayName = 'QueryBuilderWithoutDndProvider';

export const QueryBuilder = <RG extends RuleGroupType | RuleGroupTypeIC>({
  debugMode = false,
  ...props
}: QueryBuilderProps<RG>) => (
  <DndProvider backend={HTML5Backend} debugMode={debugMode}>
    {/* TODO: Should/can the `RG` generic be used here? Would it make a difference? */}
    <QueryBuilderWithoutDndProvider {...(props as QueryBuilderProps)} debugMode={debugMode} />
  </DndProvider>
);

QueryBuilder.displayName = 'QueryBuilder';
