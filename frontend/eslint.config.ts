import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    tseslint.configs.strictTypeChecked,
    {
        name: 'typescript-eslint overrides',
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    { ignores: ["src/openapi/**"] },  
    {
        files: ["src/**/*.{ts,tsx}"],
        rules: {
            // Naming convention
            '@typescript-eslint/naming-convention': ['warn', {
                selector: 'import',
                format: ['camelCase', 'PascalCase'],
            }],

            // General rules
            curly: ["error", "multi-line"],
            eqeqeq: 'warn',
            'no-throw-literal': 'warn',
            semi: 'warn',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // requires `strictNullChecks` to be enabled
            '@typescript-eslint/no-unnecessary-condition': 'off', // requires `strictNullChecks` to be enabled
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/prefer-regexp-exec': 'error',
            '@typescript-eslint/restrict-plus-operands': [
                'error',
                {
                    allowAny: false,
                    allowBoolean: false,
                    allowNullish: false,
                    allowNumberAndString: true,
                    allowRegExp: false,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true, allowBoolean: true },
            ],
            '@typescript-eslint/switch-exhaustiveness-check': [
                'error',
                {
                    considerDefaultExhaustiveForUnions: true, // we consider default cases for unions valid
                    requireDefaultForNonUnion: true,
                },
            ],
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/unified-signatures': 'off',
        },
    },
);
