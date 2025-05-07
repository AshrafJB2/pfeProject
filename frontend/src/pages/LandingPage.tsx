import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  // Feature data for cleaner component structure
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
          <path d="M9 9h1" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      ),
      title: "Smart Summaries",
      description: "Generate concise summaries with adjustable length options to fit your needs."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21 11-8-8-8 8" />
          <path d="m21 16-8-8-8 8" />
        </svg>
      ),
      title: "Keyword Extraction",
      description: "Automatically identify and extract the most relevant keywords from your content."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z" />
        </svg>
      ),
      title: "Multiple Export Formats",
      description: "Download your processed content as PDF, DOCX, or plain text files."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-muted/20">
      {/* Navigation (optional) */}
      <nav className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-semibold">ContentScribe</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild variant="ghost">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 p-4 shadow-lg backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI-Powered Content
            </span>{" "}
            Analysis at Your Fingertips
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            ContentScribe leverages cutting-edge AI to transform your documents into actionable insights with automatic summarization, keyword extraction, and intelligent content analysis.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {isAuthenticated ? (
              <Button asChild size="lg" className="px-8">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="px-8">
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link to="/login">See Demo</Link>
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background/0 via-primary/5 to-background/0" />
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold md:text-4xl"
          >
            <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
              Powerful Features
            </span>{" "}
            for Content Mastery
          </motion.h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border/50 bg-background/80 p-8 shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 p-3 text-primary transition-all group-hover:bg-primary/20 group-hover:shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-8 md:p-12"
          >
            <div className="mx-auto max-w-3xl text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-6 h-8 w-8 text-primary"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
              <p className="mb-6 text-lg italic text-muted-foreground md:text-xl">
                "ContentScribe has revolutionized our content workflow. What used to take hours of manual analysis now happens in seconds with incredible accuracy."
              </p>
              <div className="font-medium">
                <p className="text-foreground">Sarah Johnson</p>
                <p className="text-primary">Marketing Director, TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-background p-8 shadow-lg md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Transform Your Content?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join thousands of professionals who save hours every week with ContentScribe's AI-powered tools.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-semibold">ContentScribe</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground md:gap-8">
              <Link to="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary hover:underline">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary hover:underline">Contact Us</Link>
              <Link to="/about" className="hover:text-primary hover:underline">About</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ContentScribe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}