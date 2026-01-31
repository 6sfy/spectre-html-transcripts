import type { ReactNode } from 'react';
import type { ASTNode } from 'simple-markdown';
import type { State } from './types';

type AdditionalRule = Partial<any> & {
  react: (node: ASTNode, output: (node: ASTNode, state?: unknown) => string, state: State) => ReactNode;
};

export const extend = (additionalRules: AdditionalRule, defaultRule: any): AdditionalRule => {
  return Object.assign({}, defaultRule, additionalRules);
};
