import Link from "next/link";
import { CheckCircle2, Sparkles, MapPin, Share2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          MEO Tool Architecture Blueprint
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Next.js Enterprise <span className="text-primary">Todo Application</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A production-grade, layered monorepo architecture featuring Better Auth, Drizzle ORM,
          Neon Postgres, Server Actions, AI suggestions, and PASETO sharing.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/todos">
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Layered Architecture</CardTitle>
            <CardDescription>
              Clean separation of Action → Service → Repository with Zod runtime validation.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">AI Task Suggestions</CardTitle>
            <CardDescription>
              Smart planning powered by OpenAI gpt-4o-mini with schema validation & mock fallbacks.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <MapPin className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Geo & Social Context</CardTitle>
            <CardDescription>
              Attach locations via Geoapify and view Instagram & Google Business insights.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Share2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Cryptographic Sharing</CardTitle>
            <CardDescription>
              Tamper-proof, stateless public sharing powered by PASETO v4 local tokens.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Better Auth & RBAC</CardTitle>
            <CardDescription>
              Secure session cookies, password management, and server-side admin role guards.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <span className="font-bold text-sm">🧪</span>
            </div>
            <CardTitle className="text-lg">Automated Test Suite</CardTitle>
            <CardDescription>
              Comprehensive Vitest and Testing Library coverage across unit, service, and DOM tiers.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
