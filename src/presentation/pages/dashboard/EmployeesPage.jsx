// src/presentation/admin/AddEmployeePage.jsx
import { useState } from "react";
import AdminNavBar from "./AdminNavBar";
import AuthInput from "../../component/form/AuthInput"; import AuthButton from "../../component/auth/AuthButton";
import { addEmployee } from "../../../domain/employeesService";


export default function AddEmployeePage() {
    const [form, setForm] = useState({
        f_name: "",
        l_name: "",
        phone_number: "",
        serial_number: "",
        department_id: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(field) {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // ✅ فاليديشن بسيط من جهة الواجهة
        if (
            !form.f_name ||
            !form.l_name ||
            !form.phone_number ||
            !form.serial_number ||
            !form.department_id ||
            !form.password ||
            !form.password_confirmation
        ) {
            setError("يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }

        if (form.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 محارف على الأقل.");
            return;
        }

        if (form.password !== form.password_confirmation) {
            setError("تأكيد كلمة المرور غير مطابق لكلمة المرور.");
            return;
        }

        setLoading(true);
        try {
            // استدعاء طبقة الدومين (3 طبقات)
            await addEmployee(form);

            // ✅ نجاح
            alert("تم إضافة الموظف بنجاح");

            // تفريغ الفورم
            setForm({
                f_name: "",
                l_name: "",
                phone_number: "",
                serial_number: "",
                department_id: "",
                password: "",
                password_confirmation: "",
            });
        } catch (err) {
            console.error("ADD EMPLOYEE ERROR =", err);

            const data =
                err.response?.data ?? // Axios
                err.data ??
                err.raw ??
                null;

            if (data?.errors) {
                const first = Object.values(data.errors)[0]?.[0];
                setError(first || "حدث خطأ أثناء إنشاء الموظف.");
            } else if (data?.message) {
                setError(data.message);
            } else {
                setError("حدث خطأ غير متوقع، تأكد من الاتصال بالخادم.");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setForm({
            f_name: "",
            l_name: "",
            phone_number: "",
            serial_number: "",
            department_id: "",
            password: "",
            password_confirmation: "",
        });
        setError("");
    }

    return (
        <div className="emp-add-page">
            <AdminNavBar />

            <main className="emp-add-main" dir="rtl">
                {/* الهيدر فوق الكرت */}
                <header className="emp-add-header">
                    <div className="emp-add-header-left">
                        <div className="emp-add-logo-circle">
                            <span>موظف</span>
                        </div>
                        <div>
                            <h1 className="emp-add-title">إضافة موظف جديد</h1>
                            <p className="emp-add-subtitle">
                                استخدم هذا النموذج لإضافة حساب موظف جديد وربطه بالقسم المناسب.
                            </p>
                        </div>
                    </div>

                    <div className="emp-add-badge">
                        <span className="dot" />
                        نموذج إداري
                    </div>
                </header>

                {/* الكرت الرئيسي للفورم */}
                <section className="emp-add-card">
                    <div className="emp-add-card-header">
                        <div className="emp-add-card-header-top">
                            <h2>بيانات الموظف</h2>

                            <span className="emp-add-chip">
                                خطوة 1 من 1 · إدخال بيانات الموظف
                            </span>
                        </div>

                        <p className="emp-add-card-text">
                            املأ الحقول التالية بمعلومات الموظف، ثم اضغط على زر
                            <strong> إضافة الموظف </strong>
                            لإتمام عملية التسجيل.
                        </p>
                    </div>

                    <hr className="emp-add-divider" />

                    {error && <div className="emp-add-error">{error}</div>}

                    <form className="emp-add-form" onSubmit={handleSubmit}>
                        <div className="emp-add-grid">
                            <AuthInput
                                label="الاسم الأول"
                                id="f_name"
                                placeholder="مثال: عمر"
                                value={form.f_name}
                                onChange={handleChange("f_name")}
                            />

                            <AuthInput
                                label="اسم العائلة"
                                id="l_name"
                                placeholder="مثال: أحمد"
                                value={form.l_name}
                                onChange={handleChange("l_name")}
                            />

                            <AuthInput
                                label="رقم الهاتف"
                                id="phone_number"
                                type="text"
                                placeholder="مثال: 09333082474"
                                value={form.phone_number}
                                onChange={handleChange("phone_number")}
                            />

                            <AuthInput
                                label="الرقم الوظيفي / التسلسلي"
                                id="serial_number"
                                type="number"
                                placeholder="مثال: 11111111"
                                value={form.serial_number}
                                onChange={handleChange("serial_number")}
                            />

                            <AuthInput
                                label="رقم القسم"
                                id="department_id"
                                type="number"
                                placeholder="مثال: 11"
                                value={form.department_id}
                                onChange={handleChange("department_id")}
                            />

                            <div />

                            <AuthInput
                                label="كلمة المرور"
                                id="password"
                                type="password"
                                placeholder="كلمة المرور"
                                value={form.password}
                                onChange={handleChange("password")}
                            />

                            <AuthInput
                                label="تأكيد كلمة المرور"
                                id="password_confirmation"
                                type="password"
                                placeholder="أعد كتابة كلمة المرور"
                                value={form.password_confirmation}
                                onChange={handleChange("password_confirmation")}
                            />
                        </div>

                        <div className="emp-add-actions">
                            <AuthButton type="submit">
                                {loading ? "جاري الإضافة..." : "إضافة الموظف"}
                            </AuthButton>

                            <button
                                type="button"
                                className="emp-add-cancel"
                                onClick={handleCancel}
                            >
                                إلغاء
                            </button>
                        </div>

                        <p className="emp-add-note">
                            سيتمكن قسم الموارد البشرية من تعديل بيانات الموظف أو إيقاف حسابه
                            لاحقًا من صفحة إدارة الموظفين.
                        </p>
                    </form>
                </section>
            </main>
        </div>
    );
}
