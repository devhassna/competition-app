تشغيل:
npm run dev

موقع (يُنشر تلقائياً من GitHub):
git add .
git commit -m "update"
git push

أندرويد محلي:
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
الملف: android\app\build\outputs\apk\debug\app-debug.apk

سطح المكتب:
npm run dist
الملف: داخل مجلد release

إصلاح Electron:
node node_modules/electron/install.js
Set-Content node_modules\electron\path.txt "electron.exe" -NoNewline

قواعد:
.env لا يُرفع أبداً
المفتاح السري sb_secret لا يوضع في الواجهة
HashRouter و base './'
commit كل ساعتين