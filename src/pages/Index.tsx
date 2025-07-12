import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Users, BookOpen, MessageSquare, ArrowRight, Star, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SkillSwap</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn, Teach, Connect
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a vibrant community where knowledge flows freely. Share your skills, 
            learn from others, and build meaningful connections through skill exchange.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Swapping Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/browse')}>
              Explore Skills
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">How SkillSwap Works</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process to connect, learn, and grow with others
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Share Your Skills</CardTitle>
              <CardDescription>
                List the skills you can teach and what you'd like to learn
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Connect & Match</CardTitle>
              <CardDescription>
                Find people with complementary skills and start conversations
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Learn Together</CardTitle>
              <CardDescription>
                Exchange knowledge, practice together, and grow your abilities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose SkillSwap?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Free Learning</h4>
              <p className="text-muted-foreground">
                No fees, no subscriptions. Just pure knowledge exchange
              </p>
            </div>
            
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Trusted Community</h4>
              <p className="text-muted-foreground">
                Safe, verified members who are passionate about learning
              </p>
            </div>
            
            <div className="text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Real-time Matching</h4>
              <p className="text-muted-foreground">
                Instant connections with people who share your interests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-muted-foreground mb-8">
            Join thousands of learners and teachers in our growing community
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Join SkillSwap Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <span className="font-semibold">SkillSwap</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connecting learners and teachers worldwide
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
