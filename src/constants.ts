import {
  Target,
  Users,
  BarChart3,
  ClipboardList,
  Award,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  School,
  UserCheck,
  HeartHandshake,
  Settings,
  Hash,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  PhoneCall
} from 'lucide-react';

export const COMMITTEE_MEMBERS = [
  { role: "مدير المدرسة", title: "رئيس اللجنة", description: "الإشراف العام على أعمال اللجنة وتوفير الدعم اللازم.", color: "bg-madrasati-green" },
  { role: "وكيل المدرسة", title: "نائب الرئيس", description: "متابعة تنفيذ الخطط التشغيلية وإعداد التقارير الدورية.", color: "bg-madrasati-orange" },
  { role: "الموجه الطلابي", title: "عضو", description: "رصد مؤشرات الأداء المتعلقة بنواتج التعلم والبيئة المدرسية.", color: "bg-indigo-600" }
];

export const SCHOOL_STATS = {
  general: [
    { label: "الرقم الوزاري", value: "123456", icon: Hash },
    { label: "المرحلة", value: "ثانوية", icon: GraduationCap },
    { label: "نوع التعليم", value: "عام", icon: BookOpen },
    { label: "تصنيف المدرسة", value: "فئة أ", icon: Award },
    { label: "حالة المبنى", value: "حكومي", icon: School },
    { label: "فترة الدراسة", value: "صباحي", icon: Clock },
    { label: "تاريخ التأسيس", value: "1420 هـ", icon: Calendar },
    { label: "الحي", value: "النزهة", icon: MapPin },
    { label: "العنوان", value: "الرياض - حي النزهة", icon: MapPin },
    { label: "البريد الرسمي", value: "school@moe.gov.sa", icon: Mail },
    { label: "هاتف المدرسة", value: "0112345678", icon: Phone },
    { label: "هاتف مدير المدرسة", value: "0501234567", icon: PhoneCall },
  ],
  classes: [
    { label: "عدد الفصول", value: "18", icon: School },
    { label: "متوسط الطلاب بالفصل", value: "32", icon: Users },
    { label: "فصول الموهوبين", value: "2", icon: Award },
  ],
  building: [
    { label: "المعامل والمختبرات", value: "4", icon: Settings },
    { label: "القاعات الدراسية", value: "22", icon: School },
    { label: "المرافق الرياضية", value: "3", icon: Target },
  ],
  staff: [
    { label: "الهيئة التعليمية", value: "45", icon: GraduationCap },
    { label: "الهيئة الإدارية", value: "12", icon: UserCheck },
    { label: "إجمالي المنسوبين", value: "57", icon: Users },
  ]
};

export const INDICATORS_DATA = [
  {
    title: "الإدارة المدرسية",
    initiative: "مبادرة القيادة المتميزة",
    icon: ShieldCheck,
    color: "text-madrasati-green",
    bgColor: "bg-madrasati-green/10",
    description: "تطوير العمليات الإدارية وتحقيق الحوكمة الفعالة في البيئة المدرسية.",
    progress: 0
  },
  {
    title: "التعليم والتعلم",
    initiative: "مبادرة آفاق التعلم الرقمي",
    icon: BookOpen,
    color: "text-madrasati-orange",
    bgColor: "bg-madrasati-orange/10",
    description: "تطبيق استراتيجيات تدريس حديثة ودمج التقنية في العملية التعليمية.",
    progress: 0
  },
  {
    title: "نواتج التعلم",
    initiative: "مبادرة جودة المخرجات",
    icon: TrendingUp,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "رفع مستوى التحصيل الدراسي وتحقيق التميز في الاختبارات الوطنية والدولية.",
    progress: 0
  },
  {
    title: "البيئة المدرسية",
    initiative: "مبادرة بيئتي المدرسية أجمل",
    icon: School,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    description: "خلق بيئة تعليمية آمنة، محفزة، وجاذبة للطلاب ومنسوبي المدرسة.",
    progress: 0
  }
];

export const INITIAL_OPERATIONAL_GOALS = [
  {
    mainGoal: "تحسين نواتج التعلم في المواد الأساسية",
    subGoals: ["رفع نسبة النجاح في اختبارات نافس", "تطوير مهارات القراءة والكتابة"],
    baseline: 75,
    target: 85,
    changeLastYear: 5
  },
  {
    mainGoal: "تعزيز الانضباط المدرسي",
    subGoals: ["تقليل نسبة الغياب بدون عذر", "تفعيل برنامج رفق"],
    baseline: 80,
    target: 95,
    changeLastYear: 10
  }
];

export const INITIAL_ATTACHMENTS = [
  {
    name: "الخطة التشغيلية 1445.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-01-15",
    category: "خطط رسمية",
    url: "#"
  }
];

export const TASKS = [];
