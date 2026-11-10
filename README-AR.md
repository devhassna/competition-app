# القالب الجاهز: موقع + أندرويد + سطح مكتب (كود واحد)

التقنيات: React + Vite (الواجهة) · Supabase (قاعدة البيانات والحسابات) · Capacitor (أندرويد) · Electron (سطح المكتب)

## 0) المتطلبات
Node.js (نسخة LTS) · Git · VS Code · Android Studio (للأندرويد فقط)

## 1) التثبيت (مرة واحدة)
```bash
cd template-app
npm install
```
(إن كان المجلد منسوخا من فلاش فيه node_modules من جهاز آخر بنظام مختلف: احذفي node_modules ثم npm install)

## 2) ربط قاعدة البيانات (Supabase)
1. أنشئي حسابا على supabase.com ثم New project.
2. من Project Settings ثم API: انسخي Project URL و anon public key.
3. انسخي الملف `.env.example` باسم `.env` وضعي القيمتين فيه.
4. من SQL Editor: الصقي محتوى `supabase.sql` ثم Run. هذا ينشئ جدول tasks.
5. (اختياري للتجربة السريعة) من Authentication ثم Providers ثم Email: عطّلي Confirm email.

## 3) التشغيل أثناء التطوير
```bash
npm run dev
```
افتحي الرابط الظاهر (غالبا http://localhost:5173).

## 4) الصيغة الأولى: الموقع
```bash
npm run build
```
ارفعي المشروع إلى GitHub ثم اربطيه بـ Vercel أو Netlify.
إعدادات النشر: Build command = `npm run build` ، Output directory = `dist`.
وأضيفي متغيري `.env` في إعدادات Environment Variables بالموقع.

## 5) الصيغة الثانية: أندرويد (مرة واحدة)
```bash
npx cap add android
```
وفي كل مرة بعد التعديل:
```bash
npm run android
```
هذا يبني ويزامن ويفتح Android Studio. ثم: Build ثم Build Bundle(s)/APK(s) ثم Build APK.
الملف يكون في `android/app/build/outputs/apk/debug/`.

## 6) الصيغة الثالثة: سطح المكتب
للتجربة:
```bash
npm run electron
```
لإخراج ملف التثبيت:
```bash
npm run dist
```
النتيجة في مجلد `release`. (ملف exe يُبنى على Windows، و dmg على Mac، و AppImage على Linux.)

## 7) كيف أحوّل القالب لحل مشكلة المسابقة؟
1. صمّمي الجداول على الورق (ما الكيانات؟ ما العلاقات؟).
2. عدّلي `supabase.sql` لتناسب جداولك ونفّذيه.
3. انسخي `src/pages/Home.jsx` لكل صفحة جديدة وغيّري اسم الجدول والحقول.
4. أضيفي مساراتها في `src/App.jsx` داخل `<Routes>`.
5. غيّري الألوان من أعلى `src/index.css`.
6. غيّري الاسم والمعرّف: `package.json` (productName, appId) و `capacitor.config.json` و `index.html` (title).

## 8) قواعد لا تنسيها
- `HashRouter` وليس BrowserRouter. و `base: './'` في vite.config.js. لا مسارات مطلقة للصور.
- لا ترفعي ملف `.env` إلى GitHub (موجود في .gitignore).
- بعد كل تعديل على الكود للتطبيقات: `npm run build` ثم `npx cap sync` (أو استعملي `npm run android`).
- اعملي `git commit` كل ساعتين.

## 9) إن تعطل شيء
| المشكلة | الحل |
|---|---|
| شاشة بيضاء في Electron أو الأندرويد | تأكدي من base: './' ومن HashRouter ثم أعيدي build |
| خطأ عند الدخول أو القراءة من القاعدة | تحققي من .env ومن سياسات RLS في supabase.sql |
| لا يظهر شيء بعد الإضافة | افتحي Console في المتصفح (F12) واقرئي الخطأ |
| npm install بطيء | استعملي النسخة المضغوطة التي فيها node_modules |
