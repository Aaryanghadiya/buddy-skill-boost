import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus } from 'lucide-react';

export default function AddSkill() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    skill_type: 'teach' as 'teach' | 'learn'
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const type = searchParams.get('type');
    if (type === 'teach' || type === 'learn') {
      setFormData(prev => ({ ...prev, skill_type: type }));
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          ...formData,
          user_id: user!.id
        });

      if (error) throw error;

      toast({
        title: "Skill added successfully!",
        description: `Your ${formData.skill_type === 'teach' ? 'teaching' : 'learning'} skill has been added.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Technology',
    'Languages',
    'Arts & Crafts',
    'Music',
    'Sports & Fitness',
    'Cooking',
    'Business',
    'Writing',
    'Photography',
    'DIY & Home',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">Add New Skill</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {formData.skill_type === 'teach' ? 'Share Your Expertise' : 'What Would You Like to Learn?'}
            </CardTitle>
            <CardDescription>
              {formData.skill_type === 'teach' 
                ? 'Add a skill you can teach to help others in the community'
                : 'Add a skill you want to learn and connect with teachers'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Skill Type Selection */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={formData.skill_type} 
                  onValueChange={(value: 'teach' | 'learn') => 
                    setFormData(prev => ({ ...prev, skill_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teach">I can teach this</SelectItem>
                    <SelectItem value="learn">I want to learn this</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Skill Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Guitar Basics, Web Development, Spanish Conversation"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={formData.skill_type === 'teach' 
                    ? "Describe what you'll teach and your experience..."
                    : "Describe what you want to learn and your current level..."
                  }
                  rows={4}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label>
                  {formData.skill_type === 'teach' ? 'Your Level *' : 'Desired Level *'}
                </Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Skill"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}