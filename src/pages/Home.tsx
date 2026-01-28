import { Activity, Shield, Mic, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Medical Insurance Price Estimator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get instant estimates for medical insurance costs in India with our intelligent calculator
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Activity className="w-8 h-8" />}
          title="Smart Estimates"
          description="Calculate insurance costs based on age, health conditions, and treatment needs"
        />
        <FeatureCard
          icon={<Shield className="w-8 h-8" />}
          title="Plan Comparison"
          description="Compare Basic, Standard, and Premium plans side-by-side"
        />
        <FeatureCard
          icon={<Mic className="w-8 h-8" />}
          title="Voice Assistant"
          description="Use voice commands to input data and get instant estimates"
        />
        <FeatureCard
          icon={<BookOpen className="w-8 h-8" />}
          title="Learn & Explore"
          description="Understand how different factors impact insurance pricing"
        />
      </div>

      {/* Info Section */}
      <div className="glass-card p-8 space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Input Your Details:</strong> Enter your age, health conditions, and treatment requirements
          </p>
          <p>
            <strong className="text-foreground">2. Get Instant Estimates:</strong> Our rule-based calculator provides accurate cost projections in INR
          </p>
          <p>
            <strong className="text-foreground">3. Compare Plans:</strong> Review annual premiums, coverage limits, and deductibles across three plan tiers
          </p>
          <p>
            <strong className="text-foreground">4. Save History:</strong> Track your estimates and export data for future reference
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          All calculations are performed locally in your browser - your data never leaves your device
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
    <div className="glass-card p-6 space-y-3 hover:shadow-lg transition-shadow">
      <div className="text-primary">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home;
