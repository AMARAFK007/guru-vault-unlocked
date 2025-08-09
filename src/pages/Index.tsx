import { Link } from "react-router-dom";
import {
  Briefcase,
  LineChart,
  Brain,
  Rocket,
  Megaphone,
  Code,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  Lock,
  PlayCircle,
  Download,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  { icon: Briefcase, label: "Business" },
  { icon: LineChart, label: "Trading" },
  { icon: Brain, label: "Self-Improvement" },
  { icon: Rocket, label: "Side Hustles" },
  { icon: Megaphone, label: "Marketing" },
  { icon: Code, label: "Tech & AI" },
  { icon: TrendingUp, label: "Investing" },
  { icon: DollarSign, label: "Finance" },
];

const testimonials = [
  {
    name: "Alex P.",
    role: "Agency Owner",
    quote:
      "Insane value. I’ve already implemented 3 frameworks and closed two new clients this week.",
  },
  {
    name: "Sarah M.",
    role: "Trader",
    quote:
      "Worth 1000x the price. The trading modules alone cover everything I’ve been hunting for.",
  },
  {
    name: "James K.",
    role: "Solo Founder",
    quote:
      "Downloaded the entire library in a day. This is a legit unfair advantage for $10.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#buy"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to action
      </a>

      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Guru Vault Unlocked</span>
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="secondary" className="hidden md:inline-flex">
              50TB+ Premium Courses
            </Badge>
            <Badge variant="secondary" className="hidden md:inline-flex">
              One-time $10
            </Badge>
            <Button asChild variant="hero" size="sm">
              <a href="#buy">Unlock All Guru Courses Now</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-20" />
          <div className="container py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
              <Badge variant="outline" className="mb-4 inline-flex gap-2">
                <Lock className="h-4 w-4" aria-hidden="true" />
                Early bird access — Only 100/week at $10
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Unlock Every ‘Online Guru’ Course—Just $10
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Get lifetime access to 50TB+ of premium knowledge. Courses from
                today’s top creators & money-makers included for a one-time $10.
              </p>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Includes every major business, wealth, trading, and mindset course
                in one bundle. Andrew Tate, Iman Gadzhi, Luke Belmar, and more.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button id="buy" variant="hero" size="xl" className="w-full sm:w-auto shadow-glow">
                  Unlock All Guru Courses Now
                </Button>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Secure checkout • Instant access
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 items-center justify-items-center gap-6 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Stripe
                </div>
                <div className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  PayPal
                </div>
                <div className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  30-day refund
                </div>
                {/* TODO: Replace icons above with official brand badges/logos */}
              </div>
            </div>
          </div>
        </section>

        {/* What’s Inside */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">What’s Inside</h2>
            <p className="mt-2 text-muted-foreground">
              A complete library covering the skills that build income, freedom, and
              leverage.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(({ icon: Icon, label }) => (
              <Card key={label} className="transition hover:shadow-elegant">
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Price Comparison */}
        <section className="container py-12 md:py-16">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle>Price Comparison</CardTitle>
              <CardDescription>
                Individual courses vs. your one-time lifetime price
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" aria-hidden="true" />
                  Individual courses
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight">$100,000+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Buying everything separately costs six figures+
                </p>
              </div>
              <div className="rounded-lg border p-6 bg-secondary/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Your price
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight">$10</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  One-time, lifetime access
                </p>
                <Button variant="hero" size="lg" className="mt-4 w-full">
                  Unlock Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Simple, fast, and secure.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: CreditCard, title: "Buy", desc: "Pay $10 one-time via secure checkout." },
              { icon: PlayCircle, title: "Instant Login", desc: "Access immediately after purchase." },
              { icon: Download, title: "Download Everything", desc: "Grab the full library or what you need." },
              { icon: GraduationCap, title: "Learn at Your Pace", desc: "Implement frameworks and grow." },
            ].map((s) => (
              <Card key={s.title}>
                <CardContent className="p-6">
                  <s.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <div className="mt-3 font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Scarcity */}
        <section className="container py-6">
          <div className="rounded-lg border p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <TimerIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                Early bird pricing
              </div>
              <p className="mt-1 font-semibold">
                Only 100 bundles per week at the $10 price.
              </p>
            </div>
            <Button variant="cta" size="lg">Get the $10 Bundle</Button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Reviews</h2>
            <p className="mt-2 text-muted-foreground">
              Real people. Real outcomes.
            </p>
          </div>

          <div className="mt-8 relative">
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {testimonials.map((t, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardContent className="p-6 flex h-full flex-col">
                        <div className="flex items-center gap-3">
                          <img
                            src="/placeholder.svg"
                            alt={`${t.name} profile photo`}
                            loading="lazy"
                            className="h-10 w-10 rounded-full border object-cover"
                          />
                          <div>
                            <div className="font-medium">{t.name}</div>
                            <div className="text-xs text-muted-foreground">{t.role}</div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-foreground/90">“{t.quote}”</p>
                        <div className="mt-auto pt-4 text-xs text-muted-foreground">
                          Verified buyer
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            {/* TODO: Replace placeholder images and copy with real reviews or videos */}
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-center">FAQ</h2>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="q1">
                <AccordionTrigger>Is this a one-time payment?</AccordionTrigger>
                <AccordionContent>
                  Yes. You pay $10 once and get lifetime access.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>When do I get access?</AccordionTrigger>
                <AccordionContent>
                  Immediately after checkout. You’ll receive instant login details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Can I get a refund?</AccordionTrigger>
                <AccordionContent>
                  Yes. There’s a 30-day refund policy if you’re not satisfied.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>How large is the library?</AccordionTrigger>
                <AccordionContent>
                  Over 50TB+ of premium content across all major money-making skills.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Guru Vault Unlocked • All rights reserved
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:support@example.com" className="underline underline-offset-4">
              Support
            </a>
            <a href="#buy" className="underline underline-offset-4">
              Get Access
            </a>
          </div>
          {/* TODO: Replace support email with your real contact */}
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 sm:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <Button variant="hero" size="lg" className="w-full">
            Unlock All Guru Courses Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// Local inline icon to avoid extra imports
function TimerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 8v5l3 2M9 2h6M19.03 7.39A9 9 0 1 1 4.97 7.39"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
