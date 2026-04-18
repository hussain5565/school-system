/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabase';
import { 
  Target, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Award, 
  ChevronLeft,
  LayoutDashboard,
  Info,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  School,
  Hash,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  PhoneCall,
  UserCheck,
  Lightbulb,
  Settings,
  ShieldCheck,
  Flag,
  Plus,
  Trash2,
  PlusCircle,
  Milestone,
  FileText,
  Download,
  UploadCloud,
  File,
  FolderOpen,
  LogOut,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { COMMITTEE_MEMBERS, SCHOOL_STATS, TASKS, INDICATORS_DATA, INITIAL_OPERATIONAL_GOALS, INITIAL_ATTACHMENTS } from './constants';

const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string, icon: any, subtitle?: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <Icon size={24} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-500 mr-11">{subtitle}</p>}
  </div>
);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  table: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | undefined;
  }
}

function handleSupabaseError(error: any, operationType: OperationType, table: string | null) {
  const errInfo: SupabaseErrorInfo = {
    error: error?.message || String(error),
    authInfo: {
      userId: undefined,
      email: undefined
    },
    operationType,
    table
  }
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let message = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error.includes('Missing or insufficient permissions')) {
          message = "ليس لديك الصلاحيات الكافية للقيام بهذا الإجراء.";
        }
      } catch (e) {}
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center text-madrasati-dark">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-rose-100">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">تنبيه بالنظام</h2>
            <p className="text-slate-500 mb-8 leading-relaxed font-bold">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-madrasati-green text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
            >
              تحديث الصفحة للمحاولة
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const Login = ({ onLogin, setUser }: { onLogin: () => void, setUser: (user: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const isPlaceholder = supabase.auth.getSession === undefined || (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder'));

  const handlePasswordLogin = () => {
    // Simple fallback for development/preview environment
    if (adminPass === 'admin123') {
      const mockUser = {
        id: 'admin-id',
        email: 'hussain5565@hotmail.com',
        user_metadata: { full_name: 'مدير النظام' }
      };
      localStorage.setItem('excellence_admin_session', 'true');
      setUser(mockUser);
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">دخول المسؤول</h2>
      
      {isPlaceholder && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold leading-relaxed">
          تنبيه: التطبيق يستخدم إعدادات تجريبية. يرجى إضافة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في إعدادات المنصة (Settings) لربط قاعدة بياناتك.
        </div>
      )}

      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        سجل الدخول لإدارة بيانات المدرسة والمؤشرات.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input 
          type="password"
          placeholder="كلمة مرور المسؤول"
          value={adminPass}
          onChange={(e) => setAdminPass(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-madrasati-green outline-none text-center font-bold"
        />
        <button 
          onClick={handlePasswordLogin}
          disabled={loading}
          className="w-full py-4 bg-madrasati-green text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </div>
      
      <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        نظام الإدارة المدرسية الموحد
      </p>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [indicators, setIndicators] = useState<any[]>([]);
  const [operationalGoals, setOperationalGoals] = useState<any[]>([]);
  const [schoolStats, setSchoolStats] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [reportPassword, setReportPassword] = useState<{ [key: string]: string }>({});
  const [unlockedReports, setUnlockedReports] = useState<{ [key: string]: boolean }>({});
  const [members, setMembers] = useState<any[]>(COMMITTEE_MEMBERS);
  const [manualAverageProgress, setManualAverageProgress] = useState<number | null>(null);
  const [history, setHistory] = useState<{ date: string; indicators: any[]; average: number }[]>([]);
  const [settings, setSettings] = useState<{ orgStructureUrl: string }>({ orgStructureUrl: 'https://picsum.photos/seed/structure/1200/675' });
  const [tasks, setTasks] = useState<string[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState({
    indicators: true,
    goals: true,
    history: true,
    stats: true,
    attachments: true
  });

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Initialize data if Firestore is empty
  const initializeData = async () => {
    try {
      const { data: indSnap } = await supabase.from('excellence_indicators').select('id').limit(1);
      if (!indSnap?.length && INDICATORS_DATA.length > 0) {
        for (const ind of INDICATORS_DATA) {
          const { icon, ...rest } = ind;
          await supabase.from('excellence_indicators').insert({ ...rest });
        }
      }
      
      const { data: goalsSnap } = await supabase.from('excellence_goals').select('id').limit(1);
      if (!goalsSnap?.length && INITIAL_OPERATIONAL_GOALS.length > 0) {
        for (const goal of INITIAL_OPERATIONAL_GOALS) {
          await supabase.from('excellence_goals').insert(goal);
        }
      }

      const { data: membersSnap } = await supabase.from('excellence_members').select('id').limit(1);
      if (!membersSnap?.length && COMMITTEE_MEMBERS.length > 0) {
        for (const member of COMMITTEE_MEMBERS) {
          await supabase.from('excellence_members').insert(member);
        }
      }

      const { data: statsSnap } = await supabase.from('excellence_stats').select('id').limit(1);
      if (!statsSnap?.length) {
        for (const [category, items] of Object.entries(SCHOOL_STATS)) {
          const sanitizedItems = (items as any[]).map(({ icon, ...rest }) => rest);
          await supabase.from('excellence_stats').insert({ id: category, items: sanitizedItems });
        }
      }

      const { data: attachSnap } = await supabase.from('excellence_attachments').select('id').limit(1);
      if (!attachSnap?.length && INITIAL_ATTACHMENTS.length > 0) {
        for (const attach of INITIAL_ATTACHMENTS) {
          await supabase.from('excellence_attachments').insert(attach);
        }
      }

      const { data: settingsSnap } = await supabase.from('excellence_settings').select('id').eq('id', 'general').single();
      if (!settingsSnap) {
        await supabase.from('excellence_settings').insert({ 
          id: 'general',
          orgStructureUrl: 'https://picsum.photos/seed/structure/1200/675' 
        });
      }

      // Initialize Tasks
      const { data: existingTasks } = await supabase.from('excellence_tasks').select('text');
      const existingTexts = new Set(existingTasks?.map(t => t.text) || []);
      
      const defaultTasks = TASKS.length > 0 ? TASKS : [
        "متابعة تنفيذ الخطط التشغيلية",
        "رصد مؤشرات الأداء الدورية",
        "إعداد تقارير الإنجاز الفصلية"
      ];

      const tasksToInsert = defaultTasks
        .filter(t => !existingTexts.has(t))
        .map(t => ({ text: t }));

      if (tasksToInsert.length > 0) {
        await supabase.from('excellence_tasks').insert(tasksToInsert);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // Check for mock session
        const mockSession = localStorage.getItem('excellence_admin_session');
        if (mockSession === 'true') {
          setUser({
            id: 'admin-id',
            email: 'hussain5565@hotmail.com',
            user_metadata: { full_name: 'مدير النظام' }
          });
        } else {
          setUser(null);
        }
      }
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchIndicators = async () => {
      try {
        const { data, error } = await supabase.from('excellence_indicators').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const processed = data.map(docData => {
            const originalInd = INDICATORS_DATA.find(ind => ind.title === docData.title);
            return { 
              ...docData, 
              docId: docData.id,
              icon: originalInd?.icon || Target
            };
          });
          setIndicators(processed);
        } else {
          setIndicators(INDICATORS_DATA.map((ind, i) => ({ ...ind, id: i + 1, docId: (i + 1).toString() })));
        }
      } catch (error) {
        console.warn("Supabase indicators table not found, using local defaults");
        setIndicators(INDICATORS_DATA.map((ind, i) => ({ ...ind, id: i + 1, docId: (i + 1).toString() })));
      } finally {
        setLoading(prev => ({ ...prev, indicators: false }));
      }
    };

    const fetchGoals = async () => {
      try {
        const { data, error } = await supabase.from('excellence_goals').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setOperationalGoals(data.map(d => ({ ...d, docId: d.id })));
        } else {
          setOperationalGoals(INITIAL_OPERATIONAL_GOALS.map((goal, i) => ({ ...goal, id: i + 1, docId: (i + 1).toString() })));
        }
      } catch (error) {
        console.warn("Supabase goals table not found, using local defaults");
        setOperationalGoals(INITIAL_OPERATIONAL_GOALS.map((goal, i) => ({ ...goal, id: i + 1, docId: (i + 1).toString() })));
      } finally {
        setLoading(prev => ({ ...prev, goals: false }));
      }
    };

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase.from('excellence_history').select('*').order('date', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setHistory(data.map(d => ({ ...d, docId: d.id })) as any);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.warn("Supabase history table not found, using local defaults");
        setHistory([]);
      } finally {
        setLoading(prev => ({ ...prev, history: false }));
      }
    };

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.from('excellence_stats').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const statsData: any = { ...SCHOOL_STATS };
          data.forEach((d) => {
            const category = d.id;
            const items = d.items || [];
            if (statsData[category]) {
              statsData[category] = statsData[category].map((initialItem: any) => {
                const updatedItem = items.find((item: any) => item.label === initialItem.label);
                return updatedItem ? { ...initialItem, value: updatedItem.value } : initialItem;
              });
            }
          });
          setSchoolStats(statsData);
        } else {
          setSchoolStats(SCHOOL_STATS);
        }
      } catch (error) {
        console.warn("Supabase stats table not found, using local defaults");
        setSchoolStats(SCHOOL_STATS);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    const fetchAttachments = async () => {
      try {
        const { data, error } = await supabase.from('excellence_attachments').select('*');
        if (error) throw error;
        if (data) setAttachments(data.map(d => ({ ...d, docId: d.id })));
      } catch (error) {
        console.warn("Supabase attachments table not found");
      } finally {
        setLoading(prev => ({ ...prev, attachments: false }));
      }
    };

    const fetchReports = async () => {
      try {
        const { data, error } = await supabase.from('excellence_reports').select('*');
        if (error) throw error;
        if (data) setReports(data.map(d => ({ ...d, docId: d.id })));
      } catch (error) {
        console.warn("Supabase reports table not found");
      }
    };

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase.from('excellence_members').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setMembers(data.map(d => ({ ...d, docId: d.id })));
        } else {
          setMembers(COMMITTEE_MEMBERS.map((m, i) => ({ ...m, id: i + 1, docId: (i + 1).toString() })));
        }
      } catch (error) {
        console.warn("Supabase members table not found, using local defaults");
        setMembers(COMMITTEE_MEMBERS.map((m, i) => ({ ...m, id: i + 1, docId: (i + 1).toString() })));
      }
    };

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('excellence_settings').select('*').eq('id', 'general').single();
        if (error && error.code !== 'PGRST116') throw error;
        if (data) setSettings(data as any);
      } catch (error) {
        console.warn("Supabase settings table not found");
      }
    };

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase.from('excellence_tasks').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setTasks(data.map(d => d.text));
        } else {
          setTasks(TASKS);
        }
      } catch (error) {
        console.warn("Supabase tasks table not found or error, using local defaults");
        setTasks(TASKS);
      }
    };

    fetchIndicators();
    fetchGoals();
    fetchHistory();
    fetchStats();
    fetchAttachments();
    fetchReports();
    fetchMembers();
    fetchSettings();
    fetchTasks();

    // Real-time subscriptions
    const channel = supabase.channel('excellence_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchIndicators();
        fetchGoals();
        fetchHistory();
        fetchStats();
        fetchAttachments();
        fetchReports();
        fetchMembers();
        fetchSettings();
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthReady]);

  useEffect(() => {
    // We removed automatic initializeData() to allow users to clear data permanently.
    // Data can still be initialized manually via the settings button.
  }, [user, isAuthReady]);

  const averageProgress = manualAverageProgress !== null 
    ? manualAverageProgress 
    : indicators.length > 0 
      ? Math.round(indicators.reduce((acc, curr) => acc + (curr.progress || 0), 0) / indicators.length)
      : 0;

  const saveSnapshot = async () => {
    if (!user) return;
    try {
      const newSnapshot = {
        date: new Date().toISOString(),
        indicators: JSON.parse(JSON.stringify(indicators)),
        average: averageProgress
      };
      const { error } = await supabase.from('excellence_history').insert(newSnapshot);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'excellence_history');
    }
  };

  const getIndicatorChange = (index: number) => {
    if (history.length === 0 || !indicators[index]) return 0;
    const lastSnapshot = history[0];
    const prevInd = lastSnapshot.indicators.find((ind: any) => ind.title === indicators[index].title);
    return prevInd ? indicators[index].progress - prevInd.progress : 0;
  };

  const getAverageChange = () => {
    if (history.length === 0) return 0;
    return averageProgress - history[0].average;
  };

  const getPerformanceStatus = (value: number) => {
    if (value <= 49) return { label: 'تهيئة', color: 'text-[#ff0000]', bg: 'bg-[#ff0000]', hex: '#ff0000' };
    if (value <= 74) return { label: 'انطلاق', color: 'text-[#ffc000]', bg: 'bg-[#ffc000]', hex: '#ffc000' };
    if (value <= 89) return { label: 'تقدم', color: 'text-[#4472c4]', bg: 'bg-[#4472c4]', hex: '#4472c4' };
    return { label: 'تميز', color: 'text-[#00b050]', bg: 'bg-[#00b050]', hex: '#00b050' };
  };

  const status = getPerformanceStatus(averageProgress);

  // Gauge Chart Component
  const GaugeChart = ({ value }: { value: number }) => {
    const centerX = 100;
    const centerY = 110;
    const radius = 70;
    const normalizedValue = Math.min(100, Math.max(0, value));
    
    const segments = [
      { label: 'تهيئة', start: 0, end: 49, color: '#ff0000' },
      { label: 'انطلاق', start: 50, end: 74, color: '#ffc000' },
      { label: 'تقدم', start: 75, end: 89, color: '#4472c4' },
      { label: 'تميز', start: 90, end: 100, color: '#00b050' }
    ];

    const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
      return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
      };
    };

    const status = getPerformanceStatus(normalizedValue);
    const indicatorAngle = (normalizedValue / 100) * 180 - 180;
    const indicatorPos = polarToCartesian(centerX, centerY, radius, indicatorAngle);

    return (
      <div className="flex flex-col items-center w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="w-full bg-[#0b2633] py-5 text-center">
          <h2 className="text-white text-xl font-bold tracking-tight">نتيجة مؤشر الأداء العام</h2>
        </div>

        <div className="relative w-full h-80 flex flex-col items-center justify-center pt-10 pb-6">
          <svg viewBox="0 0 200 140" className="w-full h-full overflow-visible">
            {/* Background Track */}
            <path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="24"
              strokeLinecap="round"
            />

            {/* Colored Segments */}
            {segments.map((seg, i) => {
              const startAngle = (seg.start / 100) * 180 - 180;
              const endAngle = (seg.end / 100) * 180 - 180;
              const startPos = polarToCartesian(centerX, centerY, radius, startAngle);
              const endPos = polarToCartesian(centerX, centerY, radius, endAngle);
              
              return (
                <path
                  key={i}
                  d={`M ${startPos.x} ${startPos.y} A ${radius} ${radius} 0 0 1 ${endPos.x} ${endPos.y}`}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="24"
                  strokeLinecap="butt"
                  className="transition-all duration-500"
                  style={{ opacity: normalizedValue >= seg.start ? 1 : 0.2 }}
                />
              );
            })}

            {/* Progress Indicator (The "Glow" on the arc) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Outer Glow */}
              <circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={16}
                fill={status.hex}
                fillOpacity="0.2"
              />
              {/* Main Indicator */}
              <circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={10}
                fill="white"
                stroke={status.hex}
                strokeWidth="4"
                className="shadow-lg"
              />
              <circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={4}
                fill={status.hex}
              />
            </motion.g>

            {/* Ticks and Labels */}
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
              const angle = (tick / 100) * 180 - 180;
              const pos = polarToCartesian(centerX, centerY, radius + 25, angle);
              return (
                <text
                  key={tick}
                  x={pos.x}
                  y={pos.y}
                  fill="#64748b"
                  fontSize="7"
                  fontWeight="black"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {tick}
                </text>
              );
            })}

            {/* Status Labels */}
            {segments.map((seg, i) => {
              const midAngle = ((seg.start + seg.end) / 2 / 100) * 180 - 180;
              const labelPos = polarToCartesian(centerX, centerY, radius, midAngle);
              const isActive = normalizedValue >= seg.start;
              return (
                <text
                  key={i}
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={isActive ? (seg.label === 'تميز' ? '#0a2633' : 'white') : '#94a3b8'}
                  fontSize="6.5"
                  fontWeight="black"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="transition-colors duration-500"
                >
                  {seg.label}
                </text>
              );
            })}

            {/* Decorative Center */}
            <circle cx={centerX} cy={centerY} r={20} fill="#f8fafc" />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              fill="#64748b"
              fontSize="6"
              fontWeight="bold"
            >
              مستوى
            </text>
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              fill="#64748b"
              fontSize="6"
              fontWeight="bold"
            >
              الإنجاز
            </text>
          </svg>
        </div>

        {/* Footer */}
        <div className="w-full bg-[#0b2633] py-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-white text-5xl font-black tracking-tighter mb-2">{value.toFixed(2)}%</span>
            <div className={`flex items-center gap-3 px-6 py-2 rounded-full ${status.bg} bg-opacity-20 border border-white/10`}>
              <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
              <div className={`w-2 h-2 rounded-full ${status.bg} animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'members', label: 'أعضاء اللجنة', icon: Users },
    { id: 'tasks', label: 'المهام', icon: ClipboardList },
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'indicators', label: 'المؤشرات', icon: Target },
    { id: 'goals', label: 'الأهداف التشغيلية', icon: Milestone },
    { id: 'attachments', label: 'المرفقات', icon: FolderOpen },
    { id: 'reports', label: 'التقارير المحمية', icon: ShieldCheck },
    { id: 'admin', label: 'لوحة التحكم', icon: Settings },
  ];

  const handleUpdateProgress = (index: number, value: number) => {
    const newIndicators = [...indicators];
    newIndicators[index].progress = Math.min(100, Math.max(0, value));
    setIndicators(newIndicators);
  };

  const handleAddGoal = async () => {
    try {
      setToast({ message: 'جاري إضافة هدف جديد...', type: 'success' });
      const newGoal = {
        mainGoal: "هدف جديد",
        subGoals: [{ text: "", baseline: 0, target: 0, change: 0 }],
        baseline: 0,
        target: 0,
        changeLastYear: 0
      };
      const { data, error } = await supabase.from('excellence_goals').insert(newGoal).select().single();
      if (error) throw error;
      if (data) setOperationalGoals(prev => [...prev, { ...data, docId: data.id }]);
      setToast({ message: 'تمت إضافة الهدف بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'excellence_goals');
    }
  };

  const handleUpdateGoal = (id: number, field: string, value: any) => {
    setOperationalGoals(operationalGoals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const handleSaveGoals = async () => {
    try {
      setToast({ message: 'جاري حفظ الأهداف...', type: 'success' });
      for (const goal of operationalGoals) {
        if (goal.docId) {
          const { docId, ...rest } = goal;
          const { error } = await supabase.from('excellence_goals').update(rest).eq('id', docId);
          if (error) throw error;
        }
      }
      setToast({ message: 'تم حفظ الأهداف بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'excellence_goals');
    }
  };

  const handleAddSubGoal = (goalId: number) => {
    setOperationalGoals(operationalGoals.map(goal => 
      goal.id === goalId ? { ...goal, subGoals: [...goal.subGoals, { text: "", baseline: 0, target: 0, change: 0 }] } : goal
    ));
  };

  const handleUpdateSubGoal = (goalId: number, subIndex: number, field: string, value: any) => {
    setOperationalGoals(operationalGoals.map(goal => 
      goal.id === goalId ? { 
        ...goal, 
        subGoals: goal.subGoals.map((sg: any, i: number) => i === subIndex ? { ...sg, [field]: value } : sg) 
      } : goal
    ));
  };

  const handleDeleteSubGoal = (goalId: number, subIndex: number) => {
    setOperationalGoals(operationalGoals.map(goal => 
      goal.id === goalId ? { 
        ...goal, 
        subGoals: goal.subGoals.filter((_, i) => i !== subIndex) 
      } : goal
    ));
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from('excellence_goals').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_goals/${id}`);
    }
  };

  // Helper for real upload progress
  const uploadWithProgress = (bucket: string, path: string, file: File, onProgress: (progress: number) => void): Promise<{ data: any, error: any }> => {
    return new Promise((resolve) => {
      // User provided fallbacks
      const fallbackUrl = 'https://haozznyisdztjlgxxhau.supabase.co';
      const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhb3p6bnlpc2R6dGpsZ3h4aGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTU1MzEsImV4cCI6MjA5MTY3MTUzMX0.soPaFZFKEEhvuwq4nZDSnvyxLc1nQEJVeIiNH7JGfP0';

      const rawUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
      const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackKey;
      
      if (!rawUrl || rawUrl.includes('placeholder') || !rawKey || rawKey.includes('placeholder')) {
        resolve({ data: null, error: { message: 'إعدادات Supabase غير مكتملة. يرجى إضافة المفاتيح المطلوبة في الإعدادات.' } });
        return;
      }
      
      const xhr = new XMLHttpRequest();
      const baseUrl = rawUrl.replace(/\/$/, '');
      
      // Force path to be valid ASCII to prevent "Invalid key" errors with Arabic filenames
      // We also encode it just in case, but stripping non-ASCII is the safest bet for Storage keys
      const safePath = path
        .split('/')
        .map(seg => seg.replace(/[^\x00-\x7F]/g, '_')) // Replace non-ASCII with underscore
        .join('/');
        
      const encodedPath = safePath.split('/').map(seg => encodeURIComponent(seg)).join('/');
      const url = `${baseUrl}/storage/v1/object/${bucket}/${encodedPath}`;
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = xhr.response ? JSON.parse(xhr.response) : { message: 'Success' };
            resolve({ data: res, error: null });
          } catch (e) {
            resolve({ data: { message: 'Success' }, error: null });
          }
        } else {
          console.error("Upload failed with status:", xhr.status, "Response:", xhr.response);
          try {
            const res = JSON.parse(xhr.response);
            resolve({ data: null, error: res });
          } catch (e) {
            resolve({ data: null, error: { message: `فشل الرفع: كود الحالة ${xhr.status}`, details: xhr.response } });
          }
        }
      };
      
      xhr.onerror = () => {
        console.error("Network error during XHR upload");
        resolve({ data: null, error: { message: 'خطأ في الشبكة أثناء الرفع. تأكد من اتصالك بالإنترنت.' } });
      };
      
      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', `Bearer ${rawKey}`);
      xhr.setRequestHeader('apikey', rawKey);
      // Removed Content-Type here because with XHR and File it might be better to let browser decide
      // Or set it explicitly if needed
      if (file.type) {
        xhr.setRequestHeader('Content-Type', file.type);
      }
      xhr.setRequestHeader('x-upsert', 'true'); // Changed to true to overwrite if exists
      xhr.send(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadProgress(0);
        setToast({ message: 'جاري رفع الملف...', type: 'success' });
        
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        // Use purely ASCII filename for storage to avoid "Invalid key" errors
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 7);
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;
        const filePath = `excellence/${fileName}`;

        const { error: uploadError } = await uploadWithProgress('uploads', filePath, file, setUploadProgress);

        if (uploadError) {
          const errMsg = uploadError.message || uploadError.error || JSON.stringify(uploadError);
          throw new Error(errMsg);
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        // 3. Save Metadata to Database
        const newAttachment = {
          name: file.name,
          type: fileExt?.toUpperCase() || 'FILE',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toISOString().split('T')[0],
          category: "مرفقات جديدة",
          url: publicUrl,
          file_path: filePath
        };
        
        const { data, error: dbError } = await supabase.from('excellence_attachments').insert(newAttachment).select().single();
        if (dbError) throw dbError;
        
        if (data) {
          setAttachments(prev => [...prev, { ...data, docId: data.id }]);
        }
        
        setToast({ message: 'تم رفع الملف بنجاح', type: 'success' });
        setTimeout(() => setUploadProgress(null), 1000);
      } catch (error: any) {
        setUploadProgress(null);
        console.error("Upload error details:", error);
        setToast({ message: `فشل الرفع: ${error.message || 'خطأ غير معروف'}`, type: 'error' });
      }
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    try {
      setToast({ message: 'جاري حذف الملف...', type: 'success' });
      
      // 1. Get file info first to delete from storage
      const { data: fileInfo, error: fetchError } = await supabase
        .from('excellence_attachments')
        .select('file_path')
        .eq('id', id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      // 2. Delete from Storage if path exists
      if (fileInfo?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .remove([fileInfo.file_path]);
        if (storageError) console.error("Storage delete error:", storageError);
      }

      // 3. Delete from Database
      const { error: dbError } = await supabase.from('excellence_attachments').delete().eq('id', id);
      if (dbError) throw dbError;
      
      setToast({ message: 'تم حذف الملف بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_attachments/${id}`);
    }
  };

  const handleSaveIndicators = async () => {
    try {
      setToast({ message: 'جاري حفظ المؤشرات...', type: 'success' });
      for (const ind of indicators) {
        if (ind.docId) {
          const { docId, icon, ...rest } = ind;
          const { error } = await supabase.from('excellence_indicators').update(rest).eq('id', docId);
          if (error) throw error;
        }
      }
      setToast({ message: 'تم حفظ المؤشرات بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'excellence_indicators');
    }
  };

  const handleAddReport = async (name: string, password: string, file: File) => {
    try {
      setUploadProgress(0);
      setToast({ message: 'جاري رفع التقرير...', type: 'success' });
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      // Use name in database, but use a clean ASCII-only filename for storage
      // This avoids "Invalid key" errors with Arabic/special characters
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 7);
      const fileName = `report-${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await uploadWithProgress('uploads', filePath, file, setUploadProgress);

      if (uploadError) {
        const errMsg = uploadError.message || uploadError.error || JSON.stringify(uploadError);
        throw new Error(errMsg);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const newReport = {
        name,
        password,
        date: new Date().toISOString().split('T')[0],
        url: publicUrl,
        file_path: filePath
      };
      
      const { data, error: dbError } = await supabase.from('excellence_reports').insert(newReport).select().single();
      if (dbError) throw dbError;
      
      if (data) {
        const addedReport = { ...data, docId: data.id };
        setReports(prev => [...prev, addedReport]);
      }
      
      setToast({ message: 'تمت إضافة التقرير بنجاح', type: 'success' });
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (error: any) {
      setUploadProgress(null);
      console.error("Report addition failed details:", error);
      setToast({ 
        message: `حدث خطأ: ${error.message || 'تعذر إضافة التقرير. تأكد من إعدادات التخزين (Storage).'}`, 
        type: 'error' 
      });
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      setToast({ message: 'جاري حذف التقرير...', type: 'success' });
      
      // 1. Get file path
      const { data: reportInfo } = await supabase.from('excellence_reports').select('file_path').eq('id', id).single();
      
      // 2. Delete from Storage
      if (reportInfo?.file_path) {
        await supabase.storage.from('uploads').remove([reportInfo.file_path]);
      }

      // 3. Delete from DB
      const { error } = await supabase.from('excellence_reports').delete().eq('id', id);
      if (error) throw error;
      setToast({ message: 'تم حذف التقرير بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_reports/${id}`);
    }
  };

  const handleUnlockReport = (id: string, password: string, correctPassword: string) => {
    if (password === correctPassword) {
      setUnlockedReports(prev => ({ ...prev, [id]: true }));
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleClearAllData = async () => {
    if (!user) return;
    setShowClearConfirm(true);
  };

  const executeClearAllData = async () => {
    setShowClearConfirm(false);
    try {
      setToast({ message: 'جاري مسح البيانات...', type: 'success' });
      const tables = [
        'excellence_indicators',
        'excellence_goals',
        'excellence_stats',
        'excellence_attachments',
        'excellence_history',
        'excellence_reports',
        'excellence_members'
      ];

      for (const tableName of tables) {
        const { error } = await supabase.from(tableName).delete().neq('id', '0'); // Delete all rows
        if (error) throw error;
      }
      
      setToast({ message: 'تم مسح كافة البيانات بنجاح', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error clearing data:", error);
      setToast({ message: 'فشل مسح البيانات', type: 'error' });
    }
  };

  const handleUpdateIndicator = (id: string, field: string, value: any) => {
    setIndicators(prev => prev.map(ind => ind.id === id ? { ...ind, [field]: value } : ind));
  };

  const handleSaveIndicator = async (id: string) => {
    const indicator = indicators.find(ind => ind.id === id);
    if (!indicator) return;
    try {
      setToast({ message: 'جاري حفظ المؤشر...', type: 'success' });
      const { error } = await supabase.from('excellence_indicators').update({
        title: indicator.title,
        initiative: indicator.initiative,
        description: indicator.description,
        progress: indicator.progress
      }).eq('id', id);
      if (error) throw error;
      setToast({ message: 'تم حفظ المؤشر بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'excellence_indicators');
    }
  };

  const handleAddIndicator = async () => {
    try {
      setToast({ message: 'جاري إضافة مؤشر جديد...', type: 'success' });
      const newInd = {
        title: "مؤشر جديد",
        initiative: "مبادرة جديدة",
        description: "وصف المؤشر الجديد",
        progress: 0,
        color: "text-madrasati-green",
        bgColor: "bg-madrasati-green/10"
      };
      const { data, error } = await supabase.from('excellence_indicators').insert(newInd).select().single();
      if (error) throw error;
      if (data) {
        setIndicators(prev => [...prev, { ...data, docId: data.id, icon: Target }]);
      }
      setToast({ message: 'تم إضافة المؤشر بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'excellence_indicators');
    }
  };

  const handleDeleteIndicator = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المؤشر؟')) return;
    try {
      setToast({ message: 'جاري حذف المؤشر...', type: 'success' });
      const { error } = await supabase.from('excellence_indicators').delete().eq('id', id);
      if (error) throw error;
      setIndicators(prev => prev.filter(ind => ind.id !== id));
      setToast({ message: 'تم حذف المؤشر بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_indicators/${id}`);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      setToast({ message: 'جاري حذف السجل...', type: 'success' });
      const { error } = await supabase.from('excellence_history').delete().eq('id', id);
      if (error) throw error;
      setHistory(prev => prev.filter(h => h.docId !== id));
      setToast({ message: 'تم حذف السجل بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_history/${id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('excellence_admin_session');
      setUser(null);
      setActiveTab('overview');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdateStat = (category: string, index: number, field: 'label' | 'value', newValue: string) => {
    if (!schoolStats) return;
    const updatedItems = schoolStats[category].map((stat: any, i: number) => 
      i === index ? { ...stat, [field]: newValue } : stat
    );
    
    setSchoolStats({
      ...schoolStats,
      [category]: updatedItems
    });
  };

  const handleSaveStats = async (category: string) => {
    if (!schoolStats) return;
    try {
      setToast({ message: 'جاري حفظ الإحصائيات...', type: 'success' });
      const sanitizedItems = schoolStats[category].map(({ icon, ...rest }: any) => rest);
      const { error } = await supabase.from('excellence_stats').upsert({ id: category, items: sanitizedItems });
      if (error) throw error;
      setToast({ message: 'تم حفظ الإحصائيات بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `excellence_stats/${category}`);
    }
  };

  const handleAddStatItem = async (category: string) => {
    if (!schoolStats) return;
    const newItem = { label: "بيان جديد", value: "-", icon: Hash };
    const updatedItems = [...schoolStats[category], newItem];
    
    setSchoolStats({
      ...schoolStats,
      [category]: updatedItems
    });

    try {
      const sanitizedItems = updatedItems.map(({ icon, ...rest }: any) => rest);
      const { error } = await supabase.from('excellence_stats').upsert({ id: category, items: sanitizedItems });
      if (error) throw error;
      setToast({ message: 'تم إضافة البيان بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `excellence_stats/${category}`);
    }
  };

  const handleDeleteStatItem = async (category: string, index: number) => {
    if (!schoolStats || !confirm('هل أنت متأكد من حذف هذا البيان؟')) return;
    const updatedItems = schoolStats[category].filter((_: any, i: number) => i !== index);
    
    setSchoolStats({
      ...schoolStats,
      [category]: updatedItems
    });

    try {
      const sanitizedItems = updatedItems.map(({ icon, ...rest }: any) => rest);
      const { error } = await supabase.from('excellence_stats').upsert({ id: category, items: sanitizedItems });
      if (error) throw error;
      setToast({ message: 'تم حذف البيان بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `excellence_stats/${category}`);
    }
  };

  const handleAddTask = async () => {
    try {
      const newTask = { text: "مهمة جديدة" };
      const { error } = await supabase.from('excellence_tasks').insert(newTask);
      if (error) throw error;
      setToast({ message: 'تم إضافة المهمة بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'excellence_tasks');
    }
  };

  const handleUpdateTask = (index: number, value: string) => {
    setTasks(prev => prev.map((t, i) => i === index ? value : t));
  };

  const handleSaveTasks = async () => {
    try {
      setToast({ message: 'جاري حفظ المهام...', type: 'success' });
      // This is a bit complex because we don't have IDs in the state easily
      // Let's fetch them first or just delete and re-insert (not ideal but simple)
      // Better: fetch all and update
      const { data } = await supabase.from('excellence_tasks').select('id').order('created_at', { ascending: true });
      if (data) {
        for (let i = 0; i < tasks.length; i++) {
          if (data[i]) {
            await supabase.from('excellence_tasks').update({ text: tasks[i] }).eq('id', data[i].id);
          } else {
            await supabase.from('excellence_tasks').insert({ text: tasks[i] });
          }
        }
        // Delete extra tasks
        if (data.length > tasks.length) {
          const idsToDelete = data.slice(tasks.length).map(d => d.id);
          await supabase.from('excellence_tasks').delete().in('id', idsToDelete);
        }
      }
      setToast({ message: 'تم حفظ المهام بنجاح', type: 'success' });
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'excellence_tasks');
    }
  };

  const handleDeleteTask = async (index: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    try {
      const { data } = await supabase.from('excellence_tasks').select('id').order('created_at', { ascending: true });
      if (data && data[index]) {
        const { error } = await supabase.from('excellence_tasks').delete().eq('id', data[index].id);
        if (error) throw error;
        setTasks(prev => prev.filter((_, i) => i !== index));
        setToast({ message: 'تم حذف المهمة بنجاح', type: 'success' });
      }
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, 'excellence_tasks');
    }
  };

  const handleUpdateMember = async (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleAddMember = async () => {
    try {
      console.log("Attempting to add new member...");
      setToast({ message: 'جاري إضافة عضو جديد...', type: 'success' });
      const newMember = {
        role: "عضو جديد",
        title: "مسمى العضو",
        description: "وصف مهام العضو",
        color: "bg-slate-500"
      };
      const { data, error } = await supabase.from('excellence_members').insert(newMember).select().single();
      
      if (error) throw error;
      console.log("Member added successfully with ID:", data.id);
      setMembers(prev => [...prev, { ...data, docId: data.id }]);
      setToast({ message: 'تمت إضافة العضو بنجاح', type: 'success' });
    } catch (error: any) {
      console.error("Failed to add member:", error);
      const errorMsg = error?.message?.includes('permission-denied') 
        ? 'عذراً، ليس لديك صلاحية الإضافة. تأكد من تسجيل الدخول بالبريد الصحيح.' 
        : `فشل إضافة العضو: ${error.message || 'خطأ غير معروف'}`;
      setToast({ message: errorMsg, type: 'error' });
      handleSupabaseError(error, OperationType.CREATE, 'excellence_members');
    }
  };

  const handleDeleteMember = async (docId: string) => {
    try {
      const { error } = await supabase.from('excellence_members').delete().eq('id', docId);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `excellence_members/${docId}`);
    }
  };

  const handleSaveMembers = async () => {
    try {
      setToast({ message: 'جاري حفظ التعديلات...', type: 'success' });
      for (const member of members) {
        if (member.docId) {
          const { docId, ...rest } = member;
          const { error } = await supabase.from('excellence_members').update(rest).eq('id', docId);
          if (error) throw error;
        }
      }
      setToast({ message: 'تم حفظ التعديلات بنجاح', type: 'success' });
      setTimeout(() => setActiveTab('members'), 1000);
    } catch (error: any) {
      const errorMsg = error?.message?.includes('permission-denied') 
        ? 'عذراً، ليس لديك صلاحية الحفظ. تأكد من قواعد الأمان.' 
        : `فشل حفظ التعديلات: ${error.message || 'خطأ غير معروف'}`;
      setToast({ message: errorMsg, type: 'error' });
      handleSupabaseError(error, OperationType.UPDATE, 'excellence_members');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-madrasati-dark font-['Cairo']">
      {/* Top Header - Madrasati Style */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-madrasati-green rounded-lg flex items-center justify-center text-white shadow-sm">
              <Award size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-tight text-madrasati-green">لجنة التميز</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">مجمع سعد بن عبادة التعليمي</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold">اسم المستخدم</span>
            <span className="text-[10px] text-slate-400">قائد المدرسة</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <Users size={20} />
          </div>
        </div>
      </header>

      {/* Sidebar - Madrasati Style */}
      <nav className="fixed top-16 right-0 h-[calc(100vh-64px)] w-64 bg-white border-l border-slate-200 z-50 hidden lg:block">
        <div className="py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full madrasati-sidebar-item ${
                activeTab === tab.id ? 'madrasati-sidebar-item-active' : ''
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-madrasati-green' : 'text-slate-400'} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:mr-64 pt-24 p-6 lg:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {loading.indicators || loading.history ? (
                  <div className="madrasati-card p-12 flex flex-col items-center justify-center text-slate-400">
                    <TrendingUp size={48} className="mb-4 opacity-20 animate-pulse" />
                    <p className="font-bold">جاري تحميل لوحة التحكم...</p>
                  </div>
                ) : (
                  <>
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-l from-madrasati-green to-[#26c4b7] rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <h1 className="text-3xl font-black mb-1">مرحباً بك في منصة لجنة التميز</h1>
                        <p className="text-xl font-bold text-white/90 mb-4">مجمع سعد بن عبادة التعليمي</p>
                        <p className="text-white/80 max-w-2xl">نعمل معاً لتحقيق أعلى معايير الجودة والتميز في بيئتنا المدرسية وفق رؤية المملكة 2030.</p>
                      </div>
                      <Award className="absolute -bottom-4 -left-4 text-white/10 w-48 h-48 rotate-12" />
                    </div>

                    {/* Concept and Goals - Madrasati Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="madrasati-card p-6">
                        <div className="flex items-center gap-3 text-madrasati-green mb-4">
                          <Target size={28} />
                          <h3 className="text-xl font-bold">مفهوم اللجنة</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          لجنة مدرسية تُعنى بتطبيق معايير التميز المؤسسي والتعليمي، وتسعى لتحسين الأداء العام ونشر ثقافة الجودة والإبداع وتحقيق نتائج تعليمية متميزة.
                        </p>
                      </div>

                      <div className="madrasati-card p-6">
                        <div className="flex items-center gap-3 text-madrasati-orange mb-4">
                          <Award size={28} />
                          <h3 className="text-xl font-bold">أهدافنا</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            'تحسين الأداء العام للمدرسة',
                            'نشر ثقافة الجودة والإبداع',
                            'تحقيق نتائج تعليمية متميزة',
                            'الاستعداد للمنافسة في الجوائز'
                          ].map((goal, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                              <CheckCircle2 size={14} className="text-madrasati-green" />
                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Achievement Highlight */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="madrasati-card p-6 bg-madrasati-dark text-white border-none flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-2">
                          <TrendingUp className={status.color} size={24} />
                          <span className={`${status.bg}/20 ${status.color} text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider`}>مؤشر الأداء العام</span>
                        </div>
                        
                        <h3 className="text-sm font-bold mb-1 opacity-80">مستوى الأداء العام</h3>
                        
                        <GaugeChart value={averageProgress} />
                        
                        <div className="mt-4 flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            <span className={`${status.color} text-lg font-black`}>{status.label}</span>
                            {history.length > 0 && (
                              <div className={`flex items-center gap-1 text-xs font-bold ${getAverageChange() >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {getAverageChange() >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                                <span>{getAverageChange() > 0 ? '+' : ''}{getAverageChange()}%</span>
                              </div>
                            )}
                          </div>
                          <span className="text-white/40 text-[10px] font-bold mt-1">تحديث تلقائي بناءً على المؤشرات</span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 madrasati-card p-6 flex flex-col justify-center bg-white">
                        <h3 className="text-lg font-bold text-madrasati-dark mb-3">رؤية التميز</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                          نسعى لأن نكون نموذجاً رائداً في تطبيق معايير التميز التعليمي، من خلال تمكين المعلمين وتحفيز الطلاب إشراك المجتمع المدرسي في رحلة التطوير المستمر نحو مستقبل تعليمي مشرق.
                        </p>
                      </div>
                    </div>

                    {/* Management and Follow-up - Moved to bottom */}
                    <div className="madrasati-card p-8 border-2 border-madrasati-green/30 bg-emerald-50/20 max-w-2xl mx-auto">
                      <div className="flex items-center justify-center gap-4 text-madrasati-green mb-6">
                        <ShieldCheck size={32} />
                        <h3 className="text-2xl font-black">إدارة ومتابعة</h3>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="w-24 h-24 bg-madrasati-green text-white rounded-full flex items-center justify-center shadow-xl shrink-0">
                          <Users size={48} />
                        </div>
                        <div className="text-center md:text-right">
                          <h4 className="text-2xl font-black text-madrasati-dark">أ. وليد العبدلي</h4>
                          <p className="text-sm text-slate-500 font-bold mt-2">المشرف العام على أعمال اللجنة</p>
                          <div className="mt-4 flex items-center justify-center md:justify-end gap-2 text-madrasati-green">
                            <CheckCircle2 size={18} />
                            <span className="text-xs font-bold">مجمع سعد بن عبادة التعليمي</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {members.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 madrasati-card p-12 flex flex-col items-center justify-center text-slate-400">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">لا يوجد أعضاء مضافون حالياً</p>
                  </div>
                ) : (
                  members.map((member, i) => (
                    <div key={member.docId || i} className="madrasati-card p-6 flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full ${member.color || 'bg-slate-500'} text-white flex items-center justify-center mb-4 shadow-md`}>
                        <Users size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-madrasati-dark">{member.role}</h3>
                      <p className="text-madrasati-green text-xs font-bold mb-3">{member.title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{member.description}</p>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                {!schoolStats ? (
                  <div className="madrasati-card p-12 flex flex-col items-center justify-center text-slate-400">
                    <BarChart3 size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">جاري تحميل الإحصائيات...</p>
                  </div>
                ) : (
                  <>
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* General Stats - Full Width School Profile */}
                      <div className="md:col-span-2 madrasati-card p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-madrasati-green border-b border-slate-100 pb-3">
                          <BarChart3 size={20} />
                          بيانات المدرسة العامة
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {schoolStats.general.map((stat: any, i: number) => (
                            <div key={i} className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                              <div className="w-8 h-8 rounded-full bg-madrasati-green/10 flex items-center justify-center text-madrasati-green shrink-0">
                                <stat.icon size={16} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] text-slate-500 font-bold mb-0.5">{stat.label}</p>
                                <p className="text-sm font-black text-madrasati-dark truncate">{stat.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Class Stats */}
                      <div className="madrasati-card p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-madrasati-orange">
                          <School size={20} />
                          إحصائيات الفصول
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {schoolStats.classes.map((stat: any, i: number) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-lg text-center">
                              <stat.icon size={20} className="mx-auto mb-2 text-slate-400" />
                              <p className="text-2xl font-black text-madrasati-orange">{stat.value}</p>
                              <p className="text-[10px] text-slate-500">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Building Stats */}
                      <div className="madrasati-card p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
                          <School size={20} />
                          إحصائيات المبنى المدرسي
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {schoolStats.building.map((stat: any, i: number) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-lg text-center">
                              <stat.icon size={20} className="mx-auto mb-2 text-slate-400" />
                              <p className="text-2xl font-black text-indigo-600">{stat.value}</p>
                              <p className="text-[10px] text-slate-500">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Staff Stats */}
                      <div className="madrasati-card p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
                          <Users size={20} />
                          إحصائية منسوبي المدرسة
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {schoolStats.staff.map((stat: any, i: number) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-lg text-center">
                              <stat.icon size={20} className="mx-auto mb-2 text-slate-400" />
                              <p className="text-2xl font-black text-rose-600">{stat.value}</p>
                              <p className="text-[10px] text-slate-500">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Organizational Structure Section */}
                    <div className="madrasati-card p-4 md:p-10 bg-white overflow-hidden relative">
                      {/* Artistic Background Elements */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-40 -z-10"></div>
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-40 -z-10"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-madrasati-green to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200 flex items-center justify-center">
                            <Users size={32} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-800">الهيكل التنظيمي</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="w-2 h-2 bg-madrasati-green rounded-full"></span>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Excellence Committee Structure</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hidden md:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">العام الدراسي</p>
                          <p className="text-sm font-black text-slate-700">1447هـ</p>
                        </div>
                      </div>
                      
                      <div className="relative py-12 flex flex-col items-center">
                        {/* THE NEW HIERARCHY STRUCTURE FROM IMAGE */}
                        
                        {/* LEVEL 1: PRINCIPAL */}
                        <div className="relative z-10 mb-12">
                          <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0b2633] text-white px-16 py-4 rounded shadow-xl border-b-4 border-emerald-500 w-full max-w-xl text-center relative group"
                          >
                            <h4 className="text-2xl font-black">مدير المدرسة</h4>
                          </motion.div>
                          
                          {/* Main Trunk Line */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-1.5 h-32 bg-emerald-500/40"></div>
                        </div>

                        {/* LEVEL 2: SECRETARY (Side Branch) */}
                        <div className="relative z-10 w-full max-w-6xl mb-12">
                          <div className="flex justify-start items-center relative">
                            {/* Horizontal Line to Secretary */}
                            <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-[20%] h-1 bg-emerald-500/40 hidden lg:block">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60">
                                <ArrowRight className="rotate-0" size={16} />
                              </div>
                            </div>

                            <motion.div 
                               initial={{ opacity: 0, x: 50 }}
                               whileInView={{ opacity: 1, x: 0 }}
                               viewport={{ once: true }}
                               className="lg:ml-[70%] bg-[#d1d5db] text-slate-800 px-12 py-4 rounded border border-slate-400 shadow-md min-w-[200px] text-center font-bold text-lg relative z-20"
                            >
                              سكرتير
                            </motion.div>
                          </div>
                        </div>

                        {/* LEVEL 3: THE THREE PILLARS */}
                        <div className="relative z-10 w-full max-w-7xl pt-8 px-4">
                          {/* Horizontal connecting bar for pillars */}
                          <div className="absolute top-0 left-[10%] right-[10%] h-1.5 bg-emerald-500/40 rounded-full hidden lg:block">
                            {/* Vertical connectors to pillars */}
                            <div className="absolute left-0 top-0 w-1.5 h-8 bg-emerald-500/40"></div>
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-8 bg-emerald-500/40"></div>
                            <div className="absolute right-0 top-0 w-1.5 h-8 bg-emerald-500/40"></div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xl">
                            {/* COLUMN 1: EDUCATIONAL AFFAIRS */}
                            <div className="flex flex-col border-r border-slate-300">
                              <div className="bg-[#e2e8f0] p-4 text-center border-b border-slate-300">
                                <h5 className="text-xl font-black text-slate-800 uppercase tracking-tight">وكيل الشؤون التعليمية</h5>
                              </div>
                              <div className="flex flex-col divide-y divide-slate-200">
                                {[
                                  "معلمو المواد الدراسية",
                                  "معلم التربية الخاصة",
                                  "معلم الموهوبين",
                                  "مساعد معلم"
                                ].map((item, idx) => (
                                  <div key={idx} className="p-4 text-center font-bold text-slate-700 hover:bg-emerald-50 transition-colors">
                                    {item}
                                  </div>
                                ))}
                                {/* Empty fillers for balance if needed */}
                                <div className="p-4 flex-grow bg-slate-50/30"></div>
                              </div>
                            </div>

                            {/* COLUMN 2: STUDENT AFFAIRS */}
                            <div className="flex flex-col border-r border-slate-300 bg-emerald-50/5">
                              <div className="bg-[#e2e8f0] p-4 text-center border-b border-slate-300">
                                <h5 className="text-xl font-black text-slate-800 uppercase tracking-tight">وكيل الشؤون الطلابية</h5>
                              </div>
                              <div className="flex flex-col divide-y divide-slate-200">
                                {[
                                  { text: "المساعد الإداري", sub: "( شؤون الطلاب )", color: "text-madrasati-orange" },
                                  { text: "رائد النشاط" },
                                  { text: "الموجه الطلابي" },
                                  { text: "الموجه الصحي" },
                                  { text: "مسجل المعلومات" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-4 text-center font-bold text-slate-700 hover:bg-emerald-50 transition-colors">
                                    {typeof item === 'string' ? item : (
                                      <div className="flex flex-col items-center">
                                        <span>{item.text}</span>
                                        {item.sub && <span className={`text-xs mt-1 ${item.color || 'text-slate-400'}`}>{item.sub}</span>}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* COLUMN 3: SCHOOL AFFAIRS */}
                            <div className="flex flex-col">
                              <div className="bg-[#e2e8f0] p-4 text-center border-b border-slate-300">
                                <h5 className="text-xl font-black text-slate-800 uppercase tracking-tight">وكيل الشؤون المدرسية</h5>
                              </div>
                              <div className="flex flex-col divide-y divide-slate-200">
                                {[
                                  { text: "المساعد الإداري", sub: "( الخدمات المساندة والجودة )", color: "text-madrasati-orange" },
                                  { text: "المساعد الإداري", sub: "( تقنية المعلومات )", color: "text-madrasati-orange" },
                                  { text: "محضر المختبر" },
                                  { text: "أمين مصادر التعلم" },
                                  { text: "الحارس" },
                                  { text: "عامل الخدمات" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-4 text-center font-bold text-slate-700 hover:bg-emerald-50 transition-colors">
                                    <div className="flex flex-col items-center">
                                      <span>{item.text}</span>
                                      {item.sub && <span className={`text-xs mt-1 ${item.color || 'text-slate-400'}`}>{item.sub}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visual Legend / Caption */}
                        <div className="mt-12 px-8 py-3 bg-slate-900/5 backdrop-blur-sm rounded-full border border-slate-200 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-black text-slate-600">الهيكل العام للمدرسة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'indicators' && (
              <motion.div
                key="indicators"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {indicators.map((ind, i) => (
                    <div key={i} className="madrasati-card p-8 group hover:border-madrasati-green transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${ind.bgColor} ${ind.color} group-hover:scale-110 transition-transform`}>
                          <ind.icon size={32} />
                        </div>
                        <div className="text-left">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مؤشر أداء</span>
                            <div className="flex items-center gap-2">
                              {history.length > 0 && (
                                <div className={`flex items-center gap-1 text-xs font-bold ${getIndicatorChange(i) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {getIndicatorChange(i) >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                  <span>{getIndicatorChange(i) > 0 ? '+' : ''}{getIndicatorChange(i)}%</span>
                                </div>
                              )}
                              <span className={`text-2xl font-black ${ind.color}`}>{ind.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black mb-2">{ind.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{ind.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">نسبة الإنجاز</span>
                          <span className="text-[10px] font-bold text-slate-600">{ind.progress}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${ind.progress}%` }}
                            className={`h-full ${ind.color.replace('text-', 'bg-')}`}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-madrasati-green/5 group-hover:border-madrasati-green/20 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-madrasati-orange"></div>
                          <span className="text-[10px] font-bold text-madrasati-orange uppercase">المبادرة المرتبطة</span>
                        </div>
                        <p className="text-lg font-bold text-madrasati-dark">{ind.initiative}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Section */}
                <div className="bg-madrasati-dark rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                      <h3 className="text-2xl font-bold mb-3">متابعة مؤشرات التميز</h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        يتم رصد هذه المؤشرات بشكل دوري لضمان تحقيق مستهدفات الخطة التشغيلية للمدرسة والارتقاء بمستوى الأداء التعليمي والإداري.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center px-6 py-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-3xl font-black text-madrasati-green">4</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase">مجالات رئيسية</p>
                      </div>
                      <div className="text-center px-6 py-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-3xl font-black text-madrasati-orange">4</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase">مبادرات نوعية</p>
                      </div>
                    </div>
                  </div>
                  <Target className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <SectionHeader 
                  title="الأهداف التشغيلية" 
                  icon={Milestone} 
                  subtitle="متابعة الأهداف الاستراتيجية والتشغيلية للمدرسة"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {operationalGoals.map((goal) => (
                    <div key={goal.id} className="madrasati-card p-8 group hover:border-madrasati-green transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-madrasati-green/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:w-32 group-hover:h-32"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-madrasati-green/10 text-madrasati-green rounded-xl">
                            <Flag size={24} />
                          </div>
                          <h3 className="text-xl font-black text-madrasati-dark">{goal.mainGoal}</h3>
                        </div>

                        <div className="space-y-6 mb-8">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">الأهداف التابعة والنتائج</p>
                          {goal.subGoals.map((sg: any, idx: number) => (
                            <div key={idx} className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-madrasati-orange shrink-0"></div>
                                <p className="text-sm text-slate-600 leading-relaxed font-bold">{typeof sg === 'string' ? sg : sg.text}</p>
                              </div>
                              
                              {typeof sg === 'object' && (sg.baseline !== undefined || sg.target !== undefined) && (
                                <div className="grid grid-cols-3 gap-2 mr-4">
                                  <div className="bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-100">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">خط الأساس</p>
                                    <p className="text-xs font-black text-slate-600">{sg.baseline}%</p>
                                  </div>
                                  <div className="bg-emerald-50/50 px-3 py-2 rounded-lg border border-emerald-100">
                                    <p className="text-[8px] font-bold text-emerald-600 uppercase mb-0.5">المستهدف</p>
                                    <p className="text-xs font-black text-emerald-600">{sg.target}%</p>
                                  </div>
                                  <div className="bg-amber-50/50 px-3 py-2 rounded-lg border border-amber-100">
                                    <p className="text-[8px] font-bold text-amber-600 uppercase mb-0.5">التغير</p>
                                    <p className="text-xs font-black text-amber-600">+{sg.change}%</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'attachments' && (
              <motion.div
                key="attachments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <SectionHeader 
                    title="مركز المرفقات" 
                    icon={FolderOpen} 
                    subtitle="تحميل ومعاينة الوثائق والملفات الرسمية للجنة"
                  />
                  {user && (
                    <label className="flex items-center gap-2 bg-madrasati-green text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-emerald-700 transition-all shadow-md">
                      <UploadCloud size={20} />
                      رفع ملف جديد
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attachments.map((file) => (
                    <div key={file.docId} className="madrasati-card p-6 group hover:border-madrasati-green transition-all relative">
                      {user && (
                        <button 
                          onClick={() => handleDeleteAttachment(file.docId)}
                          className="absolute top-4 left-4 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-madrasati-green/10 group-hover:text-madrasati-green transition-colors">
                          <FileText size={28} />
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">
                          {file.type}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-madrasati-dark mb-1 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">{file.category}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-6">
                        <span>{file.size}</span>
                        <span>{file.date}</span>
                      </div>

                      <a 
                        href={file.url || '#'} 
                        target={file.url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${
                          file.url 
                            ? 'bg-slate-50 text-slate-600 hover:bg-madrasati-green hover:text-white' 
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                        onClick={(e) => !file.url && e.preventDefault()}
                      >
                        <Download size={16} />
                        {file.url ? 'تحميل الملف' : 'رابط غير متوفر'}
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {reports.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 madrasati-card p-12 flex flex-col items-center justify-center text-slate-400">
                    <ShieldCheck size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">لا توجد تقارير محمية حالياً</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.docId} className="madrasati-card p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                          <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-madrasati-dark">{report.name}</h3>
                      </div>
                      
                      {!unlockedReports[report.docId] ? (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-500">هذا التقرير محمي بكلمة مرور. يرجى إدخالها للمتابعة.</p>
                          <div className="flex gap-2">
                            <input 
                              type="password" 
                              placeholder="كلمة المرور"
                              value={reportPassword[report.docId] || ''}
                              onChange={(e) => setReportPassword(prev => ({ ...prev, [report.docId]: e.target.value }))}
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 outline-none"
                            />
                            <button 
                              onClick={() => handleUnlockReport(report.docId, reportPassword[report.docId], report.password)}
                              className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition-all"
                            >
                              فتح
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle2 size={16} />
                              <span className="text-xs font-bold">تم فك التشفير</span>
                            </div>
                            <a 
                              href={report.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-madrasati-green hover:underline text-xs font-bold flex items-center gap-1"
                            >
                              <Download size={14} />
                              تحميل التقرير
                            </a>
                          </div>
                          <button 
                            onClick={() => setUnlockedReports(prev => ({ ...prev, [report.docId]: false }))}
                            className="w-full py-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            إعادة القفل
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span>تاريخ الرفع: {report.date}</span>
                        <FileText size={14} />
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto"
              >
                <SectionHeader 
                  title="لوحة التحكم" 
                  icon={Settings} 
                  subtitle="إدارة بيانات المدرسة والمؤشرات التشغيلية"
                />

                {!user ? (
                  <Login onLogin={() => setActiveTab('admin')} setUser={setUser} />
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">Admin</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">مسؤول النظام</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          supabase.auth.signOut();
                          localStorage.removeItem('excellence_admin_session');
                          setUser(null);
                          setActiveTab('overview');
                        }}
                        className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </div>

                    <div className="madrasati-card overflow-hidden mb-8">
                      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">إدارة التقارير المحمية</h3>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">اسم التقرير</label>
                            <input 
                              id="new-report-name"
                              type="text" 
                              placeholder="مثال: تقرير الفصل الأول"
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">كلمة المرور</label>
                            <input 
                              id="new-report-password"
                              type="text" 
                              placeholder="تعيين كلمة مرور"
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">ملف التقرير</label>
                            <div className="relative group">
                              <input 
                                id="new-report-file"
                                type="file" 
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  const label = document.getElementById('file-label');
                                  if (file && label) label.innerText = file.name;
                                }}
                              />
                              <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-madrasati-green hover:bg-emerald-50 transition-all">
                                <UploadCloud className="text-slate-400" size={20} />
                                <span id="file-label" className="text-sm font-bold text-slate-500">اختر ملف التقرير (PDF فقط)</span>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <button 
                              onClick={() => {
                                const nameEl = document.getElementById('new-report-name') as HTMLInputElement;
                                const passEl = document.getElementById('new-report-password') as HTMLInputElement;
                                const fileEl = document.getElementById('new-report-file') as HTMLInputElement;
                                const file = fileEl.files?.[0];
                                
                                if (nameEl.value && passEl.value && file) {
                                  handleAddReport(nameEl.value, passEl.value, file);
                                  nameEl.value = '';
                                  passEl.value = '';
                                  fileEl.value = '';
                                  const label = document.getElementById('file-label');
                                  if (label) label.innerText = 'اختر ملف التقرير';
                                } else {
                                  alert('يرجى إدخال الاسم وكلمة المرور واختيار ملف');
                                }
                              }}
                              className="w-full bg-madrasati-green text-white px-4 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={18} />
                              إضافة تقرير محمي
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">التقارير الحالية</h4>
                          {reports.length === 0 ? (
                            <p className="text-center py-8 text-slate-400 text-sm">لا توجد تقارير مضافة</p>
                          ) : (
                            reports.map((report) => (
                              <div key={report.docId} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                    <ShieldCheck size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-madrasati-dark">{report.name}</p>
                                    <p className="text-[10px] text-slate-400">كلمة المرور: {report.password} • {report.date}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDeleteReport(report.docId)}
                                  className="text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>




















                    <div className="madrasati-card overflow-hidden mb-8">
                      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">إدارة المؤشرات الرئيسية</h3>
                        <button 
                          onClick={handleAddIndicator}
                          className="flex items-center gap-2 bg-madrasati-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                        >
                          <Plus size={18} />
                          إضافة مؤشر جديد
                        </button>
                      </div>
                      <div className="p-8 space-y-6">
                        {indicators.map((ind, i) => (
                          <div key={ind.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 relative group">
                            <button 
                              onClick={() => handleDeleteIndicator(ind.id)}
                              className="absolute top-4 left-4 text-slate-300 hover:text-rose-500 transition-colors"
                              title="حذف المؤشر"
                            >
                              <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">عنوان المؤشر</label>
                                <input 
                                  type="text" 
                                  value={ind.title}
                                  onChange={(e) => handleUpdateIndicator(ind.id, 'title', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">المبادرة</label>
                                <input 
                                  type="text" 
                                  value={ind.initiative}
                                  onChange={(e) => handleUpdateIndicator(ind.id, 'initiative', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold text-madrasati-green"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">الوصف</label>
                                <textarea 
                                  value={ind.description}
                                  onChange={(e) => handleUpdateIndicator(ind.id, 'description', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-sm min-h-[60px]"
                                />
                              </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1 max-w-md">
                                <label className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">نسبة الإنجاز (%)</label>
                                <div className="flex-1 relative h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    step="0.01"
                                    value={ind.progress}
                                    onChange={(e) => handleUpdateIndicator(ind.id, 'progress', parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <motion.div 
                                    initial={false}
                                    animate={{ width: `${ind.progress}%` }}
                                    className={`h-full ${ind.color.replace('text-', 'bg-')}`}
                                  />
                                </div>
                                <input 
                                  type="number" 
                                  step="0.01"
                                  value={ind.progress}
                                  onChange={(e) => handleUpdateIndicator(ind.id, 'progress', parseFloat(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-sm"
                                />
                              </div>
                              <button 
                                onClick={() => handleSaveIndicator(ind.id)}
                                className="bg-madrasati-green text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 text-sm"
                              >
                                حفظ المؤشر
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="madrasati-card overflow-hidden mb-8">
                      <div className="p-6 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700">تعديل نسب المؤشرات (سريع)</h3>
                      </div>
                  <div className="p-8 space-y-8">
                    <div className="p-6 bg-madrasati-green/5 border border-madrasati-green/20 rounded-xl mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-madrasati-green rounded-lg text-white">
                            <Target size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-madrasati-dark">نسبة المؤشر العام</p>
                            <p className="text-xs text-slate-500">التحكم في النسبة التي تظهر في المؤشر الرئيسي</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={saveSnapshot}
                            className="flex items-center gap-2 px-4 py-2 bg-madrasati-green text-white rounded-lg font-bold text-sm hover:bg-madrasati-green/90 transition-all shadow-sm"
                          >
                            <Calendar size={16} />
                            حفظ نقطة مرجعية (تاريخ)
                          </button>
                          <div className="flex items-center gap-2 mr-4">
                            <input 
                              type="checkbox" 
                              id="manual-mode"
                              checked={manualAverageProgress !== null}
                              onChange={(e) => setManualAverageProgress(e.target.checked ? averageProgress : null)}
                              className="w-4 h-4 text-madrasati-green rounded focus:ring-madrasati-green"
                            />
                            <label htmlFor="manual-mode" className="text-sm font-bold text-slate-600 cursor-pointer">إدخال يدوي</label>
                          </div>
                          <input 
                            type="number" 
                            step="0.01"
                            disabled={manualAverageProgress === null}
                            value={manualAverageProgress !== null ? manualAverageProgress : averageProgress}
                            onChange={(e) => setManualAverageProgress(parseFloat(e.target.value) || 0)}
                            className={`w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center font-black text-madrasati-green focus:ring-2 focus:ring-madrasati-green outline-none transition-all ${manualAverageProgress === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                            min="0"
                            max="100"
                          />
                          <span className="font-bold text-slate-400">%</span>
                        </div>
                      </div>
                      {manualAverageProgress !== null && (
                        <p className="text-[10px] text-amber-600 font-bold bg-amber-50 p-2 rounded border border-amber-100">
                          * تنبيه: النسبة مدخلة يدوياً ولن تتأثر بتغيير نسب المؤشرات الفرعية بالأسفل.
                        </p>
                      )}
                      {history.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-madrasati-green/10">
                          <p className="text-xs font-bold text-slate-500 mb-2">آخر النقاط المرجعية المحفوظة:</p>
                          <div className="flex flex-wrap gap-2">
                            {history.slice(0, 3).map((h, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600">
                                <Clock size={12} className="text-madrasati-green" />
                                <span>{h.date}</span>
                                <span className="text-madrasati-green">{h.average}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-slate-600 text-sm">سجل النقاط المرجعية (التاريخ)</h4>
                        {history.length > 0 && (
                          <button 
                            onClick={async () => {
                              if (!user) return;
                              for (const h of history) {
                                await supabase.from('excellence_history').delete().eq('id', (h as any).docId);
                              }
                            }}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            مسح السجل
                          </button>
                        )}
                      </div>
                      
                      {history.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <Clock size={32} className="mx-auto text-slate-300 mb-3" />
                          <p className="text-sm text-slate-400 font-bold">لا يوجد نقاط مرجعية محفوظة حالياً</p>
                          <p className="text-[10px] text-slate-400 mt-1">اضغط على "حفظ نقطة مرجعية" لتسجيل الحالة الحالية للمؤشرات</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {history.map((h, idx) => (
                            <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-madrasati-green/30 transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-madrasati-green/10 text-madrasati-green rounded-lg">
                                    <Calendar size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-700">{h.date}</p>
                                    <p className="text-[10px] text-slate-400">تم الحفظ في هذا التاريخ للمقارنة</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-left">
                                    <p className="text-lg font-black text-madrasati-green">{h.average}%</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">المؤشر العام</p>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteHistory(h.docId)}
                                    className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="حذف السجل"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-slate-50">
                                {h.indicators.map((ind, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">{ind.title}</span>
                                    <span className="text-[10px] font-black text-slate-700">{ind.progress}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                      <h4 className="font-bold text-slate-600 mb-6 text-sm">نسب المؤشرات الفرعية</h4>
                      <div className="space-y-8">
                        {indicators.map((ind, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${ind.bgColor} ${ind.color}`}>
                              <ind.icon size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-madrasati-dark">{ind.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{ind.initiative}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <input 
                              type="number" 
                              step="0.01"
                              value={ind.progress}
                              onChange={(e) => handleUpdateProgress(i, parseFloat(e.target.value) || 0)}
                              className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center font-black text-madrasati-green focus:ring-2 focus:ring-madrasati-green outline-none transition-all"
                              min="0"
                              max="100"
                            />
                            <span className="font-bold text-slate-400">%</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="0.01"
                            value={ind.progress}
                            onChange={(e) => handleUpdateProgress(i, parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <motion.div 
                            initial={false}
                            animate={{ width: `${ind.progress}%` }}
                            className={`h-full ${ind.color.replace('text-', 'bg-')}`}
                          />
                        </div>
                      </div>
                    ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button 
                          onClick={handleSaveIndicators}
                          className="bg-madrasati-green text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                        >
                          حفظ نسب المؤشرات
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="madrasati-card overflow-hidden mb-8">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">إدارة أعضاء اللجنة</h3>
                    <button 
                      onClick={handleAddMember}
                      className="flex items-center gap-2 bg-madrasati-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                    >
                      <Plus size={18} />
                      إضافة عضو جديد
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    {members.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Users size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm text-slate-400 font-bold">لا يوجد أعضاء مضافين حالياً</p>
                        <p className="text-[10px] text-slate-400 mt-1">اضغط على "إضافة عضو جديد" للبدء</p>
                      </div>
                    ) : (
                      members.map((member, idx) => (
                        <div key={member.docId || idx} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 relative group">
                          <button 
                            onClick={() => handleDeleteMember(member.docId)}
                            className="absolute top-4 left-4 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">الاسم</label>
                              <input 
                                type="text" 
                                value={member.role}
                                onChange={(e) => handleUpdateMember(idx, 'role', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">المسمى في اللجنة</label>
                              <input 
                                type="text" 
                                value={member.title}
                                onChange={(e) => handleUpdateMember(idx, 'title', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold text-madrasati-green"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">وصف المهام</label>
                              <textarea 
                                value={member.description}
                                onChange={(e) => handleUpdateMember(idx, 'description', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-sm min-h-[80px]"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={handleSaveMembers}
                      className="bg-madrasati-green text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      حفظ ومعاينة الأعضاء
                    </button>
                  </div>
                </div>

                <div className="madrasati-card overflow-hidden mb-8">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">مركز رفع الملفات</h3>
                  </div>
                  <div className="p-8">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-madrasati-green hover:bg-emerald-50/30 transition-all group relative">
                      <input 
                        type="file" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="relative z-0">
                        <div className="w-20 h-20 bg-madrasati-green/10 text-madrasati-green rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <UploadCloud size={40} />
                        </div>
                        <h4 className="text-lg font-bold text-madrasati-dark mb-2">اسحب الملفات هنا أو انقر للرفع</h4>
                        <p className="text-sm text-slate-400">PDF, DOCX, XLSX (الحد الأقصى 10 ميجابايت)</p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">الملفات المرفوعة حديثاً</h4>
                      {attachments.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                              <File size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-madrasati-dark">{file.name}</p>
                              <p className="text-[10px] text-slate-400">{file.size} • {file.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAttachment(file.docId || file.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="madrasati-card overflow-hidden mb-8">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">إدارة إحصائيات المدرسة</h3>
                  </div>
                  <div className="p-8 space-y-10">
                    {!schoolStats ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <BarChart3 size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">جاري تحميل الإحصائيات...</p>
                      </div>
                    ) : (
                      (Object.entries(schoolStats) as [string, any[]][]).map(([category, stats]) => (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center justify-between border-r-4 border-madrasati-green pr-3">
                            <h4 className="text-sm font-black text-madrasati-green uppercase tracking-widest">
                              {category === 'general' ? 'البيانات العامة' : 
                               category === 'classes' ? 'الفصول والطلاب' : 
                               category === 'staff' ? 'الهيئة التعليمية والإدارية' : 'المبنى والمرافق'}
                            </h4>
                            <button 
                              onClick={() => handleAddStatItem(category)}
                              className="p-1.5 bg-madrasati-green/10 text-madrasati-green rounded-lg hover:bg-madrasati-green hover:text-white transition-all"
                              title="إضافة بيان جديد"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group relative">
                                <button 
                                  onClick={() => handleDeleteStatItem(category, idx)}
                                  className="absolute -top-2 -left-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                                  title="حذف البيان"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <div className="p-2 bg-white rounded-lg text-slate-400">
                                  <stat.icon size={16} />
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">العنوان</p>
                                    <input 
                                      type="text" 
                                      value={stat.label}
                                      onChange={(e) => handleUpdateStat(category, idx, 'label', e.target.value)}
                                      className="w-full bg-transparent border-none p-0 text-[10px] font-bold text-slate-500 focus:ring-0 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">القيمة</p>
                                    <input 
                                      type="text" 
                                      value={stat.value}
                                      onChange={(e) => handleUpdateStat(category, idx, 'value', e.target.value)}
                                      className="w-full bg-transparent border-none p-0 text-xs font-black text-madrasati-dark focus:ring-0 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end pt-2">
                            <button 
                              onClick={() => handleSaveStats(category)}
                              className="text-[10px] font-bold bg-madrasati-green/10 text-madrasati-green px-3 py-1.5 rounded-lg hover:bg-madrasati-green hover:text-white transition-all"
                            >
                              حفظ {category === 'general' ? 'البيانات العامة' : category === 'classes' ? 'الفصول' : category === 'staff' ? 'المنسوبين' : 'المرافق'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setActiveTab('stats')}
                      className="bg-madrasati-green text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      حفظ ومعاينة الإحصائيات
                    </button>
                  </div>
                </div>

                <div className="madrasati-card overflow-hidden mb-8">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">إدارة الأهداف التشغيلية</h3>
                    <button 
                      onClick={handleAddGoal}
                      className="flex items-center gap-2 bg-madrasati-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all"
                    >
                      <Plus size={16} />
                      إضافة هدف جديد
                    </button>
                  </div>
                  <div className="p-8 space-y-12">
                    {operationalGoals.map((goal) => (
                      <div key={goal.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-6 relative group">
                        <button 
                          onClick={() => handleDeleteGoal(goal.docId || goal.id)}
                          className="absolute top-4 left-4 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 gap-4">
                          <label className="text-xs font-bold text-slate-400 uppercase">الهدف الرئيسي</label>
                          <input 
                            type="text" 
                            value={goal.mainGoal}
                            onChange={(e) => handleUpdateGoal(goal.id, 'mainGoal', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-madrasati-green outline-none font-bold"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                            الأهداف التابعة
                            <button 
                              onClick={() => handleAddSubGoal(goal.id)}
                              className="text-madrasati-green hover:underline flex items-center gap-1"
                            >
                              <PlusCircle size={12} />
                              إضافة هدف تابع
                            </button>
                          </label>
                          {goal.subGoals.map((sg: any, idx: number) => (
                            <div key={idx} className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl relative group/sub">
                              <button 
                                onClick={() => handleDeleteSubGoal(goal.id, idx)}
                                className="absolute top-2 left-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover/sub:opacity-100 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                              
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">نص الهدف التابع</label>
                                <input 
                                  type="text" 
                                  value={typeof sg === 'string' ? sg : sg.text}
                                  onChange={(e) => handleUpdateSubGoal(goal.id, idx, 'text', e.target.value)}
                                  placeholder="أدخل نص الهدف التابع..."
                                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-sm font-bold"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">خط الأساس</label>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={sg.baseline || 0}
                                    onChange={(e) => handleUpdateSubGoal(goal.id, idx, 'baseline', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center text-xs font-bold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">المستهدف</label>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={sg.target || 0}
                                    onChange={(e) => handleUpdateSubGoal(goal.id, idx, 'target', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center text-xs font-bold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">التغير</label>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={sg.change || 0}
                                    onChange={(e) => handleUpdateSubGoal(goal.id, idx, 'change', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center text-xs font-bold"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={handleSaveGoals}
                      className="bg-madrasati-green text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      حفظ ومعاينة النتائج
                    </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <div className="madrasati-card overflow-hidden">
                  <div className="bg-madrasati-dark p-6 text-white flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">مهام اللجنة</h3>
                      <p className="text-white/50 text-[10px]">قائمة المهام والمسؤوليات المعتمدة</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="w-8 h-8 rounded bg-madrasati-green/10 text-madrasati-green flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{task}</span>
                        <ChevronLeft size={16} className="mr-auto text-slate-300 group-hover:text-madrasati-green" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav - Madrasati Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-[60] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 ${
              activeTab === tab.id ? 'text-madrasati-green' : 'text-slate-400'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-white ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-rose-100"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-center text-slate-800 mb-2">تأكيد مسح كافة البيانات</h3>
              <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
                هل أنت متأكد من مسح كافة البيانات؟ لا يمكن التراجع عن هذه الخطوة وسيتم إعادة تهيئة الموقع.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={executeClearAllData}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                >
                  نعم، امسح الكل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {uploadProgress !== null && (
          <div className="fixed bottom-24 right-6 left-6 md:left-auto md:w-80 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 z-[120]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-madrasati-green/10 text-madrasati-green rounded-lg animate-pulse">
                <UploadCloud size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">جاري رفع الملف...</span>
                  <span className="text-xs font-black text-madrasati-green">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-madrasati-green"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold text-center">يرجى عدم إغلاق الصفحة حتى اكتمال الرفع</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
