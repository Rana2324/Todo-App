# প্রোভাইডার অ্যাবস্ট্রাকশন ও ফল্ট টলারেন্স (Provider Abstraction & Fault Tolerance)

> **ফল্ট টলারেন্স (Fault Tolerance) কী?**  
> সিস্টেমের কোনো একটি অংশ (যেমন: নেটওয়ার্ক সমস্যা বা বাইরের কোনো API সার্ভার ডাউন) ফেইল করলেও পুরো অ্যাপ্লিকেশন ক্র্যাশ না করে নিরাপদে বিকল্প ব্যবস্থা গ্রহণ করার সক্ষমতাকে ফল্ট টলারেন্স বলে।

বাস্তব জীবনের প্রোডাকশন অ্যাপ্লিকেশনে বাইরের বহু সেবার (OpenAI, AWS S3, Google Places, Meta) উপর নির্ভর করতে হয়। যদি এই থার্ড-পার্টি সার্ভিসগুলোর কোনো একটি সাময়িক বন্ধ থাকে বা ডেভেলপার মেশিনে API Key না থাকে, তবুও যেন অ্যাপের কাজ ব্যাহত না হয়—সেজন্যই এই প্রোভাইডার অ্যাবস্ট্রাকশন তৈরি করা হয়েছে।

---

## 📊 প্রোভাইডার ওভারভিউ ম্যাট্রিক্স (Provider Matrix)

| প্রোভাইডার | কোড ফাইল লোকেশন | মূল প্রযুক্তি / ভেন্ডর | ফলব্যাক স্ট্র্যাটেজি (Fallback Strategy) | প্রাথমিক ব্যবহারকারী |
|---|---|---|---|---|
| **OpenAI** | `lib/providers/openai.ts` | OpenAI REST API (`gpt-4o-mini`) | চমৎকার ও প্রাসঙ্গিক মক টাস্ক সাজেশন রিটার্ন করে | `lib/ai/ai.service.ts` |
| **AWS S3 / Sharp** | `lib/providers/s3.ts` | AWS S3 SDK + Sharp | Sharp দিয়ে WebP ফরম্যাটে রূপান্তর করে লোকাল ফোল্ডারে (`public/uploads/`) সেভ করে | `lib/services/upload.service.ts` |
| **Geoapify** | `lib/providers/geoapify.ts` | Geoapify Geocoding & Places API | ডামি স্থান ও ক্যাফের তালিকা থেকে কুয়েরি অনুযায়ী ফিল্টার করে দেয় | `lib/services/place.service.ts` |
| **Google Business** | `lib/providers/google-business.ts` | Google My Business API | রেস্তোরাঁ বা স্থানের ডামি স্টার রেটিং, রিভিউ সংখ্যা ও খোলার সময় দেয় | `lib/services/gbp.service.ts` |
| **Instagram / Meta** | `lib/providers/instagram.ts` | Meta Graph API | স্থানের প্রাসঙ্গিক ইনস্টাগ্রাম ফটো ও ক্যাপশনের ডামি গ্রিড পাঠায় | `lib/services/instagram.service.ts` |

---

## 🛠️ প্রোভাইডার ডিজাইনের ৩টি মূল নিয়ম (Design Rules)

### ১. কনফিগারেশন চেকিং (`lib/env.ts`):
- কোনো প্রোভাইডার কল করার আগে হেল্পার ফাংশন দিয়ে যাচাই করা হয়:
  ```typescript
  export function isOpenAiConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "");
  }
  ```
- এনভায়রনমেন্ট ভেরিয়েবল না থাকলে কোনো অপ্রয়োজনীয় নেটওয়ার্ক রিকোয়েস্ট না পাঠিয়ে শুরুতেই ব্যাকআপ মোডে চলে যায়।

### ২. নো-ক্র্যাশ পলিসি (Zero Throw Contract):
- কোনো বাহ্যিক API কল ব্যর্থ হলে (যেমন: রিকোয়েস্ট টাইমআউট, লিমিট শেষ হওয়া বা অবৈধ রেসপন্স) সার্ভিস কখনই স্ক্রিনে কোনো রেড এরর স্ক্রিন থ্রো করে না।
- বরং এটি ইন্টারনাল ট্র্যাকিংয়ে সতর্কবার্তা রেকর্ড করে এবং ব্যবহারকারীকে সুন্দর মক ডাটা প্রদর্শন করে।

### ৩. টাইপ কনভার্সন ও পরিচ্ছন্নতা (Strict Domain Typing):
- বাইরের বিভিন্ন API-এর ডেটা ফরম্যাট ভিন্ন ভিন্ন হয় (যেমন snake_case, camelCase ইত্যাদি)।
- প্রোভাইডার লেয়ার সেই ডেটাকে ক্লিন করে আমাদের অ্যাপ্লিকেশনের নিজস্ব ডোমেইন টাইপে (`lib/domain/place.ts`, `lib/domain/todo.ts`) রূপান্তর করে ফ্রন্টএন্ডে পাঠায়।
