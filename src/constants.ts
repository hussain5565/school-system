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

export const COMMITTEE_MEMBERS = [];

export const SCHOOL_STATS = {
  general: [
    { label: "الرقم الوزاري", value: "-", icon: Hash },
    { label: "المرحلة", value: "-", icon: GraduationCap },
    { label: "نوع التعليم", value: "-", icon: BookOpen },
    { label: "تصنيف المدرسة", value: "-", icon: Award },
    { label: "حالة المبنى", value: "-", icon: School },
    { label: "فترة الدراسة", value: "-", icon: Clock },
    { label: "تاريخ التأسيس", value: "-", icon: Calendar },
    { label: "الحي", value: "-", icon: MapPin },
    { label: "العنوان", value: "-", icon: MapPin },
    { label: "البريد الرسمي", value: "-", icon: Mail },
    { label: "هاتف المدرسة", value: "-", icon: Phone },
    { label: "هاتف مدير المدرسة", value: "-", icon: PhoneCall },
  ],
  classes: [
    { label: "عدد الفصول", value: "0", icon: School },
    { label: "متوسط الطلاب بالفصل", value: "0", icon: Users },
    { label: "فصول الموهوبين", value: "0", icon: Award },
  ],
  building: [
    { label: "المعامل والمختبرات", value: "0", icon: Settings },
    { label: "القاعات الدراسية", value: "0", icon: School },
    { label: "المرافق الرياضية", value: "0", icon: Target },
  ],
  staff: [
    { label: "الهيئة التعليمية", value: "0", icon: GraduationCap },
    { label: "الهيئة الإدارية", value: "0", icon: UserCheck },
    { label: "إجمالي المنسوبين", value: "0", icon: Users },
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

export const INITIAL_OPERATIONAL_GOALS = [];

export const INITIAL_ATTACHMENTS = [];

export const TASKS = [];
