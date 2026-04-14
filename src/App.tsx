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
  LogOut
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">خطأ في النظام</h2>
            <p className="text-slate-500 mb-6">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-madrasati-green text-white rounded-xl font-bold hover:bg-madrasati-green/90 transition-all"
            >
              إعادة تحميل الصفحة
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
  const [showPassLogin, setShowPassLogin] = useState(false);

  const isPlaceholder = supabase.auth.getSession === undefined || (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder'));

  const handleGoogleLogin = async () => {
    if (isPlaceholder) {
      setError('يرجى ضبط إعدادات VITE_SUPABASE_URL في Settings أولاً.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Login error:", err);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من إعدادات Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = () => {
    // Simple fallback for development/preview environment
    if (adminPass === 'admin123') {
      const mockUser = {
        id: 'admin-id',
        email: 'hussain5565@hotmail.com',
        user_metadata: { full_name: 'مدير النظام' }
      };
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

      {!showPassLogin ? (
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading || isPlaceholder}
            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>تسجيل الدخول بواسطة Google</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowPassLogin(true)}
            className="text-xs font-bold text-slate-400 hover:text-madrasati-green transition-colors"
          >
            أو الدخول بواسطة كلمة مرور المسؤول
          </button>
        </div>
      ) : (
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
            className="w-full py-4 bg-madrasati-green text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
          >
            دخول
          </button>
          <button 
            onClick={() => setShowPassLogin(false)}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
          >
            إلغاء
          </button>
        </div>
      )}
      
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
  const [user, setUser] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState({
    indicators: true,
    goals: true,
    history: true,
    stats: true,
    attachments: true
  });

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
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchIndicators = async () => {
      const { data, error } = await supabase.from('excellence_indicators').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_indicators');
      if (data) {
        const processed = data.map(docData => {
          const originalInd = INDICATORS_DATA.find(ind => ind.title === docData.title);
          return { 
            ...docData, 
            docId: docData.id,
            icon: originalInd?.icon || Target
          };
        });
        setIndicators(processed);
      }
      setLoading(prev => ({ ...prev, indicators: false }));
    };

    const fetchGoals = async () => {
      const { data, error } = await supabase.from('excellence_goals').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_goals');
      if (data) setOperationalGoals(data.map(d => ({ ...d, docId: d.id })));
      setLoading(prev => ({ ...prev, goals: false }));
    };

    const fetchHistory = async () => {
      const { data, error } = await supabase.from('excellence_history').select('*').order('date', { ascending: false });
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_history');
      if (data) setHistory(data.map(d => ({ ...d, docId: d.id })) as any);
      setLoading(prev => ({ ...prev, history: false }));
    };

    const fetchStats = async () => {
      const { data, error } = await supabase.from('excellence_stats').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_stats');
      if (data) {
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
      }
      setLoading(prev => ({ ...prev, stats: false }));
    };

    const fetchAttachments = async () => {
      const { data, error } = await supabase.from('excellence_attachments').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_attachments');
      if (data) setAttachments(data.map(d => ({ ...d, docId: d.id })));
      setLoading(prev => ({ ...prev, attachments: false }));
    };

    const fetchReports = async () => {
      const { data, error } = await supabase.from('excellence_reports').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_reports');
      if (data) setReports(data.map(d => ({ ...d, docId: d.id })));
    };

    const fetchMembers = async () => {
      const { data, error } = await supabase.from('excellence_members').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'excellence_members');
      if (data) setMembers(data.map(d => ({ ...d, docId: d.id })));
    };

    const fetchSettings = async () => {
      const { data, error } = await supabase.from('excellence_settings').select('*').eq('id', 'general').single();
      if (error && error.code !== 'PGRST116') handleSupabaseError(error, OperationType.GET, 'excellence_settings/general');
      if (data) setSettings(data as any);
    };

    fetchIndicators();
    fetchGoals();
    fetchHistory();
    fetchStats();
    fetchAttachments();
    fetchReports();
    fetchMembers();
    fetchSettings();

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
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthReady]);

  useEffect(() => {
    if (isAuthReady && user && (user.email === "hussain5565@hotmail.com" || user.email === "admin")) {
      initializeData();
    }
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
    const centerY = 130;
    const outerRadius = 85;
    const innerRadius = 60;
    const normalizedValue = Math.min(100, Math.max(0, value));
    const angle = (normalizedValue / 100) * 180 - 180;
    
    const segments = [
      { label: 'تهيئة', start: 0, end: 49, color: '#ff0000' },
      { label: 'انطلاق', start: 50, end: 74, color: '#ffc000' },
      { label: 'تقدم', start: 75, end: 89, color: '#4472c4' },
      { label: 'تميز', start: 90, end: 100, color: '#00b050' }
    ];

    const outerTicks = [10, 20, 30, 40, 49, 50, 65, 75, 90, 100];

    const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
      return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
      };
    };

    return (
      <div className="flex flex-col items-center w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-[#2e75b6] to-[#548235] py-3 text-center">
          <h2 className="text-white text-xl font-bold">نتيجة مؤشر الأداء العام</h2>
        </div>

        <div className="relative w-full h-64 flex items-center justify-center p-4">
          <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
            {/* Outer Grey Segmented Arc */}
            {Array.from({ length: 20 }).map((_, i) => {
              const startAngle = -180 + (i * 9);
              const endAngle = -180 + ((i + 1) * 9) - 1.5;
              const startPos = polarToCartesian(centerX, centerY, outerRadius, startAngle);
              const endPos = polarToCartesian(centerX, centerY, outerRadius, endAngle);
              return (
                <path
                  key={i}
                  d={`M ${startPos.x} ${startPos.y} A ${outerRadius} ${outerRadius} 0 0 1 ${endPos.x} ${endPos.y}`}
                  fill="none"
                  stroke={i < 14 ? "#e2e8f0" : i < 18 ? "#cbd5e1" : "#94a3b8"}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Inner Colored Segmented Arc */}
            {Array.from({ length: 40 }).map((_, i) => {
              const val = (i / 40) * 100;
              const startAngle = -180 + (i * 4.5);
              const endAngle = -180 + ((i + 1) * 4.5) - 1;
              const startPos = polarToCartesian(centerX, centerY, innerRadius, startAngle);
              const endPos = polarToCartesian(centerX, centerY, innerRadius, endAngle);
              
              let color = '#ff0000';
              if (val >= 50) color = '#ffc000';
              if (val >= 75) color = '#4472c4';
              if (val >= 90) color = '#00b050';

              return (
                <path
                  key={i}
                  d={`M ${startPos.x} ${startPos.y} A ${innerRadius} ${innerRadius} 0 0 1 ${endPos.x} ${endPos.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={18}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Outer Numeric Labels */}
            {outerTicks.map((tick) => {
              const tickAngle = (tick / 100) * 180 - 180;
              const pos = polarToCartesian(centerX, centerY, outerRadius + 15, tickAngle);
              return (
                <text
                  key={tick}
                  x={pos.x}
                  y={pos.y}
                  fill="#000"
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              );
            })}

            {/* Inner Text Labels with Pointers */}
            {segments.map((seg, i) => {
              const midAngle = ((seg.start + seg.end) / 2 / 100) * 180 - 180;
              const labelPos = polarToCartesian(centerX, centerY, innerRadius - 35, midAngle);
              const pointerStart = polarToCartesian(centerX, centerY, innerRadius - 10, midAngle);
              const pointerEnd = polarToCartesian(centerX, centerY, innerRadius - 25, midAngle);
              return (
                <g key={i}>
                  <line 
                    x1={pointerStart.x} y1={pointerStart.y} 
                    x2={pointerEnd.x} y2={pointerEnd.y} 
                    stroke="#000" strokeWidth="0.5" 
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#000"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            {/* Floating Indicator */}
            <motion.g
              initial={{ rotate: -180 }}
              animate={{ rotate: angle }}
              transition={{ type: "spring", stiffness: 40, damping: 12 }}
              style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
            >
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <circle
                cx={centerX + innerRadius}
                cy={centerY}
                r={8}
                fill="white"
                stroke={getPerformanceStatus(normalizedValue).hex}
                strokeWidth="2"
                filter="url(#glow)"
              />
              <circle
                cx={centerX + innerRadius}
                cy={centerY}
                r={4}
                fill={getPerformanceStatus(normalizedValue).hex}
              />
              {/* Pointer Triangle */}
              <path
                d={`M ${centerX + innerRadius + 8} ${centerY} L ${centerX + innerRadius + 16} ${centerY - 5} L ${centerX + innerRadius + 16} ${centerY + 5} Z`}
                fill={getPerformanceStatus(normalizedValue).hex}
              />
            </motion.g>
          </svg>
        </div>

        {/* Footer */}
        <div className="w-full bg-[#0b2633] py-2 text-center">
          <span className="text-white text-2xl font-black tracking-wider">{value.toFixed(2)}%</span>
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
      const { error } = await supabase.from('excellence_goals').insert({
        mainGoal: "هدف جديد",
        subGoals: [""],
        baseline: 0,
        target: 100,
        changeLastYear: 0
      });
      if (error) throw error;
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
      goal.id === goalId ? { ...goal, subGoals: [...goal.subGoals, ""] } : goal
    ));
  };

  const handleUpdateSubGoal = (goalId: number, subIndex: number, value: string) => {
    setOperationalGoals(operationalGoals.map(goal => 
      goal.id === goalId ? { 
        ...goal, 
        subGoals: goal.subGoals.map((sg, i) => i === subIndex ? value : sg) 
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setToast({ message: 'جاري رفع الملف...', type: 'success' });
        
        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `excellence/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        // 3. Save Metadata to Database
        const newAttachment = {
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toISOString().split('T')[0],
          category: "مرفقات جديدة",
          url: publicUrl,
          file_path: filePath
        };
        
        const { error: dbError } = await supabase.from('excellence_attachments').insert(newAttachment);
        if (dbError) throw dbError;
        
        setToast({ message: 'تم رفع الملف بنجاح', type: 'success' });
      } catch (error) {
        console.error("Upload error:", error);
        setToast({ message: 'فشل رفع الملف', type: 'error' });
        handleSupabaseError(error, OperationType.CREATE, 'excellence_attachments');
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
          .from('attachments')
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

  const handleAddReport = async (name: string, password: string) => {
    try {
      const { error } = await supabase.from('excellence_reports').insert({
        name,
        password,
        date: new Date().toISOString().split('T')[0],
        url: `https://picsum.photos/seed/${Math.random()}/800/600` // Placeholder for actual file upload
      });
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'excellence_reports');
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const { error } = await supabase.from('excellence_reports').delete().eq('id', id);
      if (error) throw error;
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setActiveTab('overview');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdateStat = async (category: string, index: number, newValue: string) => {
    if (!schoolStats) return;
    const updatedItems = schoolStats[category].map((stat: any, i: number) => 
      i === index ? { ...stat, value: newValue } : stat
    );
    
    setSchoolStats({
      ...schoolStats,
      [category]: updatedItems
    });

    try {
      // Strip non-serializable icon components from stats items before saving
      const sanitizedItems = updatedItems.map(({ icon, ...rest }: any) => rest);
      const { error } = await supabase.from('excellence_stats').upsert({ id: category, items: sanitizedItems });
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `excellence_stats/${category}`);
    }
  };

  const handleUpdateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleAddMember = async () => {
    try {
      console.log("Attempting to add new member...");
      setToast({ message: 'جاري إضافة عضو جديد...', type: 'success' });
      const { data, error } = await supabase.from('excellence_members').insert({
        role: "عضو جديد",
        title: "مسمى العضو",
        description: "وصف مهام العضو",
        color: "bg-slate-500"
      }).select().single();
      
      if (error) throw error;
      console.log("Member added successfully with ID:", data.id);
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
                          <p className="text-sm text-slate-500 font-bold mt-2">المشرف العام على أعمال اللجنة والمتابعة الميدانية</p>
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
                    <div className="madrasati-card p-8 bg-white">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-madrasati-green/10 rounded-lg text-madrasati-green">
                          <LayoutDashboard size={24} />
                        </div>
                        <h3 className="text-xl font-bold">الهيكل التنظيمي</h3>
                      </div>
                      <div className="relative aspect-[16/9] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-madrasati-green hover:bg-emerald-50/30 transition-all cursor-pointer overflow-hidden">
                        <img 
                          src={settings.orgStructureUrl} 
                          alt="الهيكل التنظيمي" 
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                        {!settings.orgStructureUrl.includes('picsum') && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        )}
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

                        <div className="space-y-4 mb-8">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">الأهداف التابعة</p>
                          {goal.subGoals.map((sg, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-madrasati-orange shrink-0"></div>
                              <p className="text-sm text-slate-600 leading-relaxed">{sg}</p>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">خط الأساس</p>
                            <p className="text-xl font-black text-slate-700">{goal.baseline}%</p>
                          </div>
                          <div className="bg-madrasati-green/5 p-4 rounded-xl border border-madrasati-green/10 text-center">
                            <p className="text-[10px] font-bold text-madrasati-green uppercase mb-1">المستهدف</p>
                            <p className="text-xl font-black text-madrasati-green">{goal.target}%</p>
                          </div>
                          <div className="bg-madrasati-orange/5 p-4 rounded-xl border border-madrasati-orange/10 text-center">
                            <p className="text-[10px] font-bold text-madrasati-orange uppercase mb-1">مقدار التغير</p>
                            <p className="text-xl font-black text-madrasati-orange">+{goal.changeLastYear}%</p>
                          </div>
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
                          <p className="text-sm font-bold text-slate-700">{user.email}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">مسؤول النظام</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          supabase.auth.signOut();
                          setUser(null);
                          setActiveTab('overview');
                        }}
                        className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </div>

                    {/* Diagnostic Info for the user */}
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[10px] mb-8">
                      <p className="mb-1 font-bold text-white border-b border-slate-700 pb-1 uppercase tracking-widest">Diagnostic Info</p>
                      <p>Status: <span className="text-white">Authenticated</span></p>
                      <p>Email: <span className="text-white">{user.email}</span></p>
                      <p>UID: <span className="text-white">{user.id}</span></p>
                      <p>Admin Match: <span className={user.email === 'hussain5565@hotmail.com' || user.email === 'hussain5565@gmail.com' ? 'text-emerald-400' : 'text-rose-400'}>
                        {user.email === 'hussain5565@hotmail.com' || user.email === 'hussain5565@gmail.com' ? 'YES (Authorized)' : 'NO (Check Email)'}
                      </span></p>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl mb-8 flex items-center justify-between">
                      <div>
                        <h4 className="text-rose-800 font-black mb-1">منطقة الخطر</h4>
                        <p className="text-rose-600/70 text-xs font-bold">يمكنك مسح كافة البيانات الافتراضية للبدء في إدخال بياناتك الحقيقية</p>
                      </div>
                      <button 
                        onClick={handleClearAllData}
                        className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg flex items-center gap-2"
                      >
                        <Trash2 size={20} />
                        مسح كافة البيانات الافتراضية
                      </button>
                    </div>

                    <div className="madrasati-card overflow-hidden mb-8">
                      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">إدارة التقارير المحمية</h3>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                          <div className="flex items-end">
                            <button 
                              onClick={() => {
                                const nameEl = document.getElementById('new-report-name') as HTMLInputElement;
                                const passEl = document.getElementById('new-report-password') as HTMLInputElement;
                                if (nameEl.value && passEl.value) {
                                  handleAddReport(nameEl.value, passEl.value);
                                  nameEl.value = '';
                                  passEl.value = '';
                                } else {
                                  alert('يرجى إدخال الاسم وكلمة المرور');
                                }
                              }}
                              className="w-full bg-madrasati-green text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
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
                      <div className="p-6 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700">إعدادات الهيكل التنظيمي</h3>
                      </div>
                      <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-full md:w-1/3 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group">
                            <img 
                              src={settings.orgStructureUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">معاينة الهيكل</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">رابط صورة الهيكل التنظيمي</label>
                              <div className="flex gap-2">
                                <input 
                                  id="org-structure-url"
                                  type="text" 
                                  defaultValue={settings.orgStructureUrl}
                                  placeholder="أدخل رابط الصورة هنا..."
                                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none font-bold text-sm"
                                />
                                <button 
                                  onClick={async () => {
                                    const input = document.getElementById('org-structure-url') as HTMLInputElement;
                                    if (input.value) {
                                      try {
                                        const { error } = await supabase.from('excellence_settings').upsert({ id: 'general', orgStructureUrl: input.value });
                                        if (error) throw error;
                                        setToast({ message: 'تم تحديث صورة الهيكل بنجاح', type: 'success' });
                                      } catch (error) {
                                        handleSupabaseError(error, OperationType.UPDATE, 'excellence_settings/general');
                                      }
                                    }
                                  }}
                                  className="px-6 py-2 bg-madrasati-green text-white rounded-lg font-bold hover:bg-emerald-700 transition-all text-sm flex items-center gap-2"
                                >
                                  <CheckCircle2 size={16} />
                                  حفظ الرابط
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                * ملاحظة: يرجى استخدام روابط صور مباشرة (تنتهي بـ .jpg أو .png) أو روابط من Google Drive (مشاركة عامة).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="madrasati-card overflow-hidden mb-8">
                      <div className="p-6 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700">تعديل نسب المؤشرات</h3>
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
                            disabled={manualAverageProgress === null}
                            value={manualAverageProgress !== null ? manualAverageProgress : averageProgress}
                            onChange={(e) => setManualAverageProgress(parseInt(e.target.value) || 0)}
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
                                <div className="text-left">
                                  <p className="text-lg font-black text-madrasati-green">{h.average}%</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">المؤشر العام</p>
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
                              value={ind.progress}
                              onChange={(e) => handleUpdateProgress(i, parseInt(e.target.value) || 0)}
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
                            value={ind.progress}
                            onChange={(e) => handleUpdateProgress(i, parseInt(e.target.value))}
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
                          <h4 className="text-sm font-black text-madrasati-green uppercase tracking-widest border-r-4 border-madrasati-green pr-3">
                            {category === 'general' ? 'البيانات العامة' : 
                             category === 'classes' ? 'الفصول والطلاب' : 
                             category === 'staff' ? 'الهيئة التعليمية والإدارية' : 'المبنى والمرافق'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="p-2 bg-white rounded-lg text-slate-400">
                                  <stat.icon size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                                  <input 
                                    type="text" 
                                    value={stat.value}
                                    onChange={(e) => handleUpdateStat(category, idx, e.target.value)}
                                    className="w-full bg-transparent border-none p-0 font-bold text-madrasati-dark focus:ring-0 outline-none"
                                  />
                                </div>
                              </div>
                            ))}
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
                          {goal.subGoals.map((sg, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                type="text" 
                                value={sg}
                                onChange={(e) => handleUpdateSubGoal(goal.id, idx, e.target.value)}
                                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-sm"
                              />
                              <button 
                                onClick={() => handleDeleteSubGoal(goal.id, idx)}
                                className="text-slate-300 hover:text-rose-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">خط الأساس (%)</label>
                            <input 
                              type="number" 
                              value={goal.baseline}
                              onChange={(e) => handleUpdateGoal(goal.id, 'baseline', parseInt(e.target.value) || 0)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">المستهدف (%)</label>
                            <input 
                              type="number" 
                              value={goal.target}
                              onChange={(e) => handleUpdateGoal(goal.id, 'target', parseInt(e.target.value) || 0)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">التغير عن العام الماضي (%)</label>
                            <input 
                              type="number" 
                              value={goal.changeLastYear}
                              onChange={(e) => handleUpdateGoal(goal.id, 'changeLastYear', parseInt(e.target.value) || 0)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-madrasati-green outline-none text-center font-bold"
                            />
                          </div>
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
                    {TASKS.map((task, i) => (
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
    </div>
  );
}
