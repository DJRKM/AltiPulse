'use client';

import React, { useState, useEffect, useRef } from 'react';
import DynamicBackground from '@/components/DynamicBackground';
import StartHikeCockpit from '@/components/StartHikeCockpit';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Zap,
  Bookmark,
  Activity,
  Bell,
  TrendingUp,
  Mountain,
  Compass,
  LogOut,
  Globe,
  CheckCircle2,
  CloudRain,
  CloudSnow,
  Cloud,
  CloudSun,
  Sun,
  Wind
} from 'lucide-react';

/* ============================================================ */
/*  HELPER: Get time-based greeting                              */
/* ============================================================ */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

/* ============================================================ */
/*  MAIN APP COMPONENT                                           */
/* ============================================================ */
export default function App() {
  /* ---- Session / Auth state ---- */
  const [session, setSession] = useState<{
    firstName: string;
    fullName: string;
    tier: string;
    hikingScore: number;
    totalVert: number;
    summits: number;
    savedTrailsCount: number;
    rank: number;
    ptsToNext: number;
  } | null>(null);

  /* ---- Auth form state ---- */
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);

  /* ---- UI Navigation & Feedback states ---- */
  const [socialToast, setSocialToast] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'Home' | 'Trails' | 'Altitude Map' | 'Leaderboard'>('Home');
  const [preselectedTrailId, setPreselectedTrailId] = useState<string>('mount_si');
  const [edgeGlow, setEdgeGlow] = useState(false);

  /* ---- Real-Time Weather State for Mannheim ---- */
  const [weather, setWeather] = useState({
    temp: 20,
    condition: 'Partly Cloudy',
    wind: 10,
    humidity: 52,
    code: 2,
    city: 'Mannheim'
  });

  const middleVidRef = useRef<HTMLVideoElement | null>(null);

  /* Fetch live weather for Mannheim */
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=49.4875&longitude=8.4660&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m')
      .then((res) => res.json())
      .then((data) => {
        if (data?.current) {
          const c = data.current;
          const code = c.weather_code;
          let condition = 'Clear Sky';
          if ([1, 2].includes(code)) condition = 'Partly Cloudy';
          else if (code === 3) condition = 'Overcast';
          else if ([45, 48].includes(code)) condition = 'Foggy';
          else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) condition = 'Rainy';
          else if ([71, 73, 75].includes(code)) condition = 'Snowy';
          else if ([95, 96, 99].includes(code)) condition = 'Thunderstorm';

          setWeather({
            temp: Math.round(c.temperature_2m),
            condition,
            wind: Math.round(c.wind_speed_10m),
            humidity: Math.round(c.relative_humidity_2m),
            code,
            city: 'Mannheim'
          });
        }
      })
      .catch(() => {});
  }, []);

  /* Ensure middle video plays immediately when dashboard is active */
  useEffect(() => {
    if (activeNav === 'Home' && middleVidRef.current) {
      middleVidRef.current.play().catch(() => {});
    }
  }, [session, activeNav]);

  /* ---- Handlers ---- */
  const triggerAuthSuccess = (displayName: string) => {
    setSession({
      firstName: displayName.split(' ')[0],
      fullName: displayName,
      tier: 'AltiPulse Pro',
      hikingScore: 842,
      totalVert: 8420,
      summits: 7,
      savedTrailsCount: 8,
      rank: 5,
      ptsToNext: 58
    });
    setEdgeGlow(true);
    setTimeout(() => setEdgeGlow(false), 3200);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = authMode === 'signup' && name ? name : 'Explorer';
    triggerAuthSuccess(displayName);
  };

  const loginAsDemo = () => {
    setSession({
      firstName: 'Roshan',
      fullName: 'Roshan M.',
      tier: 'Summit Elite',
      hikingScore: 842,
      totalVert: 8420,
      summits: 7,
      savedTrailsCount: 8,
      rank: 5,
      ptsToNext: 58
    });
    setEdgeGlow(true);
    setTimeout(() => setEdgeGlow(false), 3200);
  };

  const handleSocialClick = (provider: string) => {
    setSocialToast(provider);
    setTimeout(() => setSocialToast(null), 2400);
  };

  const handleLogout = () => {
    setSession(null);
    setActiveNav('Home');
  };

  /* Helper to render larger weather icon */
  const renderWeatherIcon = () => {
    const code = weather.code;
    const className = "w-11 h-11 text-[#FFE600] drop-shadow-[0_0_16px_rgba(255,230,0,0.65)] flex-shrink-0";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={className} />;
    if ([71, 73, 75].includes(code)) return <CloudSnow className={className} />;
    if (code === 3 || [45, 48].includes(code)) return <Cloud className={className} />;
    if ([1, 2].includes(code)) return <CloudSun className={className} />;
    return <Sun className={className} />;
  };

  /* ============================================================ */
  /*  RENDER                                                       */
  /* ============================================================ */
  return (
    <div className="relative min-h-screen w-full bg-[#050204] overflow-x-hidden selection:bg-[#f61d57] selection:text-white">
      {/* Base Layer: Dynamic ambient background (running_man_hor super blurred) */}
      <DynamicBackground paused={!!session} />

      {/* Subtle Yellow Edge Glow when transitioning into dashboard */}
      {edgeGlow && (
        <div className="fixed inset-0 pointer-events-none z-[200] yellow-edge-glow" />
      )}

      {/* Toast notification */}
      {socialToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] anim-slide-down">
          <div className="py-2 px-5 rounded-full navbar-glass border border-[#f61d57]/40 text-xs font-mono-data text-white flex items-center gap-2.5 shadow-[0_0_24px_rgba(246,29,87,0.35)]">
            <span className="w-2 h-2 rounded-full bg-[#f61d57] animate-pulse" />
            <span>{socialToast}</span>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  SCREEN 1: LAPTOP WIDESCREEN (LOGIN / SIGN UP)                   */}
      {/* ================================================================ */}
      {!session ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[1140px] laptop-card-glass rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 anim-fade-in-up">
            
            {/* ---------------------------------------------------------- */}
            {/* LEFT COLUMN: AUTH COCKPIT, BRANDING & TEXT FIELDS          */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10">
              
              {/* Top Header: Crisp Logo (no glow) + App Name + Language Dropdown */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 cursor-pointer">
                  <img
                    src="/logo.png"
                    alt="AltiPulse"
                    className="w-9 h-9 object-contain"
                  />
                  <span className="text-lg font-bold tracking-[0.2em] uppercase text-white font-brand">
                    AltiPulse
                  </span>
                </div>

                {/* Region / Language Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="liquid-glass-button text-xs py-1.5 px-3.5 rounded-full text-white/75 hover:text-white flex items-center gap-2 cursor-pointer font-brand"
                  >
                    <Globe className="w-3.5 h-3.5 text-white/50" />
                    <span>{language}</span>
                    <span className="text-[10px] text-white/40">▾</span>
                  </button>

                  {showLangMenu && (
                    <div className="absolute right-0 mt-2 w-32 rounded-2xl laptop-card-glass border border-white/12 py-1.5 z-50 text-xs text-white shadow-xl anim-slide-down">
                      {['English', 'Français', 'Deutsch', '日本語'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setShowLangMenu(false);
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-[#f61d57]/20 hover:text-[#f61d57] transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>{lang}</span>
                          {language === lang && <CheckCircle2 className="w-3 h-3 text-[#f61d57]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Title & Subtitle */}
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-brand mb-2 leading-tight">
                  Elevate Every <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                    Alpine Ascent.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-brand">
                  {authMode === 'signin'
                    ? 'Sync biometric vitals and alpine contours.'
                    : 'Join the global community of mountaineers and endurance trail runners.'}
                </p>
              </div>

              {/* Social Login Buttons: Liquid Glass */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialClick('Apple ID')}
                  className="liquid-glass-social py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.63 1.35-.58.67-.99 1.74-.85 2.78 1 .08 2.03-.51 2.56-1.26" />
                  </svg>
                  <span className="text-xs font-semibold text-white/90 hidden sm:inline font-brand">Apple</span>
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialClick('Google')}
                  className="liquid-glass-social py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span className="text-xs font-semibold text-white/90 hidden sm:inline font-brand">Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialClick('Facebook')}
                  className="liquid-glass-social py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-[#1877F2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-semibold text-white/90 hidden sm:inline font-brand">Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[11px] font-mono-data uppercase tracking-widest text-white/35">
                  OR
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-1.5 anim-fade-in-up">
                    <label className="text-xs font-medium text-white/70 font-brand ml-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-sm text-white placeholder-white/30 focus:outline-none font-brand"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70 font-brand ml-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-sm text-white placeholder-white/30 focus:outline-none font-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-medium text-white/70 font-brand">Password</label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => handleSocialClick('Password Reset')}
                        className="text-xs text-white/45 hover:text-[#f61d57] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl liquid-glass-input text-sm text-white placeholder-white/30 focus:outline-none font-brand"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-white/40 hover:text-[#f61d57] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA Button (Crimson Flame) */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl liquid-glass-crimson text-white font-extrabold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer mt-2"
                >
                  <span className="font-brand tracking-widest">
                    {authMode === 'signin' ? 'Log In' : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Footer: Toggle Mode */}
              <div className="mt-6 text-center text-xs text-white/50 font-brand">
                {authMode === 'signin' ? (
                  <span>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-white font-semibold hover:text-[#f61d57] underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Sign up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="text-white font-semibold hover:text-[#f61d57] underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* RIGHT COLUMN: SHOWCASE VIDEO AREA (RED BOX AREA)           */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-5 relative min-h-[440px] lg:min-h-[640px] w-full overflow-hidden flex flex-col justify-between p-8 lg:p-10">
              
              {/* Crisp Featured Video: running_man */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover object-center"
              >
                <source src="/running_man.mp4" type="video/mp4" />
              </video>

              {/* Gradient -> Blend Overlay */}
              <div className="absolute inset-0 video-fade-edge pointer-events-none" />

              {/* Top & Bottom Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050204]/90 via-transparent to-[#050204]/40 pointer-events-none" />

              {/* Top Row inside Video: Status Badge */}
              <div className="relative z-10 flex items-center justify-end">
                <div className="py-1.5 px-3.5 rounded-full liquid-glass-button text-[11px] font-mono-data text-white/90 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f61d57] animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-[#f61d57] -ml-4" />
                  <span className="tracking-widest uppercase text-white/90">KINETIC ENGINE</span>
                </div>
              </div>

              {/* Bottom Row inside Video: Telemetry Stats & Circular Lightning Icon */}
              <div className="relative z-10 flex items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand leading-tight drop-shadow-md">
                    40K+ Kilometers.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f61d57] to-[#FFE600]">
                      8,400+ Summits.
                    </span>
                  </h2>
                  <p className="text-xs text-white/70 font-brand max-w-[260px] leading-relaxed drop-shadow">
                    Real-time biometric pacing, altitude acclimation, and alpine trail intelligence.
                  </p>
                </div>

                {/* Liquid Glass Crystal Lightning Bolt Icon Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => loginAsDemo()}
                    title="Explore Demo Mode"
                    aria-label="Explore Demo Mode"
                    className="w-12 h-12 rounded-full liquid-glass-crystal flex items-center justify-center cursor-pointer group shadow-xl hover:scale-110 active:scale-95 transition-all flex-shrink-0"
                  >
                    <Zap className="w-5 h-5 text-[#FFE600] group-hover:rotate-12 transition-transform fill-[#FFE600] drop-shadow-[0_0_8px_rgba(255,230,0,0.6)]" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (

        /* ================================================================ */
        /*  SCREEN 2: AUTHENTICATED WORKSPACE (HOME & START HIKE VIEWS)     */
        /* ================================================================ */
        <div className="relative z-10 min-h-screen flex flex-col anim-fade-in overflow-y-hidden">
          
          {/* Top Navigation Bar with SYMMETRICAL, EQUIDISTANT Mountain Icon */}
          <header className="sticky top-0 z-50 w-full navbar-glass flex-shrink-0">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
              
              {/* Logo Lockup (Crisp, no glow) */}
              <div
                onClick={() => setActiveNav('Home')}
                className="flex items-center gap-2.5 min-w-[200px] cursor-pointer"
              >
                <img src="/logo.png" alt="AltiPulse" className="w-7 h-7 object-contain" />
                <span className="text-sm font-bold tracking-[0.22em] uppercase text-white font-brand">
                  AltiPulse
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono-data px-2 py-0.5 rounded-md bg-[#f61d57]/15 text-[#f61d57] border border-[#f61d57]/30 ml-1.5">
                  MANNHEIM HUB
                </span>
              </div>

              {/* Centered Pill with 100% Equal Distance on Left and Right of Mountain */}
              <nav className="hidden md:flex items-center p-1 rounded-full bg-white/5 border border-white/8 text-xs font-medium font-brand">
                {/* Left Half: Home & Trails */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveNav('Home')}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeNav === 'Home'
                        ? 'nav-pill-active text-white font-semibold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedTrailId('mount_si');
                      setActiveNav('Trails');
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeNav === 'Trails'
                        ? 'nav-pill-active text-white font-semibold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Trails
                  </button>
                </div>

                {/* Dead-Center Mountain Action Button (Starts / Plans Hike) */}
                <div className="px-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeNav === 'Trails') {
                        setActiveNav('Home');
                      } else {
                        setPreselectedTrailId('mount_si');
                        setActiveNav('Trails');
                      }
                    }}
                    className={`p-2 rounded-full transition-all cursor-pointer group flex items-center justify-center ${
                      activeNav === 'Trails' || activeNav === 'Altitude Map'
                        ? 'bg-[#f61d57] text-white shadow-[0_0_22px_rgba(246,29,87,0.85)] scale-110 border border-white/50'
                        : 'bg-[#f61d57]/22 hover:bg-[#f61d57] border border-[#f61d57]/55 text-[#f61d57] hover:text-white shadow-[0_0_15px_rgba(246,29,87,0.4)] hover:scale-110 active:scale-95'
                    }`}
                    title={activeNav === 'Trails' ? 'Return to Home' : 'Start / Plan Hike'}
                    aria-label="Start / Plan Hike"
                  >
                    <Mountain className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                  </button>
                </div>

                {/* Right Half: Altitude Map & Leaderboard */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedTrailId('rainier');
                      setActiveNav('Altitude Map');
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeNav === 'Altitude Map'
                        ? 'nav-pill-active text-white font-semibold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Altitude Map
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Leaderboard: Roshan is #5 (+58 pts to #4)')}
                    className="px-3.5 py-1.5 rounded-full transition-all cursor-pointer text-white/50 hover:text-white"
                  >
                    Leaderboard
                  </button>
                </div>
              </nav>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3 min-w-[200px] justify-end">
                <button
                  type="button"
                  onClick={() => handleSocialClick('Notifications: 2 Offline Topo Maps Synced')}
                  className="p-1.5 rounded-full liquid-glass-button text-white/70 hover:text-white cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f61d57] to-[#FFE600] flex items-center justify-center text-xs font-bold text-white font-brand">
                    {session.firstName.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-white font-brand leading-none">{session.fullName}</p>
                    <p className="text-[9px] font-mono-data text-[#f61d57] mt-0.5">{session.tier}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </header>

          {/* ============================================================ */}
          {/*  VIEW A: START / PLAN HIKE INTERACTIVE COCKPIT (THE TRAIL)   */}
          {/* ============================================================ */}
          {activeNav === 'Trails' || activeNav === 'Altitude Map' ? (
            <main className="h-[calc(100vh-56px)] max-w-7xl mx-auto w-full px-4 sm:px-6 pt-2 pb-3 flex flex-col justify-between overflow-hidden">
              <StartHikeCockpit
                initialTrailId={preselectedTrailId}
                onBackToHome={() => setActiveNav('Home')}
                userScore={session.hikingScore}
              />
            </main>
          ) : (
            <main className="h-[calc(100vh-56px)] max-w-7xl mx-auto w-full px-6 pt-3 pb-6 flex flex-col justify-between overflow-hidden">
              
              {/* Top Greeting */}
              <div className="anim-fade-in-up flex-shrink-0">
                <div className="flex items-center gap-2 text-[11px] font-mono-data text-[#f61d57] mb-0.5">
                  <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '12s' }} />
                  <span>GPS LOCK: 49.4875° N, 8.4660° E · MANNHEIM, GERMANY</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-brand tracking-tight leading-tight">
                  {getGreeting()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">{session.firstName}</span>
                </h1>
                <p className="text-xs text-white/50 font-brand mt-0.5">
                  Current atmospheric barometrics in Mannheim are optimal for alpine pacing.
                </p>
              </div>

              {/* ============================================================ */}
              {/* MIDDLE HERO VIDEO CARD: Taller/Longer, Flex-Expanded         */}
              {/* ============================================================ */}
              <div className="w-full flex-1 min-h-[350px] max-h-[460px] rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 group anim-fade-in-up delay-100 my-2 sm:my-3">
                <video
                  ref={middleVidRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-center"
                >
                  <source src="/middle_vid.mp4" type="video/mp4" />
                </video>

                {/* Ambient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050204]/80 via-transparent to-black/20 pointer-events-none" />

                {/* ONLY "Nearest Trail: XXX" with mountain quick-start icon */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6 z-10">
                  <div
                    onClick={() => {
                      setPreselectedTrailId('odenwald');
                      setActiveNav('Trails');
                    }}
                    className="py-2 px-4 rounded-full liquid-glass-button text-xs font-brand text-white flex items-center gap-3 backdrop-blur-xl border border-white/15 shadow-2xl cursor-pointer hover:border-[#f61d57]/60 transition-all"
                  >
                    <span className="text-white/60 font-mono-data text-[11px] uppercase tracking-wider">Nearest Trail:</span>
                    <span className="font-semibold text-white tracking-wide">Odenwald High Ridge</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreselectedTrailId('odenwald');
                        setActiveNav('Trails');
                      }}
                      className="p-1.5 rounded-full bg-[#f61d57] hover:bg-[#ff336a] text-white transition-all cursor-pointer shadow-[0_0_14px_rgba(246,29,87,0.55)] hover:scale-110 active:scale-95 ml-0.5 flex items-center justify-center"
                      title="Quick Start Hike"
                      aria-label="Quick Start Hike"
                    >
                      <Mountain className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* 4 WIDGETS GRID: Hugs bottom of screen, Richer with Legible Gauge */}
              {/* ============================================================ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                
                {/* Widget 1: Hiking Score with Larger, Clearer Gauge Text */}
                <div className="widget-box p-4 sm:p-5 anim-fade-in-up delay-200 flex items-center justify-between min-h-[140px]">
                  <div className="flex flex-col justify-between h-full space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono-data text-white/50 uppercase tracking-wider">Hiking Score</span>
                      <Activity className="w-3.5 h-3.5 text-[#f61d57]" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono-data text-white leading-none">{session.hikingScore}</span>
                        <span className="text-xs text-white/40">/ 1000</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                          Rank #{session.rank}
                        </span>
                        <span className="text-[10px] text-[#FFE600] font-mono-data flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" /> +14 pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Gauge: Larger Text for Instant Readability */}
                  <div className="relative flex-shrink-0 w-[88px] h-[88px] flex items-center justify-center">
                    <svg className="w-[88px] h-[88px] transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="9"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="url(#hikingScoreGradientSlim)"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={251.3}
                        strokeDashoffset={251.3 * (1 - 0.842)}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(246, 29, 87, 0.6))' }}
                      />
                      <defs>
                        <linearGradient id="hikingScoreGradientSlim" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f61d57" />
                          <stop offset="60%" stopColor="#ff6b00" />
                          <stop offset="100%" stopColor="#FFE600" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Text inside gauge: Larger, Crisp and Legible */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                      <span className="text-base sm:text-lg font-extrabold font-mono-data text-[#FFE600] tracking-tight">
                        +{session.ptsToNext}
                      </span>
                      <span className="text-[9px] font-mono-data font-bold text-white uppercase tracking-tight mt-1">
                        PTS TO #{session.rank - 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Widget 2: Saved Trails */}
                <div
                  onClick={() => {
                    setPreselectedTrailId('lake_22');
                    setActiveNav('Trails');
                  }}
                  className="widget-box p-4 sm:p-5 anim-fade-in-up delay-300 flex flex-col justify-between min-h-[140px] cursor-pointer hover:border-[#f61d57]/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-data text-white/50 uppercase tracking-wider">Saved Trails</span>
                    <Bookmark className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <div className="my-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold font-mono-data text-white leading-none">{session.savedTrailsCount}</span>
                      <span className="text-xs text-white/40">routes loaded</span>
                    </div>
                    <p className="text-xs text-white/70 font-brand mt-1.5 truncate">
                      Next: Lake 22 Loop (9.3 km)
                    </p>
                  </div>
                  <p className="text-[10px] text-white/45 font-mono-data pt-1.5 border-t border-white/5">Click to browse cockpit →</p>
                </div>

                {/* Widget 3: Live Real-Time Weather (Mannheim) with Bigger Weather Icon */}
                <div className="widget-box p-4 sm:p-5 anim-fade-in-up delay-400 flex items-center justify-between min-h-[140px]">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono-data text-white/50 uppercase tracking-wider">Weather · {weather.city}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live API Active" />
                    </div>
                    <div className="my-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono-data text-white leading-none">{weather.temp}°C</span>
                        <span className="text-xs text-white/70 font-brand">{weather.condition}</span>
                      </div>
                      <p className="text-[10px] text-white/50 font-mono-data mt-1.5 flex items-center gap-1">
                        <Wind className="w-3 h-3 text-white/40" /> {weather.wind} km/h · {weather.humidity}% humidity
                      </p>
                    </div>
                  </div>

                  {/* Big Weather Icon */}
                  <div className="flex items-center justify-center pl-2">
                    {renderWeatherIcon()}
                  </div>
                </div>

                {/* Widget 4: Total Elevation */}
                <div
                  onClick={() => {
                    setPreselectedTrailId('rainier');
                    setActiveNav('Altitude Map');
                  }}
                  className="widget-box p-4 sm:p-5 anim-fade-in-up delay-500 flex flex-col justify-between min-h-[140px] cursor-pointer hover:border-[#f61d57]/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-data text-white/50 uppercase tracking-wider">Total Elevation</span>
                    <Mountain className="w-4 h-4 text-[#f61d57]" />
                  </div>
                  <div className="my-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold font-mono-data text-white leading-none">
                        {session.totalVert.toLocaleString()}
                      </span>
                      <span className="text-xs text-white/40">meters</span>
                    </div>
                    <p className="text-xs text-white/70 font-brand mt-1.5">
                      {session.summits} Summits recorded this season
                    </p>
                  </div>
                  <p className="text-[10px] text-[#f61d57] font-mono-data pt-1.5 border-t border-white/5">Peak: 4,392m (Rainier)</p>
                </div>

              </div>

            </main>
          )}

        </div>
      )}

    </div>
  );
}
