import { FlatCompat } from '@eslint/eslintrc'
import pluginQuery from '@tanstack/eslint-plugin-query'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...pluginQuery.configs['flat/recommended'],
  ...compat.plugins('react', '@next/next', 'simple-import-sort', 'prettier/recommended', '@stylistic'),
  ...compat.config({
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      'prefer-arrow-callback': 'error',
      'no-useless-return': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration'],
      semi: ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'jsx-quotes': ['error', 'prefer-double'],
      'react/jsx-sort-props': [
        2,
        {
          callbacksLast: false,
          shorthandFirst: false,
          shorthandLast: false,
          multiline: 'ignore',
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          locale: 'en',
        },
      ],
    },
  }),
]

export default eslintConfig
