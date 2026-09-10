# packages/validation

এই package-এ **শুধুমাত্র** cross-app reusable Zod schemas রাখা হবে।

## কোন schema এখানে রাখা উচিত?

- ✅ Multiple apps-এ (web + mobile + API) একই validation logic দরকার হলে।
- ✅ Shared business rules যেমন: UUID format, email format, URL format।
- ❌ App-specific form validation (Next.js web form error messages)।
- ❌ Feature-specific schemas (todo, auth) — এগুলো `apps/web/schema/` তে থাকবে।

## বর্তমান অবস্থা

বর্তমানে সব Zod schema `apps/web/schema/` এ আছে এবং শুধু web app ব্যবহার করে।
যখন নতুন app (mobile/API) যোগ হবে এবং shared validation দরকার হবে, তখন সেই schema এখানে move করতে হবে।

## Structure (ভবিষ্যতে)

```
packages/validation/
├── src/
│   ├── common.ts       # UUID, email, URL etc. shared primitives
│   └── index.ts        # barrel exports
├── package.json
└── tsconfig.json
```
