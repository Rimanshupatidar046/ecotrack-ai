/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Leaf, ShieldCheck, Cpu, Zap, Trophy, HelpCircle, ArrowRight, Star, Globe, Sparkles, Twitter, Linkedin, Github, Mail, Activity, BrainCircuit, Rocket } from "lucide-react";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
const ThreeEarth = lazy(() => import('./ThreeEarth'));
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";
import { MagneticButton } from "./MagneticButton";

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onStartCalculator: () => void;
  onExploreDashboard: () => void;
  calculatorTaken: boolean;
}

export default function LandingPage({ onStartCalculator, onExploreDashboard }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // GSAP animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant hero reveal animation using GSAP
    if (heroRef.current) {
      const children = heroRef.current.querySelectorAll(".gsap-reveal");
      gsap.fromTo(
        children,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power2.out" }
      );
    }

    // Scroll trigger counters for Statistics segment
    if (statsRef.current) {
      const statsList = statsRef.current.querySelectorAll(".gsap-stat-val");
      statsList.forEach((stat) => {
        const targetVal = parseFloat(stat.getAttribute("data-target") || "0");
        const suffix = stat.getAttribute("data-suffix") || "";
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: targetVal,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          onUpdate: () => {
            stat.textContent = targetVal % 1 === 0 
              ? Math.floor(obj.value).toString() + suffix
              : obj.value.toFixed(1) + suffix;
          }
        });
      });
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const stats = [
    { label: "CO2 Reduction Empowered", value: "850", suffix: "k+", subSuffix: " Tons", detail: "Empowered by active platform initiatives" },
    { label: "Community Eco-Citizens", value: "34.2", suffix: "k", subSuffix: "", detail: "Engaged in collaborative missions" },
    { label: "Average Individual Savings", value: "22.5", suffix: "%", subSuffix: "", detail: "Annual carbon output optimized" },
    { label: "Carbon Neutral Roadmap Met", value: "98", suffix: "%", subSuffix: "", detail: "Accuracy calculated against standard protocols" }
  ];

  const features = [
    {
      icon: Cpu,
      title: "Smart AI Companion",
      description: "Ask or consult our integrated greenhouse specialist instantly on heating offsets, dietary loops, or technical carbon metrics."
    },
    {
      icon: Zap,
      title: "Granular Dashboard Breakdown",
      description: "Interactive analytics separating municipal transits, flights, electricity loads, and compost rates into aesthetic timelines."
    },
    {
      icon: Trophy,
      title: "Eco-Gamified Missions",
      description: "Complete daily challenges and unlock exclusive carbon badges to climb through state-of-the-art sustainability levels."
    },
    {
      icon: Leaf,
      title: "Personalized Roadmap",
      description: "Follow customized monthly and long-term targets complete with expected financial savings and actual greenhouse relief."
    }
  ];

  const benefits = [
    {
      title: "Reduce Utility Costs",
      detail: "Learn how setting slight thermodynamic offsets and introducing smart strips offsets up to $250 in quarterly household electricity bills.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Form Greener Habits",
      detail: "Effortlessly transition toward micro-commuting, plastic repurposing, and nutritional balance with adaptive daily triggers.",
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Lead Local Compliance",
      detail: "Establish concrete, shareable statistics showcasing your community carbon offsets and compliance metrics directly in high standard visual PDF.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const testimonials = [
    {
      quote: "EcoTrack AI completely gamified my household footprint. We cut our quarterly energy consumption by 24% and unlocked the 'Solar Vanguard' badge!",
      author: "Helena Vance",
      role: "Climate Tech Architect, Munich",
      avatar: "https://i.pravatar.cc/150?u=helena"
    },
    {
      quote: "The personalized report took our carbon metrics straight to our board proposal. The scientific backing and AI recommendation fidelity is outstanding.",
      author: "Marcus Thorne",
      role: "ESG Director, Vanguard Group",
      avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    {
      quote: "A masterpiece of visual design. Having a realistic 3D global carbon telemetry feedback makes adjusting daily transport choices genuinely immersive.",
      author: "Sora Takahashi",
      role: "Urban Ecology Researcher, Tokyo",
      avatar: "https://i.pravatar.cc/150?u=sora"
    }
  ];

  const faqs = [
    {
      q: "How does EcoTrack AI calculate carbon metrics?",
      a: "Our system combines recognized emissions standards (Intergovernmental Panel on Climate Change guidelines) with your local parameters. We evaluate passenger transit variables, aviation emissions, electrical grid grid-mix coefficients, dietary footprints, and post-consumer circular waste loops."
    },
    {
      q: "Does the platform support real-time advisor consults?",
      a: "Yes! Our voice/generative AI Sustainability Assistant utilizes Gemini's reasoning to formulate direct instructions and custom solutions mapped to your active dashboard metrics."
    },
    {
      q: "Are calculations stored or secure?",
      a: "Absolutely. All metrics are safely persistent in internal client cache memory. We prioritize zero third-party telemetry leak ratios to protect domestic travel details."
    },
    {
      q: "Is the final carbon analysis exportable?",
      a: "Yes, our ESG-compliant carbon reports are compiled into clean, downloadable formatting layouts that list timelines, milestone tracking, and dynamic eco suggestions."
    }
  ];

  // Motion variants for section cascades
  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-120px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1, transition: { staggerChildren: 0.15 } },
    viewport: { once: true, margin: "-100px" }
  };

  const fadeInUpItem = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  };

  return (
    <div className="w-full text-[#E0E7FF] bg-transparent font-sans" id="landing-page-root">
      
      {/* 1. Immersive Hero Section */}
      <section aria-labelledby="hero-title" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        
        {/* Futuristic glowing circular blur gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10" ref={heroRef}>
          
          {/* Hero text reveal inputs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-xs font-mono text-emerald-400 w-fit gsap-reveal">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" aria-hidden="true" />
              <span>NEXT GENERATION CARBON INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight gsap-reveal" id="hero-title">
              Track Your Carbon Footprint. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Build a Greener Future.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl gsap-reveal leading-relaxed" id="hero-subtitle">
              Understand your environmental impact, discover smarter habits, and take meaningful action toward a sustainable future. Empowered by advanced climate intelligence.
            </p>

            {/* Quick entry links wrapped in magnetic animations */}
            <div className="flex flex-wrap gap-4 pt-4 gsap-reveal" id="hero-ctas">
              <MagneticButton
                onClick={onStartCalculator}
                id="btn-calculate-footprint"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                <span>Calculate My Footprint</span>
                <ArrowRight className="w-5 h-5 text-slate-950" aria-hidden="true" />
              </MagneticButton>

              <MagneticButton
                onClick={onExploreDashboard}
                id="btn-explore-dashboard"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all active:scale-95 backdrop-blur-md"
              >
                <span>Explore Dashboard</span>
                <Globe className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              </MagneticButton>
            </div>

            {/* Micro carbon footprint quick metrics footer */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-xs font-mono text-slate-400 gsap-reveal">
              <div>
                <span className="block text-white font-bold text-base">UN-SBTi</span>
                <span>Aligned Protocols</span>
              </div>
              <div>
                <span className="block text-white font-bold text-base">2.0 Tons</span>
                <span>Target Carbon Goal</span>
              </div>
              <div>
                <span className="block text-white font-bold text-base">100% Secure</span>
                <span>Client Integrity</span>
              </div>
            </div>
          </div>

          {/* Immersive interactive visual ThreeEarth representation with scale revealing */}
          <motion.div 
            className="lg:col-span-5 relative flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full h-[450px] md:h-[520px] rounded-2xl bg-white/5 border border-white/10 relative shadow-2xl overflow-hidden glassmorphism shadow-cyan-500/5">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5" />}>
                <ThreeEarth />
              </Suspense>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Interactive Statistics Dashboard with GSAP numbers counter */}
      <motion.section 
        className="py-16 px-4 bg-white/2 border-b border-white/15 backdrop-blur-sm" 
        ref={statsRef} 
        id="section-stats"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase font-mono">GLOBAL IMPACT METRICS</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Platform Empowerment Stats</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {stats.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUpItem}>
                <AnimatedCard 
                  id={`stat-card-${idx}`}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl h-full w-full"
                  glowColor="rgba(16, 185, 129, 0.15)"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <span 
                        className="text-4xl font-extrabold text-emerald-400 block mb-2 gsap-stat-val font-mono" 
                        data-target={item.value}
                        data-suffix={item.suffix}
                      >
                        0{item.suffix}
                      </span>
                      {item.subSuffix && (
                        <span className="text-xs text-emerald-500/80 font-mono block -mt-1 mb-2 font-bold">{item.subSuffix}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm block mb-1">{item.label}</span>
                      <span className="text-slate-400 text-xs">{item.detail}</span>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Mechanics of Sustainability: How It Works */}
      <motion.section 
        className="py-20 px-4 max-w-7xl mx-auto" 
        id="section-how-it-works"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase font-mono">RESTORING EQUILIBRIUM</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">How It Works</p>
          <p className="mt-4 text-slate-400 text-base">Our smart diagnostic loop compiles standard inputs, models environmental equivalents, and guides reduction timelines flawlessly.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {[
            {
              step: "01",
              title: "Input Domestic Dimensions",
              detail: "Provide basic parameters on transportation variables, heating demands, weekly household compost outputs, and diets in minutes.",
              icon: Activity
            },
            {
              step: "02",
              title: "AI Analysis & Breakdown",
              detail: "Our scientific formula models exact Carbon Score metrics, generating high standard circular pie breakdowns and score diagnostic grades.",
              icon: BrainCircuit
            },
            {
              step: "03",
              title: "Launch Carbon Neutral Journey",
              detail: "Unlock interactive milestones, complete green gamified challenges, level up, and inspect PDF summaries.",
              icon: Rocket
            }
          ].map((step, idx) => {
            const IconComp = step.icon;
            return (
            <motion.div 
              key={idx} 
              variants={fadeInUpItem}
              className="relative group"
            >
              {/* Connecting lines with scanning pulsed gradients */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-[40%] -right-7 w-6 h-[2px] border-t-2 border-dashed border-emerald-500/25 z-0">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping absolute -top-1" style={{ animationDuration: '3s' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 absolute -top-[3px] left-1/2 -translate-x-1/2" />
                </div>
              )}
              
              <AnimatedCard 
                id={`step-${idx}`}
                className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8 rounded-3xl h-full backdrop-blur-xl relative overflow-hidden"
                glowColor="rgba(16, 185, 129, 0.2)"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[40px] group-hover:bg-cyan-500/20 transition-colors duration-500 rounded-full" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <IconComp className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="text-5xl font-extrabold text-white/5 font-mono group-hover:text-emerald-500/10 transition-colors duration-300 select-none">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {step.detail}
                </p>
              </AnimatedCard>
            </motion.div>
          )})}
        </motion.div>
      </motion.section>

      {/* 4. Platform Features */}
      <motion.section 
        className="py-20 px-4 bg-white/2 border-y border-white/5" 
        id="section-features"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-12 xl:col-span-5 text-left space-y-6">
              <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">SCIENTIFIC CAPABILITIES</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Everything You Need to Scale Back Emissions
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                We've combined strict climate analytics with beautiful modern widgets to make tracking enjoyable. No more dense ESG spreadsheets or boring calculator charts.
              </p>
              
              <div className="space-y-4 pt-4 text-left">
                {["100% offline-first secure caching", "Carbon-saving roadmap timeline generation", "Interactive PDF compliance metrics generator"].map((check, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-slate-300 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0"  aria-hidden="true" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
                  alt="Platform Dashboard" 
                  width="1200"
                  height="224"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-56 object-cover rounded-2xl border border-white/10 shadow-2xl shadow-emerald-500/10"
                />
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const IconComp = feature.icon;
                return (
                  <AnimatedCard
                    key={idx}
                    id={`feature-card-${idx}`}
                    className="p-6 bg-white/4 border border-white/10 rounded-2xl group w-full h-full"
                    glowColor="rgba(16, 185, 129, 0.2)"
                  >
                    <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:rotate-[360deg] transition-all duration-700 mb-4">
                      <IconComp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
                  </AnimatedCard>
                );
              })}
            </div>

          </div>
        </div>
      </motion.section>

      {/* 5. Benefits Grid with 3D Tilt Cards */}
      <motion.section 
        className="py-20 px-4 max-w-7xl mx-auto" 
        id="section-benefits"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase font-mono">WHY CHANGE</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Environmental & Economic Benefits</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, idx) => (
            <motion.div key={idx} variants={fadeInUpItem}>
              <AnimatedCard 
                id={`benefit-card-${idx}`}
                className="rounded-2xl bg-white/5 border border-white/10 h-full w-full overflow-hidden flex flex-col group"
                glowColor="rgba(6, 182, 212, 0.15)"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320] via-transparent to-transparent z-10" />
                  <img 
                    src={benefit.image} 
                    alt={benefit.title} 
                    width="800"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center space-x-2.5">
                    <Leaf className="w-5 h-5 text-emerald-400 flex-shrink-0"  aria-hidden="true" />
                    <span>{benefit.title}</span>
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{benefit.detail}</p>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 6. Testimonials Section with Scroll Reveals */}
      <motion.section 
        className="py-20 px-4 bg-white/2 border-y border-white/5" 
        id="section-testimonials"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase font-mono">CLIENT STORIES</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Hear From EcoTrack Citizens</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {testimonials.map((t, idx) => (
              <motion.div key={idx} variants={fadeInUpItem}>
                <AnimatedCard 
                  id={`testimonial-${idx}`}
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl h-full w-full relative overflow-hidden group"
                  glowColor="rgba(16, 185, 129, 0.15)"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-24 h-24 text-emerald-400"  aria-hidden="true" />
                  </div>
                  <div className="flex flex-col justify-between h-full space-y-6 relative z-10">
                    <div>
                      <div className="flex space-x-1 mb-6 text-emerald-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"  aria-hidden="true" />)}
                      </div>
                      <p className="text-slate-300 text-base italic leading-relaxed">"{t.quote}"</p>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex items-center space-x-4">
                      <img src={t.avatar} alt={t.author} width="48" height="48" loading="lazy" decoding="async" className="w-12 h-12 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg shadow-emerald-500/20" />
                      <div>
                        <span className="block text-white text-sm font-bold">{t.author}</span>
                        <span className="block text-emerald-400/80 font-mono text-xs mt-0.5">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. FAQs (Fluid Motion Expandable Accordion) */}
      <motion.section 
        className="py-20 px-4 max-w-4xl mx-auto" 
        id="section-faq"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase font-mono">HAVE QUESTIONS?</h2>
          <p className="mt-2 text-3xl font-extrabold text-white">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                id={`faq-item-${idx}`}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-white/10 transition-colors relative"
                >
                  <span className="font-bold text-white text-sm md:text-base flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0"  aria-hidden="true" />
                    <span>{faq.q}</span>
                  </span>
                  <motion.span 
                    className="text-emerald-400 font-mono text-xl ml-4 select-none"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    +
                  </motion.span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-white/10 bg-black/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 8. Call To Action Footer Banner with Dynamic Gradient Animation */}
      <motion.section 
        className="py-24 px-4 border border-white/10 rounded-2xl max-w-7xl mx-auto mb-10 overflow-hidden relative" 
        id="section-cta-footer"
        variants={sectionAnimation}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?auto=format&fit=crop&w=1600&q=80" 
            alt="Nature Canopy" 
            width="1600"
            height="400"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/80 to-[#050B14]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-extrabold text-white">Ready to quantify your ecological metrics?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Take our 2-minute diagnostic, visualize your timeline, and ask our AI Assistant tips on making instant carbon cutbacks today.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <MagneticButton
              onClick={onStartCalculator}
              id="cta-footer-calculate"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              Start Carbon Assessment
            </MagneticButton>
          </div>
        </div>
      </motion.section>

      {/* 9. Premium Footer */}
      <footer className="bg-[#050B14] py-16 px-4 border-t border-white/10 backdrop-blur-xl relative overflow-hidden" id="landing-page-footer">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">EcoTrack AI</span>
              <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">v1.2.0</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Leading the transition to a carbon-neutral future through advanced environmental telemetry, AI-driven insights, and community action.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="/" aria-label="EcoTrack AI Twitter Profile" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-all">
                <Twitter className="w-4 h-4"  aria-hidden="true" />
              </a>
              <a href="/" aria-label="EcoTrack AI LinkedIn Page" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all">
                <Linkedin className="w-4 h-4"  aria-hidden="true" />
              </a>
              <a href="/" aria-label="EcoTrack AI GitHub Repository" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/20 hover:border-white/30 text-slate-400 hover:text-white transition-all">
                <Github className="w-4 h-4"  aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-mono uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Carbon Calculator</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">AI Diagnostics</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Gamification Dashboard</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Enterprise API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-mono uppercase text-sm tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="/" className="hover:text-emerald-400 transition-colors">IPCC Methodologies</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Climate Glossary</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Community Forum</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-white font-bold mb-4 font-mono uppercase text-sm tracking-wider">Stay Updated</h2>
            <p className="text-slate-400 text-sm">Join 34,000+ citizens receiving weekly climate optimization tips.</p>
            <div className="relative">
              <label htmlFor="newsletter-email" className="sr-only">Enter your email</label>
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <button aria-label="Subscribe to newsletter" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050B14]">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© 2026 EcoTrack AI Corporation. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
