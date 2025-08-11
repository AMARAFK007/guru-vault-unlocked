import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Briefcase, LineChart, Brain, Rocket, Megaphone, Code, TrendingUp, DollarSign, ShieldCheck, CreditCard, BadgeCheck, Lock, PlayCircle, Download, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const GUMROAD_URL = "https://gumroad.com/your-product";
const categories = [{
  icon: Briefcase,
  label: "Business"
}, {
  icon: LineChart,
  label: "Trading"
}, {
  icon: Brain,
  label: "Self-Improvement"
}, {
  icon: Rocket,
  label: "Side Hustles"
}, {
  icon: Megaphone,
  label: "Marketing"
}, {
  icon: Code,
  label: "Tech & AI"
}, {
  icon: TrendingUp,
  label: "Investing"
}, {
  icon: DollarSign,
  label: "Finance"
}];
const testimonials = [{
  name: "Alex P.",
  role: "Agency Owner",
  quote: "Insane value. I’ve already implemented 3 frameworks and closed two new clients this week."
}, {
  name: "Sarah M.",
  role: "Trader",
  quote: "Worth 1000x the price. The trading modules alone cover everything I’ve been hunting for."
}, {
  name: "James K.",
  role: "Solo Founder",
  quote: "Downloaded the entire library in a day. This is a legit unfair advantage for $15."
}];
export default function Index() {
  useEffect(() => {
    document.title = "Unlock Every Online Guru Course — Here Just for $15";
    const desc = "50TB+ of premium courses from top entrepreneurs, traders, and creators. Lifetime access for $15.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);
  return <div className="min-h-screen bg-background text-foreground">
      <a href="#buy" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
        Skip to action
      </a>

      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>50TB+ PREMIUM COURSES </span>
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="secondary" className="hidden md:inline-flex">
              50TB+ Premium Courses
            </Badge>
            <Badge variant="secondary" className="hidden md:inline-flex">One-time $15</Badge>
            <Button asChild variant="hero" size="sm">
              <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Unlock All Guru Courses Now</a>
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
                Early bird access — Only 100/week at $15
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">Unlock Every ‘Online Guru’ Course Worth More than 1M$ —Here Just for $15</h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">Get lifetime access to 50TB+ of premium knowledge. Courses from today’s top creators & money-makers included for a one-time $15.</p>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Includes every major business, wealth, trading, and mindset course
                in one bundle. Andrew Tate, Iman Gadzhi, Luke Belmar, and more.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild id="buy" variant="hero" size="xl" className="w-full sm:w-auto shadow-glow">
                  <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Unlock All Guru Courses Now</a>
                </Button>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Secure checkout • Instant access
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <span role="img" aria-label="books">📚</span>
                  <span>Includes every major business, wealth, trading, and mindset course in one bundle.</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                  <Badge variant="secondary">Andrew Tate</Badge>
                  <Badge variant="secondary">Iman Gadzhi</Badge>
                  <Badge variant="secondary">Luke Belmar</Badge>
                  <Badge variant="secondary">+ 200+ More</Badge>
                </div>
                <div className="flex justify-center pt-2">
                  <Button asChild variant="cta" size="lg">
                    <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Buy Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What’s Inside */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">What’s Inside in the bundle?</h2>
            <p className="mt-2 text-muted-foreground">
              What's inside in the bundle: 50TB+ of premium content from the world's top entrepreneurs, traders, and business minds. Everything you need to build wealth and success.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(({
            icon: Icon,
            label
          }) => <Card key={label} className="transition hover:shadow-elegant">
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>)}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-center">Featured Gurus Included</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
              name: "Andrew Tate",
              topic: "Hustlers University"
            }, {
              name: "Iman Gadzhi",
              topic: "Digital Marketing"
            }, {
              name: "Luke Beimar",
              topic: "E-commerce"
            }, {
              name: "Jordan Welch",
              topic: "Dropshipping"
            }, {
              name: "Dan Lok",
              topic: "High Ticket Sales"
            }, {
              name: "Alex Hormazi",
              topic: ""
            }].map(g => <Card key={g.name} className="transition hover:shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                      <div>
                        <div className="font-medium">{g.name}</div>
                        {g.topic && <div className="text-xs text-muted-foreground">{g.topic}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">...and many more</p>
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
                <p className="mt-3 text-3xl font-bold tracking-tight">$1Million+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Buying everything separately costs six figures+
                </p>
              </div>
              <div className="rounded-lg border p-6 bg-secondary/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Your price
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight">$15</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  One-time, lifetime access
                </p>
                <Button asChild variant="hero" size="lg" className="mt-4 w-full">
                  <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Buy Now</a>
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
            {[{
            icon: CreditCard,
            title: "Buy",
            desc: "Pay $15 one-time via secure checkout."
          }, {
            icon: PlayCircle,
            title: "Instant Login",
            desc: "Access immediately after purchase."
          }, {
            icon: Download,
            title: "Download Everything",
            desc: "Grab the full library or what you need."
          }, {
            icon: GraduationCap,
            title: "Learn at Your Pace",
            desc: "Implement frameworks and grow."
          }].map(s => <Card key={s.title}>
                <CardContent className="p-6">
                  <s.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <div className="mt-3 font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
                </CardContent>
              </Card>)}
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
                Only 100 bundles per week at the $15 price.
              </p>
            </div>
            <Button asChild variant="cta" size="lg"><a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Get the $15 Bundle</a></Button>
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
            <Carousel opts={{
            loop: true
          }}>
              <CarouselContent>
                {testimonials.map((t, i) => <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardContent className="p-6 flex h-full flex-col">
                        <div className="flex items-center gap-3">
                          <img src="/placeholder.svg" alt={`${t.name} profile photo`} loading="lazy" className="h-10 w-10 rounded-full border object-cover" />
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
                  </CarouselItem>)}
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
                  Yes. You pay $15 once and get lifetime access.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>When do I get access?</AccordionTrigger>
                <AccordionContent>
                  You will get instant access! Immediately after your payment is successfully processed through Gumroad, you will be automatically redirected to a Google Drive link where you can download /watch all the courses.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                
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
          <Button asChild variant="hero" size="lg" className="w-full">
            <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Purchase Now</a>
          </Button>
        </div>
      </div>
    </div>;
}

// Local inline icon to avoid extra imports
function TimerIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M12 8v5l3 2M9 2h6M19.03 7.39A9 9 0 1 1 4.97 7.39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
}