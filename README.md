# React + TypeScript + Vite

## การยืนยันตัวตนสำหรับนักศึกษา

ผู้ใช้เข้าสู่ระบบด้วย **รหัสนักศึกษา** และรหัสผ่านเท่านั้น ไม่มีช่องอีเมลในหน้าเว็บ
แอปสร้างอีเมลภายในจากรหัสนักศึกษาเพื่อให้ Supabase Auth ทำงานได้ โดยผู้ใช้จะไม่เห็น
หรือกรอกอีเมลนี้

ก่อนเปิดใช้จริง ให้ปิด **Confirm email** ใน Supabase Auth เพื่อไม่ให้ระบบส่งลิงก์
ยืนยันไปยังอีเมลภายใน และรัน `supabase/schema.sql` กับฐานข้อมูลใหม่เพื่อสร้างคอลัมน์
`student_id` (unique) และ `full_name` ในตาราง `profiles`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
