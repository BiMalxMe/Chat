import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BrainCircuitIcon, 
  MessageSquareIcon, 
  ShieldIcon, 
  ZapIcon, 
  UsersIcon, 
  GlobeIcon,
  ArrowRightIcon,
  StarIcon,
  CheckIcon,
  SparklesIcon,
  LockIcon,
  RocketIcon,
  TrendingUpIcon
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: <MessageSquareIcon className="w-6 h-6" />,
      title: "Smart Conversations",
      description: "AI-powered chat that understands context and learns from your interactions"
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "Your messages are secured with military-grade encryption"
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Real-time messaging with instant delivery across the globe"
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Group Chats",
      description: "Create and manage groups with unlimited members"
    },
    {
      icon: <GlobeIcon className="w-6 h-6" />,
      title: "Global Reach",
      description: "Connect with people worldwide without boundaries"
    },
    {
      icon: <LockIcon className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your data is yours - we never sell or share your information"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Decorators */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-0 -left-4 size-96 bg-amber-500 opacity-20 blur-[100px]" />
        <div className="absolute bottom-0 -right-4 size-96 bg-orange-500 opacity-20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-lg">
              <BrainCircuitIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold">SapiensChat</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
            The Future of
            <span className="block">Intelligent Chat</span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience conversations that understand context, learn from interactions, and evolve with your needs. 
            Built by people who genuinely care about better communication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link 
              to="/signup" 
              className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <RocketIcon className="w-5 h-5" />
              Start Chatting Free
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/signup" 
              className="px-8 py-4 border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ShieldIcon className="w-5 h-5" />
              Create Account
            </Link>
          </div>

          <p className="text-white/50 text-sm">
            No credit card required • Free forever for personal use • Built with ❤️
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose SapiensChat?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Thoughtfully designed features that make communication better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="relative z-10 px-6 py-20 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Our Founder
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Why we built this platform
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              BC
            </div>
            
            <p className="text-white/80 text-lg mb-6 italic leading-relaxed">
              "I built SapiensChat because I was tired of communication platforms that didn't understand what people actually need. 
              We focused on creating something that feels natural, respects your privacy, and actually makes conversations better. 
              This isn't just another chat app - it's a tool we genuinely use every day to connect with the people who matter most."
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>
            
            <div>
              <div className="font-semibold text-lg">Bimal Chalise</div>
              <div className="text-white/60">CTO & Founder, SapiensChat</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Conversations?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join us in building better communication tools that actually work for people.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Get Started Now
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-white/50">
                <TrendingUpIcon className="w-5 h-5" />
                <span>Free forever • No credit card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-lg">
                  <BrainCircuitIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">SapiensChat</span>
              </div>
              <p className="text-white/60 text-sm">
                The future of intelligent communication
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2025 SapiensChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
