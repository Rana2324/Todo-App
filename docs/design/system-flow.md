# সিস্টেমের সিকোয়েন্স ফ্লো (System Sequence Flows)

এই ডকুমেন্টে অ্যাপ্লিকেশনের তিনটি সবচেয়ে গুরুত্বপূর্ণ কাজের পর্যায়ক্রমিক প্রবাহ (Step-by-Step Sequence Flow) সহজ ডায়াগ্রাম ও ব্যাখ্যাসহ দেওয়া হলো।

---

## ১. অথেনটিকেশন ও সুরক্ষিত রুট অ্যাক্সেস (Authentication & Route Guard)

ব্যবহারকারী কীভাবে লগইন করেন এবং লগইন ছাড়া কেউ সুরক্ষিত পেজে যেতে চাইলে সিস্টেম কীভাবে তা প্রতিহত করে:

```mermaid
sequenceDiagram
    autonumber
    actor User as ব্যবহারকারী
    participant Browser as ব্রাউজার (Browser)
    participant Proxy as proxy.ts (সিকিউরিটি গার্ড)
    participant AuthRoute as /api/auth/[...all]
    participant BetterAuth as Better Auth ইঞ্জিন
    participant DB as Postgres ডাটাবেস

    User->>Browser: ইমেইল ও পাসওয়ার্ড লিখে "Login" বাটনে চাপ দেন
    Browser->>AuthRoute: POST রিকোয়েস্ট পাঠান { email, password }
    AuthRoute->>BetterAuth: ক্রেডেনশিয়াল ভ্যালিডেট করার অনুরোধ
    BetterAuth->>DB: ইউজার রেকর্ড খোঁজা ও পাসওয়ার্ড হ্যাশ যাচাই
    DB-->>BetterAuth: সঠিক ইউজার রেকর্ড পাওয়া গেছে
    BetterAuth->>DB: নতুন সেশন টোকেন তৈরি ও সেভ করা
    BetterAuth-->>Browser: Set-Cookie: better-auth.session_token (HttpOnly)
    Browser-->>User: ড্যাশবোর্ডে (/todos) রিডাইরেক্ট করা হয়

    Note over User,DB: সুরক্ষিত পেজ ভিজিট করার সময়
    User->>Browser: /todos পেজ খুলতে চান
    Browser->>Proxy: GET /todos (কুকি সহ)
    Proxy->>Proxy: কুকিতে সেশন টোকেন আছে কিনা চেক করা হয়
    alt সেশন কুকি না থাকলে
        Proxy-->>Browser: ৩০২ রিডাইরেক্ট করে /login পেজে পাঠিয়ে দেয়
    else সেশন কুকি উপস্থিত থাকলে
        Proxy-->>Browser: সুরক্ষিত সার্ভার পেজ রেন্ডার করে দেখায়
    end
```

---

## ২. টুডু তৈরি ও ভ্যালিডেশন লাইফসাইকেল (Todo Creation & Lifecycle)

একটি নতুন টুডু ইনপুট দেওয়ার পর কীভাবে সেটি ডাটাবেসে সেভ হয়ে স্ক্রিনে আসে:

```mermaid
sequenceDiagram
    autonumber
    actor User as ব্যবহারকারী
    participant Form as TodoForm.tsx (UI)
    participant Action as actions.ts (Server Action)
    participant Zod as schema/todo.ts (Validation)
    participant Service as todo.service.ts (Business Logic)
    participant Repo as todo.repository.ts (DB Query)
    participant DB as Postgres ডাটাবেস

    User->>Form: টাইটেল ও বিবরণ লিখে "Add" চাপেন
    Form->>Action: invoke createTodoAction({ title, body })
    Action->>Action: requireUserId() দিয়ে সেশন ও ইউজার আইডি নিশ্চিত করে
    Action->>Zod: createTodoSchema দিয়ে ডেটার সাইজ ও টাইপ চেক
    Zod-->>Action: ভ্যালিডেট করা নিরাপদ ডেটা
    Action->>Service: todoService.create(userId, validatedData)
    Service->>Repo: todoRepository.insert(userId, validatedData)
    Repo->>DB: INSERT INTO todos (user_id, title, ...) VALUES (...)
    DB-->>Repo: নতুন সেভ হওয়া রো (Row) ফেরত দেয়
    Repo-->>Service: Raw DB Row
    Service->>Service: toTodoType() দিয়ে ক্লিন অবজেক্টে রূপান্তর
    Service-->>Action: প্রস্তুতকৃত ডোমেন মডেল ফেরত দেয়
    Action->>Action: revalidatePath("/todos") কল করে পেজ ক্যাশ আপডেট করে
    Action-->>Form: সফল রেসপন্স পাঠায়
    Form-->>User: স্ক্রিনে নতুন টুডু আইটেমটি প্রদর্শিত হয়
```

---

## ৩. PASETO ক্রিপ্টোগ্রাফিক শেয়ারিং প্রবাহ (PASETO Share Flow)

ডাটাবেসে কোনো অতিরিক্ত শেয়ার টেবিল ছাড়াই কীভাবে নিরাপদে টুডু বাইরের বন্ধুদের সাথে শেয়ার করা যায়:

```mermaid
sequenceDiagram
    autonumber
    actor Owner as টুডুর মালিক
    actor Recipient as সাধারণ পাবলিক ভিজিটর
    participant UI as TodoItem.tsx
    participant ShareAction as actions.ts
    participant ShareService as share.service.ts
    participant Paseto as lib/paseto.ts
    participant SharePage as /share/[token]/page.tsx

    Owner->>UI: টুডু আইটেমে "Share" বাটনে চাপেন
    UI->>ShareAction: shareTodoAction(todoId)
    ShareAction->>ShareService: createShareLink(userId, todoId)
    ShareService->>ShareService: মালিকানা যাচাই (ইউজার আসলেই এই টুডুর মালিক কি না)
    ShareService->>Paseto: signShareToken({ todoId })
    Paseto-->>ShareService: এনক্রিপ্টেড সুরক্ষিত টোকেন "v4.local.XXXX..."
    ShareService-->>UI: শেয়ার লিংক তৈরি: "/share/v4.local.XXXX..."
    UI-->>Owner: ক্লিপবোর্ডে লিংক কপি করার অপশন দেয়

    Note over Recipient,SharePage: বাইরের যে কেউ লিংকে ঢুকলে
    Recipient->>SharePage: ব্রাউজারে লিংক ওপেন করেন GET /share/v4.local.XXXX...
    SharePage->>ShareService: getSharedTodo(token)
    ShareService->>Paseto: verifyShareToken(token) দিয়ে ডিক্রিপ্ট করা হয়
    alt টোকেন মেয়াদোত্তীর্ণ বা বিকৃত (Tampered) হলে
        Paseto-->>ShareService: null
        ShareService-->>SharePage: null
        SharePage-->>Recipient: "Invalid or Expired Link" / 404 পেজ দেখায়
    else টোকেন শতভাগ আসল হলে
        Paseto-->>ShareService: অরিজিনাল পেলোড { todoId }
        ShareService->>SharePage: টুডু অবজেক্ট পাঠায়
        SharePage-->>Recipient: রিড-অনলি টুডু কার্ড প্রদর্শন করে
    end
```
