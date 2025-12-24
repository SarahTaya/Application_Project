# حل مشكلة CSRF Token (419) في مشروع React + Laravel

## المشكلة
كانت تظهر رسالة خطأ: `CSRF/Route mismatch (419)` عند محاولة تسجيل الدخول.

## السبب
الباك إند (Laravel) يتوقع CSRF token للطلبات POST/PUT/DELETE، لكن الفرونت إند (React) لم يكن يرسله.

## الحلول المطبقة

### 1. إنشاء ملف تكوين Axios (`src/utils/axios.js`)
- إعداد Axios instance مع `withCredentials: true`
- إضافة interceptor للحصول على CSRF token تلقائياً
- إرسال CSRF token في header `X-CSRF-TOKEN`

### 2. تحديث صفحة Login
- استخدام ملف Axios الجديد بدلاً من الاستيراد المباشر
- تبسيط الكود وإزالة التعامل اليدوي مع CSRF

## كيفية عمل الحل

1. **عند تحميل الصفحة**: يتم الحصول على CSRF token من `/sanctum/csrf-cookie`
2. **عند إرسال طلب**: يتم إضافة CSRF token تلقائياً للـ headers
3. **معالجة الأخطاء**: يتم التعامل مع خطأ 419 بشكل أفضل

## متطلبات الباك إند

تأكد من أن الباك إند (Laravel) يحتوي على:

```php
// في config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // مهم جداً!
];
```

## اختبار الحل

1. قم بتشغيل الباك إند (Laravel)
2. قم بتشغيل الفرونت إند (React)
3. جرب تسجيل الدخول - يجب أن يعمل بدون خطأ 419

## ملاحظات مهمة

- تأكد من أن الباك إند يعمل على `http://127.0.0.1:8000`
- تأكد من أن CORS مفعل بشكل صحيح
- تأكد من أن `supports_credentials` = true في إعدادات CORS 