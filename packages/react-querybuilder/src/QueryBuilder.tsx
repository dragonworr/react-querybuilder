import { enableES5 } from 'immer';
import type { ClassAttributes } from 'react';
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
  c,
  filterFieldsByComparator,
  generateID,
  getFirstOption,
  getValueSourcesUtil,
  isOptionGroupArray,
  isRuleGroup,
  move,
  objectKeys,
  pathIsDisabled,
  prepareRuleGroup,
  remove,
  uniqByName,
  uniqOptGroups,
  update,
} from './utils';

enableES5();

export const QueryBuilderWithoutDndProvider = <RG extends RuleGroupType | RuleGroupTypeIC>({
  debugMode = false,
  defaultQuery,
  query,
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
  // We assume here that if `query` is passed in, and it's not the first render,
  // that `query` has already been prepared, i.e. the user is just passing back
  // the `onQueryChange` callback parameter as `query`. This appears to have a huge
  // performance impact.
  const root: RG = query ? (isFirstRender.current ? prepareRuleGroup(query) : query) : queryState;
  isFirstRender.current = false;

  // Run `onQueryChange` on mount, if enabled
  useEffect(() => {
    if (enableMountQueryChange) {
      onQueryChange(root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Executes the `onQueryChange` function if provided
   * and sets the state when component is uncontrolled
   */
  const dispatch = useCallback(
    (newQuery: RG) => {
      if (!query) {
        setQueryState(newQuery);
      }
      onQueryChange(newQuery);
    },
    [onQueryChange, query]
  );

  const onRuleAdd = (rule: RuleType, parentPath: number[]) => {
    if (pathIsDisabled(parentPath, root) || queryDisabled) return;
    const newRule = onAddRule(rule, parentPath, root);
    if (!newRule) return;
    const newQuery = add(root, newRule, parentPath);
    dispatch(newQuery);
  };

  const onGroupAdd = (group: RG, parentPath: number[]) => {
    if (pathIsDisabled(parentPath, root) || queryDisabled) return;
    const newGroup = onAddGroup(group, parentPath, root);
    if (!newGroup) return;
    const newQuery = add(root, newGroup, parentPath);
    dispatch(newQuery);
  };

  const onPropChange = (prop: UpdateableProperties, value: any, path: number[]) => {
    if ((pathIsDisabled(path, root) && prop !== 'disabled') || queryDisabled) return;
    const newQuery = update(root, prop, value, path, {
      resetOnFieldChange,
      resetOnOperatorChange,
      getRuleDefaultOperator,
      getValueSources: getValueSourcesMain,
      getRuleDefaultValue,
    });
    dispatch(newQuery);
  };

  const onRuleOrGroupRemove = (path: number[]) => {
    if (pathIsDisabled(path, root) || queryDisabled) return;
    const newQuery = remove(root, path);
    dispatch(newQuery);
  };

  const moveRule = (oldPath: number[], newPath: number[], clone?: boolean) => {
    if (pathIsDisabled(oldPath, root) || pathIsDisabled(newPath, root) || queryDisabled) return;
    const newQuery = move(root, oldPath, newPath, { clone, combinators });
    dispatch(newQuery);
  };

  const { validationResult, validationMap } = useMemo(() => {
    const validationResult = typeof validator === 'function' ? validator(root) : {};
    const validationMap = typeof validationResult === 'object' ? validationResult : {};
    return { validationResult, validationMap };
  }, [root, validator]);

  const classNames = useMemo(
    (): Classnames => ({ ...defaultControlClassnames, ...controlClassnames }),
    [controlClassnames]
  );

  const controls = useMemo(
    (): Controls => ({ ...defaultControlElements, ...controlElements }),
    [controlElements]
  );

  const schema: Schema = {
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
  };

  const wrapperClassName = useMemo(
    () =>
      c(
        standardClassnames.queryBuilder,
        classNames.queryBuilder,
        root.disabled || queryDisabled ? standardClassnames.disabled : '',
        typeof validationResult === 'boolean'
          ? validationResult
            ? standardClassnames.valid
            : standardClassnames.invalid
          : ''
      ),
    [classNames.queryBuilder, queryDisabled, root.disabled, validationResult]
  );

  const rqbRef: ClassAttributes<HTMLDivElement>['ref'] = useRef(null);

  const log = useMemo(
    () =>
      process.env.NODE_ENV === 'test'
        ? (r: any) => {
            const div = document?.createElement('div');
            div.innerHTML = JSON.stringify(r, null, 2);
            rqbRef.current?.appendChild(div);
          }
        : /* istanbul ignore next */ console.log,
    []
  );

  if (debugMode) {
    // TODO: log more information
    log({ root, queryState });
  }

  return (
    <DndContext.Consumer>
      {() => (
        <div
          ref={rqbRef}
          className={wrapperClassName}
          data-dnd={enableDragAndDrop ? 'enabled' : 'disabled'}
          data-inlinecombinators={
            independentCombinators || showCombinatorsBetweenRules ? 'enabled' : 'disabled'
          }>
          <controls.ruleGroup
            translations={translations}
            rules={root.rules}
            combinator={'combinator' in root ? root.combinator : undefined}
            schema={schema}
            id={root.id}
            path={[]}
            not={!!root.not}
            disabled={!!root.disabled || queryDisabled}
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
