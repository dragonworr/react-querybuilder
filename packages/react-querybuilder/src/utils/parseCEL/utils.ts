import type { DefaultCombinatorName, DefaultOperatorName } from '../../types/index.noReact';
import type {
  CELConditionalAnd,
  CELConditionalOr,
  CELExpression,
  CELExpressionGroup,
  CELIdentifier,
  CELLikeExpression,
  CELLiteral,
  CELMember,
  CELNegation,
  CELNegative,
  CELNumericLiteral,
  CELRelation,
  CELRelop,
  CELStringLiteral,
} from './types';

export const convertRelop = (op: CELRelop) => op.replace(/^==$/, '=') as DefaultOperatorName;

export const isHexadecimal = (val: string) => /^0x[0-9a-f]+$/i.test(val);

export const isCELExpressionGroup = (expr: CELExpression): expr is CELExpressionGroup =>
  expr.type === 'ExpressionGroup';
export const isCELConditionalAnd = (expr: CELExpression): expr is CELConditionalAnd =>
  expr.type === 'ConditionalAnd';
export const isCELConditionalOr = (expr: CELExpression): expr is CELConditionalOr =>
  expr.type === 'ConditionalOr';
export const isCELStringLiteral = (expr: CELExpression): expr is CELStringLiteral =>
  expr.type === 'StringLiteral';
export const isCELLiteral = (expr: CELExpression): expr is CELLiteral =>
  isCELNumericLiteral(expr) ||
  expr.type === 'BooleanLiteral' ||
  expr.type === 'NullLiteral' ||
  expr.type === 'BytesLiteral' ||
  isCELStringLiteral(expr);
export const isCELNumericLiteral = (expr: CELExpression): expr is CELNumericLiteral =>
  expr.type === 'FloatLiteral' ||
  expr.type === 'IntegerLiteral' ||
  expr.type === 'UnsignedIntegerLiteral';
export const isCELRelation = (expr: CELExpression): expr is CELRelation => expr.type === 'Relation';
export const isCELIdentifier = (expr: CELExpression): expr is CELIdentifier =>
  expr.type === 'Identifier';
export const isCELNegation = (expr: CELExpression): expr is CELNegation => expr.type === 'Negation';
export const isCELNegative = (expr: CELExpression): expr is CELNegative => expr.type === 'Negative';
export const isCELMember = (expr: CELExpression): expr is CELMember => expr.type === 'Member';

export const isCELLikeExpression = (expr: CELExpression): expr is CELLikeExpression =>
  isCELMember(expr) &&
  !!expr.left &&
  !!expr.right &&
  !!expr.list &&
  isCELIdentifier(expr.left) &&
  isCELIdentifier(expr.right) &&
  (expr.right.value === 'contains' ||
    expr.right.value === 'startsWith' ||
    expr.right.value === 'endsWith') &&
  expr.list.value.length === 1 &&
  (isCELStringLiteral(expr.list.value[0]) || isCELIdentifier(expr.list.value[0]));

export const evalCELLiteralValue = (literal: CELLiteral) =>
  literal.type === 'StringLiteral'
    ? literal.value.replace(/^(['"]?)(.+?)\1$/, '$2')
    : literal.type === 'BooleanLiteral' || literal.type === 'NullLiteral'
    ? literal.value
    : literal.type === 'IntegerLiteral' || literal.type === 'UnsignedIntegerLiteral'
    ? parseInt(literal.value.replace(/u$/i, ''), isHexadecimal(literal.value) ? 16 : 10)
    : isNaN(parseFloat(literal.value ?? ''))
    ? null
    : parseFloat(literal.value ?? '');

export const normalizeCombinator = (c: '&&' | '||'): DefaultCombinatorName =>
  c === '||' ? 'or' : 'and';

export const normalizeOperator = (
  op: Exclude<CELRelop, 'in'>,
  flip?: boolean
): DefaultOperatorName => {
  if (flip) {
    if (op === '<') return '>';
    if (op === '<=') return '>=';
    if (op === '>') return '<';
    if (op === '>=') return '<=';
  }
  if (op === '==') return '=';
  return op;
};

export const generateFlatAndOrList = (
  expr: CELConditionalAnd | CELConditionalOr
): (DefaultCombinatorName | CELExpression)[] => {
  const combinator = normalizeCombinator(expr.type === 'ConditionalAnd' ? '&&' : '||');
  const { left, right } = expr;
  if (isCELConditionalAnd(left) || isCELConditionalOr(left)) {
    return [...generateFlatAndOrList(left), combinator, right];
  }
  return [left, combinator, right];
};

export const generateMixedAndOrList = (expr: CELConditionalAnd | CELConditionalOr) => {
  const arr = generateFlatAndOrList(expr);
  const returnArray: (DefaultCombinatorName | CELExpression | ('and' | CELExpression)[])[] = [];
  let startIndex = 0;
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1] === 'and') {
      startIndex = i;
      let j = 1;
      while (arr[startIndex + j] === 'and') {
        i += 2;
        j += 2;
      }
      const tempAndArray = arr.slice(startIndex, i + 1) as ('and' | CELExpression)[];
      returnArray.push(tempAndArray);
      i -= 2;
    } else if (arr[i + 1] === 'or') {
      if (i === 0 || i === arr.length - 3) {
        if (i === 0 || arr[i - 1] === 'or') {
          returnArray.push(arr[i]);
        }
        returnArray.push(arr[i + 1]);
        if (i === arr.length - 3) {
          returnArray.push(arr[i + 2]);
        }
      } else {
        if (arr[i - 1] === 'and') {
          returnArray.push(arr[i + 1]);
        } else {
          returnArray.push(arr[i]);
          returnArray.push(arr[i + 1]);
        }
      }
    }
  }
  if (returnArray.length === 1 && Array.isArray(returnArray[0])) {
    // If length is 1, then the only element is an AND array so just return that
    return returnArray[0];
  }
  return returnArray;
};
