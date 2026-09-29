interface PrivacyPolicyPageProps {
  onBack: () => void;
  lang?: "en" | "ar";
}

const sections_en = [
  {
    title: "Introduction",
    body: "Welcome to Vault. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.",
  },
  {
    title: "Information We Collect",
    body: "We collect only the information necessary to provide you with the Vault service:\n\n• Account Information: Your phone number (used to create and identify your account), and your display name.\n\n• Saved Content: The links, titles, notes, and reminders you choose to save inside Vault.\n\n• Usage Data: Basic app activity such as when you log in or save a link — used only to keep your data in sync across devices.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information solely to:\n\n• Provide, maintain, and improve the Vault service.\n• Sync your saved links and collections securely across sessions.\n• Send you in-app reminders you have set for your saved links.\n• Authenticate your identity when you sign in.",
  },
  {
    title: "Data Storage & Security",
    body: "Your data is stored securely using Supabase — a trusted, enterprise-grade cloud platform. All data is encrypted in transit (TLS/HTTPS) and at rest. We do not sell, rent, or share your personal information with any third parties for marketing or advertising purposes.",
  },
  {
    title: "Your Rights",
    body: "You have the right to:\n\n• Access the data stored in your account at any time through the app.\n• Edit or update your profile information.\n• Delete your account and all associated data permanently using the \"Delete Account\" option in Settings.\n• Opt out of reminders at any time by disabling notifications in Settings.",
  },
  {
    title: "Third-Party Services",
    body: "Vault uses the following third-party services to enhance your experience:\n\n• Supabase — for secure data storage and authentication.\n• Microlink — to generate link previews (title, description, image) when you save a URL.\n• Google Favicon Service — to display website icons.\n\nThese services have their own privacy policies. We do not share personally identifiable information with them beyond what is required for their functionality.",
  },
  {
    title: "Data Retention",
    body: "Your data is retained as long as your account is active. If you delete your account, all your data — including saved links, collections, and profile information — is permanently and immediately removed from our systems.",
  },
  {
    title: "Children's Privacy",
    body: "Vault is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we do, we will update the \"Last Updated\" date below. Continued use of Vault after changes are made constitutes your acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    body: "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to us via Telegram:\n\n@moustafakamar",
  },
];

const sections_ar = [
  {
    title: "مقدمة",
    body: "مرحباً بك في Vault. نحن ملتزمون بحماية معلوماتك الشخصية وحقك في الخصوصية. توضح سياسة الخصوصية هذه المعلومات التي نجمعها وكيفية استخدامها والحقوق التي تتمتع بها.",
  },
  {
    title: "المعلومات التي نجمعها",
    body: "نجمع فقط المعلومات الضرورية لتزويدك بخدمة Vault:\n\n• معلومات الحساب: رقم هاتفك (يُستخدم لإنشاء حسابك والتعرف عليه) واسمك المعروض.\n\n• المحتوى المحفوظ: الروابط والعناوين والملاحظات والتذكيرات التي تختار حفظها في Vault.\n\n• بيانات الاستخدام: نشاط أساسي في التطبيق مثل وقت تسجيل الدخول أو حفظ رابط — تُستخدم فقط لمزامنة بياناتك.",
  },
  {
    title: "كيف نستخدم معلوماتك",
    body: "نستخدم معلوماتك فقط من أجل:\n\n• توفير خدمة Vault وصيانتها وتحسينها.\n• مزامنة روابطك ومجموعاتك المحفوظة بأمان عبر الجلسات.\n• إرسال التذكيرات داخل التطبيق التي حددتها لروابطك.\n• التحقق من هويتك عند تسجيل الدخول.",
  },
  {
    title: "تخزين البيانات والأمان",
    body: "يتم تخزين بياناتك بأمان باستخدام Supabase — منصة سحابية موثوقة على مستوى المؤسسات. جميع البيانات مشفرة أثناء النقل (TLS/HTTPS) وعند التخزين. نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي أطراف ثالثة.",
  },
  {
    title: "حقوقك",
    body: "لديك الحق في:\n\n• الوصول إلى البيانات المخزنة في حسابك في أي وقت عبر التطبيق.\n• تعديل معلومات ملفك الشخصي.\n• حذف حسابك وجميع البيانات المرتبطة به نهائياً باستخدام خيار \"حذف الحساب\" في الإعدادات.\n• إيقاف التذكيرات في أي وقت عبر الإعدادات.",
  },
  {
    title: "خدمات الطرف الثالث",
    body: "يستخدم Vault الخدمات التالية:\n\n• Supabase — لتخزين البيانات والمصادقة الآمنة.\n• Microlink — لإنشاء معاينات الروابط عند حفظ URL.\n• خدمة Google للأيقونات — لعرض أيقونات المواقع.\n\nلهذه الخدمات سياسات الخصوصية الخاصة بها. لا نشارك معلومات التعريف الشخصية معها إلا بالقدر اللازم لوظيفتها.",
  },
  {
    title: "الاحتفاظ بالبيانات",
    body: "يتم الاحتفاظ ببياناتك طالما أن حسابك نشط. إذا حذفت حسابك، تتم إزالة جميع بياناتك — بما في ذلك الروابط المحفوظة والمجموعات ومعلومات الملف الشخصي — بشكل دائم وفوري من أنظمتنا.",
  },
  {
    title: "خصوصية الأطفال",
    body: "Vault غير موجه للأطفال دون سن 13 عاماً. إذا كنت تعتقد أن طفلاً قدم لنا معلومات شخصية، يرجى التواصل معنا وسنحذفها فوراً.",
  },
  {
    title: "تغييرات على هذه السياسة",
    body: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بتحديث تاريخ \"آخر تحديث\" أدناه. استمرارك في استخدام Vault بعد إجراء التغييرات يعني قبولك للسياسة المحدثة.",
  },
  {
    title: "تواصل معنا",
    body: "إذا كان لديك أي أسئلة أو استفسارات بشأن سياسة الخصوصية أو بياناتك الشخصية، يرجى التواصل معنا عبر تيليجرام:\n\n@moustafakamar",
  },
];

export function PrivacyPolicyPage({ onBack, lang = "en" }: PrivacyPolicyPageProps) {
  const isAr = lang === "ar";
  const sections = isAr ? sections_ar : sections_en;

  return (
    <div className="absolute inset-0 bg-[#0d0d1a] flex flex-col z-[80]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-6 pb-4 border-b border-[#1e1e2e]">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-[10px] bg-[#1a1a28] flex items-center justify-center active:opacity-70 transition-opacity flex-shrink-0"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#e8e8f5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[20px]">
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] mt-0.5">
            {isAr ? "آخر تحديث: يوليو 2025" : "Last updated: July 2025"}
          </p>
        </div>
        {/* Shield icon */}
        <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <svg className="size-5 text-emerald-400" fill="none" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

        {/* Intro banner */}
        <div
          className="rounded-[18px] px-4 py-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #1a2d1a 0%, #0d1a0d 100%)", border: "1px solid rgba(52,211,153,0.2)" }}
        >
          <svg className="size-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Poppins:Regular',sans-serif] text-emerald-300 text-[12px] leading-relaxed">
            {isAr
              ? "Vault يحترم خصوصيتك. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تجارية."
              : "Vault respects your privacy. We never sell your data or share it with third parties for commercial purposes."}
          </p>
        </div>

        {/* Sections */}
        {sections.map((sec, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9b59ff] flex-shrink-0" />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[15px]">
                {sec.title}
              </p>
            </div>
            <p
              className="font-['Poppins:Regular',sans-serif] text-[#9a9ab8] text-[13px] leading-relaxed"
              style={{ whiteSpace: "pre-line" }}
            >
              {sec.body}
            </p>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-2 pt-5 border-t border-[#1e1e2e] flex flex-col items-center gap-2 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#1a1a28] flex items-center justify-center">
            <svg className="size-5 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="font-['Poppins:Medium',sans-serif] text-[#3a3a50] text-[12px]">
            Vault · {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"} © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
