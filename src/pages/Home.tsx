import { Activity, Shield, Mic, BookOpen, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-block">
          <span className="badge-soft">
            💡 Smart Insurance Estimation
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient leading-tight">
          Medical Insurance Price Estimator
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Get instant, accurate estimates for medical insurance costs in India with our intelligent AI-powered calculator
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Link to="/estimate" className="btn-gradient px-8 py-3 rounded-lg font-semibold flex items-center gap-2 group">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-3 rounded-lg font-semibold border-2 border-primary/30 hover:bg-primary/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Activity className="w-10 h-10" />}
          title="Smart Estimates"
          description="Calculate insurance costs based on age, health conditions, and treatment needs"
        />
        <FeatureCard
          icon={<Shield className="w-10 h-10" />}
          title="Plan Comparison"
          description="Compare Basic, Standard, and Premium plans side-by-side"
        />
        <FeatureCard
          icon={<Mic className="w-10 h-10" />}
          title="Voice Assistant"
          description="Use voice commands to input data and get instant estimates"
        />
        <FeatureCard
          icon={<BookOpen className="w-10 h-10" />}
          title="Learn & Explore"
          description="Understand how different factors impact insurance pricing"
        />
      </div>

      {/* Info Section */}
      <div className="card-elevated p-8 md:p-12 space-y-8">
        <div>
          <h2 className="text-4xl font-bold mb-2">How It Works</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <HowItWorksStep
            number="1"
            title="Input Your Details"
            description="Enter your age, health conditions, and treatment requirements. Our form guides you through each step."
          />
          <HowItWorksStep
            number="2"
            title="Get Instant Estimates"
            description="Our rule-based calculator provides accurate cost projections in INR within seconds."
          />
          <HowItWorksStep
            number="3"
            title="Compare Plans"
            description="Review annual premiums, coverage limits, and deductibles across three plan tiers."
          />
          <HowItWorksStep
            number="4"
            title="Save & Export"
            description="Track your estimates and export data to CSV for future reference and analysis."
          />
        </div>
      </div>

      {/* Trust Section */}
      <div className="card-elevated p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 space-y-6">
        <h3 className="text-2xl font-bold">Why Choose Our Estimator?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <TrustItem title="Privacy First" description="All calculations performed locally - your data never leaves your device" />
          <TrustItem title="Accurate Calculations" description="Rule-based system that considers all relevant healthcare factors" />
          <TrustItem title="Multi-Language Support" description="Available in 12+ Indian languages for accessibility" />
          <TrustItem title="Voice-Enabled" description="Hands-free estimation with advanced voice assistant technology" />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 py-8">
        <p className="text-lg text-muted-foreground">
          Ready to estimate your insurance costs?
        </p>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="card-elevated p-8 space-y-4 group">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const HowItWorksStep = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const TrustItem = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex gap-3">
      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Home;
