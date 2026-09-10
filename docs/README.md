# 📚 Todo Application — সম্পূর্ণ সিস্টেম ডকুমেন্টেশন ও গাইড (Bangla Documentation)

স্বাগতম! এই ডিরেক্টরিটি আমাদের **Todo Application (MEO Tool Monorepo Architecture Blueprint)**-এর সম্পূর্ণ প্রযুক্তিগত ও আর্কিটেকচারাল ডকুমেন্টেশন সমৃদ্ধ।

একজন নতুন (Beginner) ডেভেলপার বা দলনেতা যাতে সহজেই বুঝতে পারেন যে কীভাবে একটি আধুনিক, স্কেলেবল, এন্টারপ্রাইজ-গ্রেড Next.js অ্যাপ্লিকেশন তৈরি করা হয়েছে—তার জন্য প্রতিটি ডকুমেন্ট অত্যন্ত সহজবোধ্য বাংলা ভাষায় এবং চিত্রসহ সাজানো হয়েছে।

---

## 🗂️ ডকুমেন্টেশনের সূচিপত্র (Table of Contents)

### ১. আর্কিটেকচারাল সিদ্ধান্তসমূহ — ADR (Architectural Decision Records)
প্রজেক্ট তৈরির সময় নেওয়া গুরুত্বপূর্ণ প্রযুক্তিগত সিদ্ধান্ত ও তাদের পেছনের কারণ:
- 🏢 [ADR 001: মনোরেপো কাঠামো ও রুট-লোকাল অর্গানাইজেশন](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/001-monorepo-structure.md) — কেন গ্লোবাল ফোল্ডারের পরিবর্তে রুট-লোকাল (`_components`, `_lib`) প্যাটার্ন বেছে নেওয়া হয়েছে।
- 🧱 [ADR 002: লেয়ার্ড সার্ভিস-রিপোজিটরি প্যাটার্ন](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/002-layered-architecture.md) — UI → Server Action → Domain Service → Repository → Database আর্কিটেকচার।
- 🔐 [ADR 003: অথেনটিকেশন ও ক্রিপ্টোগ্রাফিক টোকেন শেয়ারিং](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/003-auth-and-paseto.md) — Better Auth সেশন এবং PASETO v4 Local দিয়ে ডাটাবেস-লেস পাবলিক টুডু শেয়ারিং।
- 🌐 [ADR 004: এক্সটার্নাল API প্রোভাইডার আইসোলেশন ও ফলব্যাক](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/004-isolated-providers.md) — OpenAI, AWS S3, Geoapify, Instagram ইত্যাদির মক ফলব্যাক এবং অফলাইন সাপোর্ট।
- 🗄️ [ADR 005: ডাটাবেস স্কিমা ও Drizzle ORM রিপোজিটরি](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/005-database-and-drizzle.md) — টাইপ-সেফ Drizzle ORM, মাইগ্রেশন এবং ইউজার আইসোলেশন।

---

### ২. সিস্টেম ডিজাইন ও স্থাপত্য (Design & Architecture)
সিস্টেম কীভাবে কাজ করে এবং ডেটা কীভাবে প্রবাহিত হয়:
- 🏛️ [আর্কিটেকচার ওভারভিউ ও সিস্টেম টপোলজি](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/design/architecture-overview.md) — ৫-স্তরের সিস্টেম ডায়াগ্রাম এবং ৩টি অপরিবর্তনীয় মূল নীতি।
- 🔌 [প্রোভাইডার অ্যাবস্ট্রাকশন ও ফল্ট টলারেন্স](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/design/provider-abstraction.md) — থার্ড-পার্টি সার্ভিস বন্ধ থাকলেও অ্যাপ ক্র্যাশ না করার কৌশল ও ম্যাট্রিক্স।
- 🔄 [সিস্টেমের সিকোয়েন্স ফ্লো](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/design/system-flow.md) — লগইন গার্ড, টুডু তৈরি এবং PASETO শেয়ারিংয়ের পর্যায়ক্রমিক সিকোয়েন্স ডায়াগ্রাম।

---

### ৩. সিস্টেমের রিকোয়ারমেন্টস (Requirements)
অ্যাপ্লিকেশনের কার্যকরী ও গুণগত চাহিদাসমূহ:
- 📋 [ফাংশনাল রিকোয়ারমেন্টস স্পেসিফিকেশন (FRS)](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/requirements/functional-requirements.md) — ইউজার যা যা করতে পারেন (লগইন, টুডু ম্যানেজমেন্ট, AI প্ল্যানিং, লোকেশন, ইমেজ অপটিমাইজেশন, শেয়ারিং)।
- 🛡️ [নন-ফাংশনাল রিকোয়ারমেন্টস স্পেসিফিকেশন (NFRS)](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/requirements/non-functional-requirements.md) — সিকিউরিটি, পারফরম্যান্স, ক্লিন কোড এবং টেস্টিং মানদণ্ড।

---

### ৪. প্র্যাকটিক্যাল ইউজ কেসসমূহ (Use Cases)
বাস্তবে ব্যবহারকারী কীভাবে বিভিন্ন ফিচার ব্যবহার করেন তার পুঙ্খানুপুঙ্খ বিবরণ:
- 👑 [ইউজ কেস: অ্যাডমিন রোল ও ইউজার ডিরেক্টরি অডিটিং](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/admin-auditing.md)
- 📍 [ইউজ কেস: জিওলোকেশন ও সোশ্যাল মিডিয়া ইন্টিগ্রেশন](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/geo-and-social-integration.md)
- 🔗 [ইউজ কেস: ক্রিপ্টোগ্রাফিক শেয়ারিং ও পাবলিক অ্যাক্সেস](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/sharing-and-security.md)
- ✅ [ইউজ কেস: টুডু লাইফসাইকেল ও AI অ্যাসিস্ট্যান্স](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/todo-management.md)
- 🔑 [ইউজ কেস: ইউজার অথেনটিকেশন ও প্রোফাইল ম্যানেজমেন্ট](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/user-auth-and-profile.md)

---

## 💡 বিগিনারদের জন্য পড়ার নির্দেশিকা (How to Start Reading)

1. **ধাপ ১:** প্রথমে [আর্কিটেকচার ওভারভিউ](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/design/architecture-overview.md) পড়ে পুরো প্রজেক্টের সামগ্রিক কাঠামো বুঝে নিন।
2. **ধাপ ২:** এরপর [ADR 001](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/001-monorepo-structure.md) ও [ADR 002](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/adr/002-layered-architecture.md) পড়ে বুঝতে পারবেন কোড ফাইলগুলো কেন এভাবে সাজানো হয়েছে।
3. **ধাপ ৩:** [সিস্টেমের সিকোয়েন্স ফ্লো](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/design/system-flow.md) দেখে বুঝে নিন কীভাবে ফ্রন্টএন্ড ফর্ম থেকে ডেটা ডাটাবেসে যায়।
4. **ধাপ ৪:** প্রতিটি ফিচারের বিস্তারিত কাজের ধাপ দেখতে [Use Cases](file:///c:/Users/Tplus_staff/Desktop/Todo-App/todo-project/docs/use-cases/todo-management.md) দেখে নিন।
