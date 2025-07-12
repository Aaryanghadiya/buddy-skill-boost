import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, MessageSquare, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_type: 'teach' | 'learn';
  level: string;
  created_at: string;
}

interface Profile {
  username: string;
  full_name: string;
  bio?: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (skillsData) {
        // Cast skill_type to proper type
        const typedSkills = skillsData.map(skill => ({
          ...skill,
          skill_type: skill.skill_type as 'teach' | 'learn'
        }));
        setSkills(typedSkills);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const teachSkills = skills.filter(skill => skill.skill_type === 'teach');
  const learnSkills = skills.filter(skill => skill.skill_type === 'learn');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SkillSwap</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.username || 'User'}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate('/browse')}>
              Browse Skills
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your skills and connect with the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills I Teach</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachSkills.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills I Want</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learnSkills.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connections</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills I Teach */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Skills I Teach</CardTitle>
                  <CardDescription>Share your expertise with others</CardDescription>
                </div>
                <Button size="sm" onClick={() => navigate('/skills/add?type=teach')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {teachSkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No teaching skills added yet. Share what you know!
                </p>
              ) : (
                <div className="space-y-4">
                  {teachSkills.map((skill) => (
                    <div key={skill.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{skill.title}</h4>
                        <Badge variant="secondary">{skill.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {skill.description}
                      </p>
                      <Badge variant="outline">{skill.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills I Want to Learn */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Skills I Want to Learn</CardTitle>
                  <CardDescription>What would you like to master?</CardDescription>
                </div>
                <Button size="sm" onClick={() => navigate('/skills/add?type=learn')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {learnSkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No learning goals added yet. What do you want to learn?
                </p>
              ) : (
                <div className="space-y-4">
                  {learnSkills.map((skill) => (
                    <div key={skill.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{skill.title}</h4>
                        <Badge variant="secondary">{skill.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {skill.description}
                      </p>
                      <Badge variant="outline">{skill.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}