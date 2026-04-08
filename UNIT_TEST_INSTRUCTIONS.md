# Claude Code: Unit Test Generation Prompt

Write comprehensive unit tests for all components and hooks in the following directories:

1. `mobile/src/ui/` — all UI components
2. `mobile/src/hooks/` — all custom hooks
3. `shared/components/` — all shared components
4. `shared/hooks/` — all shared hooks

## Requirements

- Place ALL test files for shared in `mobile/src/tests/` — there is already an example test file there; follow its naming conventions, import patterns, and structure exactly.
- Use the same testing libraries and configuration as the existing example test.
- Achieve **≥80% code coverage** (statements, branches, functions, lines) for every file under test.
- Every test file must be **free of TypeScript errors** (`npx tsc --noEmit` must pass) and **free of linting errors** (`npx eslint` must pass on all test files).
- Mock external dependencies, navigation, API calls, and native modules as needed.
- For hooks, use `@testing-library/react-hooks` or `renderHook` from `@testing-library/react-native` (whichever the project uses).
- For components, use `@testing-library/react-native` with `render`, `fireEvent`, `waitFor`, etc.
- Test all meaningful branches: success/error states, loading states, edge cases, empty/null props, user interactions, and conditional renders.
- Name test files as `<ComponentOrHookName>.test.tsx` (or `.test.ts` for pure logic hooks).

## Workflow

1. First, read the existing example test in `mobile/src/tests/` to understand conventions.
2. Read `mobile/package.json`, `mobile/tsconfig.json`, `mobile/jest.config.*`, and any test setup files to understand the project's test infrastructure.
3. List all files in `mobile/src/ui/`, `mobile/src/hooks/`, `shared/components/`, and `shared/hooks/`.
4. Read each source file to understand its props, state, logic, and edge cases.
5. Write the test files one by one in `mobile/src/tests/`.
6. After writing all tests, run `npm run test:mobile:coverage ` from the root directory.
7. Check `mobile/coverage/index.html` — verify every file from the four source directories meets ≥80% coverage on all metrics.
8. If any file is below 80%, add more tests until the threshold is met.
9. Run `npx tsc --noEmit` and `npx eslint mobile/src/tests/` — fix any errors until both pass cleanly.
10. Do a final coverage run and confirm the 80% threshold is met across the board.

## Completion Criteria

Do not consider the task complete until:

- All tests pass (`jest` exits 0)
- Coverage ≥80% for every source file (verified via `mobile/coverage/index.html`)
- Zero TypeScript errors
- Zero linting errors
