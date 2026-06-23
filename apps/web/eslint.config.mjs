import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  resolvePluginsRelativeTo: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
