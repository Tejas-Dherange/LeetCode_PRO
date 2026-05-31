import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Bot, Building2, CalendarCheck, Check, CheckCircle2,
  Code, Code2, DollarSign, Flame, FolderX, GraduationCap, Layers,
  LogIn, Mail, Map, Moon, Puzzle, Shuffle, Star, Trophy, Users, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Floating orb that slowly drifts
function FloatOrb({ className }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}



export default function HomePage() {
  return (
    <div className="bg-zinc-950 text-neutral-50 w-full min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <header className="sticky z-50 top-0 w-full backdrop-blur-md bg-zinc-950/90 border-b border-white/10">
        <div className="max-w-[1140px] flex mx-auto px-8 justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#00bc7d] text-[#0d542b] flex justify-center items-center">
              <Code2 className="size-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">CodeLoom</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button className="text-[#9f9fa9] gap-2" variant="ghost" asChild>
              <Link to="/dashboard"><Code className="size-4" />Problems</Link>
            </Button>
            <Button className="text-[#9f9fa9] gap-2" variant="ghost" asChild>
              <Link to="/dashboard/contest"><Trophy className="size-4" />Contests</Link>
            </Button>
            <Button className="text-[#9f9fa9] gap-2" variant="ghost" asChild>
              <Link to="/patterns"><Layers className="size-4" />Patterns</Link>
            </Button>
            <Button className="text-[#9f9fa9] gap-2" variant="ghost" asChild>
              <Link to="/dashboard/pricing"><DollarSign className="size-4" />Pricing</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button className="text-[#9f9fa9] gap-2" variant="ghost" asChild>
              <Link to="/login"><LogIn className="size-4" />Login</Link>
            </Button>
            <Button className="bg-[#00bc7d] text-[#0d542b] gap-2 hover:bg-[#00a86e]" asChild>
              <Link to="/login"><Zap className="size-4" />Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative border-b border-white/10 overflow-hidden min-h-[92vh] flex items-center">
        {/* layered backgrounds */}
        <div className="pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.696_0.17_162.48/0.18),transparent)] absolute inset-0" />
        {/* floating orbs */}
        <FloatOrb className="w-[520px] h-[520px] bg-[#00bc7d]/10 -top-32 -left-40" />
        <FloatOrb className="w-[380px] h-[380px] bg-[#00bc7d]/8 top-20 -right-28" />
        <FloatOrb className="w-[260px] h-[260px] bg-emerald-400/6 bottom-10 left-1/3" />
        {/* floating code snippets */}
        <div className="pointer-events-none select-none font-mono text-[#00bc7d]/20 text-xs absolute right-12 top-24 leading-6 hidden lg:flex flex-col gap-1">
          {["function solve(arr) {", "  const dp = new Array(n);", "  return dp[n - 1];", "} // O(n)"].map((line, i) => (
            <motion.span key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.15 }}>{line}</motion.span>
          ))}
        </div>
        <div className="pointer-events-none select-none font-mono text-[#00bc7d]/15 text-xs absolute left-10 bottom-20 leading-6 hidden lg:flex flex-col gap-1">
          {["while (left < right) {", "  mid = (l + r) >> 1;", "}"].map((line, i) => (
            <motion.span key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 + i * 0.15 }}>{line}</motion.span>
          ))}
        </div>
        <div className="relative max-w-[1140px] text-center mx-auto px-8 py-28 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-medium
                  bg-white/5 backdrop-blur-md border border-[#00bc7d]/30 text-[#00bc7d]
                  shadow-[0_0_20px_oklch(0.696_0.17_162.48/0.15)]"
              >
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <GraduationCap className="size-3.5" />
                </motion.span>
                Built for Indian Placements
              </motion.div>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="max-w-3xl font-bold text-5xl sm:text-6xl leading-tight tracking-tight mx-auto">
              Stop grinding randomly.{" "}
              <span
                className="text-[#00bc7d] relative"
                style={{ textShadow: "0 0 40px oklch(0.696 0.17 162.48 / 0.4)" }}
              >
                Get placed in 60 days.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-[#9f9fa9] text-lg mx-auto mt-6 leading-relaxed">
              CodeLoom gives you a structured path daily problems, pattern learning, live contests, and a partner when you're stuck.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row mt-8 justify-center items-center gap-4">
              <Button className="bg-[#00bc7d] text-[#0d542b] gap-2 hover:bg-[#00a86e]" size="lg" asChild>
                <Link to="/login"><Zap className="size-5" />Start Free Today</Link>
              </Button>
              <Button className="border border-white/10 text-neutral-50 gap-2 hover:bg-white/5" size="lg" variant="outline" asChild>
                <Link to="/dashboard"><Map className="size-5" />View 60-Day Track</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp} custom={4}
              className="max-w-2xl rounded-2xl flex flex-col sm:flex-row mx-auto mt-12 px-6 py-4 justify-center items-center gap-4 sm:gap-6
                backdrop-blur-xl bg-white/[0.04] border border-white/10
                shadow-[0_8px_32px_oklch(0_0_0/0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#00bc7d]" />
                <span className="font-mono text-neutral-50 text-sm">2,400</span>
                <span className="text-[#9f9fa9] text-sm">solved today</span>
              </div>
              <div className="hidden sm:block bg-white/10 w-px h-4" />
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-[#00bc7d]" />
                <span className="font-mono text-neutral-50 text-sm">340</span>
                <span className="text-[#9f9fa9] text-sm">on streak</span>
              </div>
              <div className="hidden sm:block bg-white/10 w-px h-4" />
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-[#00bc7d]" />
                <span className="font-mono text-neutral-50 text-sm">12</span>
                <span className="text-[#9f9fa9] text-sm">contests this month</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="bg-zinc-900/40 border-b border-white/10">
        <div className="max-w-[1140px] flex mx-auto px-8 py-6 flex-wrap justify-center items-center gap-x-8 gap-y-3">
          <span className="text-[#9f9fa9] text-sm">Trusted by students from</span>
          {["IIT Bombay", "VJTI", "COEP", "NIT Nagpur", "BITS Pilani", "IIIT Hyderabad", "DTU", "VIT"].map((c) => (
            <span key={c} className="font-medium text-neutral-50/50 text-sm">{c}</span>
          ))}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="border-b border-white/10">
        <div className="max-w-[1140px] mx-auto px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl text-center mx-auto mb-12">
            <motion.h2 variants={fadeUp} className="font-bold text-3xl tracking-tight">
              LeetCode alone won't get you placed
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[#9f9fa9] mt-3">
              The grind feels endless because no one told you what actually matters.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shuffle, title: "No structure", desc: "You open a problem set and have no idea what to solve next. Just endless random grinding." },
              { icon: Moon, title: "Stuck alone at 11PM", desc: "It's late, you're blocked on one problem, and there's no one around to help you break through." },
              { icon: FolderX, title: "Scattered prep", desc: "Company-specific questions for TCS, Infosys, Amazon are spread across 20 tabs and PDFs." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.01 }} className="transition-transform">
                <Card className="h-full p-6 gap-4 backdrop-blur-sm
                  bg-white/[0.03] border border-white/[0.08]
                  hover:border-white/20 hover:bg-white/[0.06]
                  shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300">
                  <CardHeader className="p-0 gap-2">
                    <div className="size-11 rounded-lg bg-zinc-800/80 text-[#9f9fa9] flex justify-center items-center">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[#9f9fa9] text-sm leading-5">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-zinc-900/40 border-b border-white/10">
        <div className="max-w-[1140px] mx-auto px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl text-center mx-auto mb-12">
            <motion.h2 variants={fadeUp} className="font-bold text-3xl tracking-tight">
              Everything you need. Nothing you don't.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[#9f9fa9] mt-3">
              One platform that takes you from confused to placement-ready.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Puzzle, title: "Pattern-Based Learning", desc: "Two Pointers, Sliding Window, Kadane's and more — master the patterns, not just problems.", accent: true },
              { icon: CalendarCheck, title: "Daily Problem + Streaks", desc: "Show up every day, build the habit, and track your consistency with a streak counter." },
              { icon: Trophy, title: "Live Contests", desc: "Real-time leaderboard. Compete with peers and feel the pressure of the real thing." },
              { icon: Users, title: "Pair Mode", desc: "Get matched with a partner when you're stuck. Never grind alone at 11PM again.", badge: "Coming Soon" },
              { icon: Building2, title: "Company Sheets", desc: "Curated problems by TCS, Infosys, Amazon, Google — prep exactly for your target." },
              { icon: Bot, title: "AI Code Analysis", desc: "Get instant complexity breakdowns and optimization tips on every solution you write.", accent: true },
            ].map(({ icon: Icon, title, desc, accent, badge }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.01 }} className="transition-transform">
                <Card className="h-full p-6 gap-4 backdrop-blur-sm group cursor-default
                  bg-white/[0.03] border border-white/[0.08]
                  hover:border-[#00bc7d]/30 hover:bg-white/[0.06]
                  hover:shadow-[0_0_30px_oklch(0.696_0.17_162.48/0.08)]
                  shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300">
                  <CardHeader className="p-0 gap-2">
                    <div className="flex justify-between items-center">
                      <div className={`size-11 rounded-lg flex justify-center items-center transition-transform group-hover:scale-110 duration-300 ${
                        accent ? "bg-[#00bc7d]/10 text-[#00bc7d] shadow-[0_0_16px_oklch(0.696_0.17_162.48/0.2)]" : "bg-zinc-800/80 text-neutral-50"
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      {badge && (
                        <Badge className="text-[#9f9fa9] text-xs border border-white/10 backdrop-blur-sm" variant="outline">
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[#9f9fa9] text-sm leading-5">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-b border-white/10">
        <div className="max-w-[1140px] mx-auto px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl text-center mx-auto mb-12">
            <motion.h2 variants={fadeUp} className="font-bold text-3xl tracking-tight">
              Your 60-Day Placement Roadmap
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[#9f9fa9] mt-3">
              A clear week-by-week path. No guessing what comes next.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { week: "WEEK 1", title: "Arrays & Hashing", desc: "Foundations, frequency maps, prefix sums.", highlight: true },
              { week: "WEEK 2", title: "Two Pointers", desc: "Sorted arrays, pairs, fast/slow pointers." },
              { week: "WEEK 3", title: "Sliding Window", desc: "Substrings, subarrays, dynamic windows." },
              { week: "WEEK 4", title: "Stacks & Queues", desc: "Monotonic stacks, parsing, BFS prep." },
              { week: "WEEK 5", title: "Trees & Graphs", desc: "DFS, BFS, traversals, recursion." },
              { week: "WEEK 6", title: "Dynamic Programming", desc: "Memoization, tabulation, classics." },
              { week: "WEEK 7", title: "Company Sheets", desc: "Targeted prep for your dream company." },
              { week: "WEEK 8", title: "Mock Contests", desc: "Timed rounds simulating the real thing.", highlight: true },
            ].map(({ week, title, desc, highlight }, i) => (
              <motion.div key={week} variants={fadeUp} custom={i}>
                <Card className={`p-5 gap-2 h-full ${highlight ? "bg-[#00bc7d]/5 border-[#00bc7d]/40" : "bg-zinc-900 border-white/10"}`}>
                  <CardHeader className="p-0 gap-1">
                    <span className={`font-mono text-xs ${highlight ? "text-[#00bc7d]" : "text-[#9f9fa9]"}`}>{week}</span>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[#9f9fa9] text-xs leading-4">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex mt-8 justify-center">
            <Button className="bg-[#00bc7d] text-[#0d542b] gap-2 hover:bg-[#00a86e]" size="lg" asChild>
              <Link to="/login">Get the Full Track Free <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-zinc-900/40 border-b border-white/10">
        <div className="max-w-[1140px] mx-auto px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl text-center mx-auto mb-12">
            <motion.h2 variants={fadeUp} className="font-bold text-3xl tracking-tight">
              Pricing that fits a student budget
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[#9f9fa9] mt-3">
              All plans include the full 60-day track.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {[
              {
                tier: "Free", price: "₹0",
                features: ["50 problems / month", "All patterns", "All contests"],
                cta: "Start Free", primary: false,
              },
              {
                tier: "Basic", price: "₹199",
                features: ["200 problems / month", "Company sheets", "50 AI analyses", "All patterns & contests"],
                cta: "Choose Basic", primary: true, popular: true,
              },
              {
                tier: "Premium", price: "₹499",
                features: ["Unlimited problems", "Unlimited AI analyses", "Priority Pair Mode", "Everything in Basic"],
                cta: "Go Premium", primary: false,
              },
            ].map(({ tier, price, features, cta, primary, popular }, i) => (
              <motion.div key={tier} variants={fadeUp} custom={i}>
                <Card className={`relative p-6 gap-6 ${primary ? "bg-zinc-900 border-[#00bc7d]/50 shadow-[0_0_40px_-12px_oklch(0.696_0.17_162.48/0.4)]" : "bg-zinc-900 border-white/10"}`}>
                  {popular && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                      <Badge className="bg-[#00bc7d] text-[#0d542b] text-xs">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="p-0 gap-2">
                    <span className={`font-medium text-sm ${primary ? "text-[#00bc7d]" : "text-[#9f9fa9]"}`}>{tier}</span>
                    <div className="items-baseline flex gap-1">
                      <span className="font-mono font-bold text-3xl">{price}</span>
                      <span className="text-[#9f9fa9] text-sm">/mo</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col gap-3">
                    {features.map((f) => (
                      <div key={f} className="text-sm flex items-center gap-2">
                        <Check className="size-4 text-[#00bc7d] shrink-0" />{f}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="p-0">
                    {primary ? (
                      <Button className="bg-[#00bc7d] text-[#0d542b] w-full hover:bg-[#00a86e]" asChild>
                        <Link to="/login">{cta}</Link>
                      </Button>
                    ) : (
                      <Button className="border border-white/10 text-neutral-50 w-full hover:bg-white/5" variant="outline" asChild>
                        <Link to="/login">{cta}</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-white/10">
        <div className="max-w-[1140px] mx-auto px-8 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl text-center mx-auto mb-12">
            <motion.h2 variants={fadeUp} className="font-bold text-3xl tracking-tight">
              Placed, not just practicing
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[#9f9fa9] mt-3">
              Real students. Real offers. Real placement seasons survived.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { quote: "The 60-day track gave me structure I never had. I stopped panicking and just followed the plan.", name: "Rahul S.", college: "VJTI Mumbai → TCS Digital", img: "https://images.unsplash.com/photo-1642364861013-2c33f2dcfbcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
              { quote: "Pattern-based learning clicked for me. Company sheets meant I prepped exactly for my interviews.", name: "Priya K.", college: "COEP Pune → Infosys", img: "https://images.unsplash.com/photo-1732888878731-7e52999af144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
              { quote: "Live contests built my speed. By interview day, the pressure felt completely normal.", name: "Arjun M.", college: "NIT Nagpur → Amazon", img: "https://images.unsplash.com/photo-1625241152315-4a698f74ceb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
            ].map(({ quote, name, college, img }, i) => (
              <motion.div key={name} variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.01 }} className="transition-transform">
                <Card className="h-full p-6 gap-4 flex flex-col backdrop-blur-sm
                  bg-white/[0.03] border border-white/[0.08]
                  hover:border-[#00bc7d]/25 hover:bg-white/[0.05]
                  shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300">
                  <CardContent className="p-0 flex flex-col gap-3 flex-1">
                    <div className="text-[#00bc7d] flex gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} className="size-4 fill-current" />)}
                    </div>
                    <p className="text-[#9f9fa9] text-sm leading-5">"{quote}"</p>
                  </CardContent>
                  <CardFooter className="p-0 gap-3">
                    <div className="size-10 rounded-full overflow-hidden shrink-0">
                      <img src={img} alt={name} className="size-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{name}</span>
                      <span className="font-mono text-[#00bc7d] text-xs">{college}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none bg-[radial-gradient(ellipse_at_center,oklch(0.696_0.17_162.48/0.15),transparent_60%)] absolute inset-0" />
        <FloatOrb className="w-[400px] h-[400px] bg-[#00bc7d]/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-[1140px] text-center mx-auto px-8 py-24">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl font-bold text-4xl tracking-tight mx-auto">
            Your placement season is coming.{" "}
            <span className="text-[#00bc7d]">Start today.</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex mt-8 justify-center">
            <Button className="bg-[#00bc7d] text-[#0d542b] gap-2 hover:bg-[#00a86e]" size="lg" asChild>
              <Link to="/login"><Zap className="size-5" />Join Free — No Credit Card</Link>
            </Button>
          </motion.div>
          <p className="text-[#9f9fa9] text-sm mt-4">Join 1,200+ students already on their streak.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950">
        <div className="max-w-[1140px] mx-auto px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
            <div className="max-w-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#00bc7d] text-[#0d542b] flex justify-center items-center">
                  <Code2 className="size-5" />
                </div>
                <span className="font-semibold text-lg">CodeLoom</span>
              </div>
              <p className="text-[#9f9fa9] text-sm leading-5">
                Get placed in 60 days. Daily problems, pattern-based learning, and real-time contests built for Indian placements.
              </p>
              <a href="mailto:tejasdherange0099@gmail.com" className="text-[#9f9fa9] hover:text-[#00bc7d] text-sm flex items-center gap-2 transition-colors">
                <Mail className="size-4" />tejasdherange0099@gmail.com
              </a>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <span className="font-medium uppercase text-[#9f9fa9] text-xs tracking-wide mb-1">Product</span>
                {[{ l: "Problems", to: "/dashboard" }, { l: "Contests", to: "/dashboard/contest" }, { l: "Patterns", to: "/patterns" }].map(({ l, to }) => (
                  <Link key={l} to={to} className="text-[#9f9fa9] hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium uppercase text-[#9f9fa9] text-xs tracking-wide mb-1">Company</span>
                {[{ l: "Pricing", to: "/dashboard/pricing" }, { l: "Privacy Policy", to: "/privacy-policy" }].map(({ l, to }) => (
                  <Link key={l} to={to} className="text-[#9f9fa9] hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 flex flex-col sm:flex-row mt-8 pt-6 justify-between items-center gap-2">
            <span className="text-[#9f9fa9] text-xs">© 2025 CodeLoom. All rights reserved.</span>
            <span className="text-[#9f9fa9] text-xs">Made with ☕ in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
