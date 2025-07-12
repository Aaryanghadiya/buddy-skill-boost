import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_type: 'teach' | 'learn';
  level: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

export default function Browse() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('teach');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, categoryFilter, typeFilter]);

  const fetchSkills = async () => {
    try {
      // First get skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (skillsError) throw skillsError;

      // Then get profiles for those skills
      const userIds = [...new Set(skillsData?.map(skill => skill.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const skillsWithProfiles = skillsData?.map(skill => {
        const profile = profilesData?.find(p => p.user_id === skill.user_id);
        return {
          ...skill,
          skill_type: skill.skill_type as 'teach' | 'learn',
          profiles: profile || { username: 'Unknown', full_name: 'Unknown User' }
        };
      }) || [];

      // Filter out current user's skills
      const otherUserSkills = skillsWithProfiles.filter(skill => skill.user_id !== user?.id);
      setSkills(otherUserSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = () => {
    let filtered = skills.filter(skill => skill.skill_type === typeFilter);

    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(skill => skill.category === categoryFilter);
    }

    setFilteredSkills(filtered);
  };

  const handleConnect = async (skill: Skill) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('skill_matches')
        .insert({
          requester_id: user.id,
          provider_id: skill.user_id,
          skill_id: skill.id,
          message: `Hi! I'm interested in learning ${skill.title}.`
        });

      if (error) throw error;

      toast({
        title: "Connection request sent!",
        description: `Your request to learn ${skill.title} has been sent.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Browse Skills</h1>
            </div>
          </div>
          {user && (
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              My Dashboard
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teach">Teaching</SelectItem>
                <SelectItem value="learn">Learning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No skills found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{skill.title}</CardTitle>
                    <Badge variant={skill.skill_type === 'teach' ? 'default' : 'secondary'}>
                      {skill.level}
                    </Badge>
                  </div>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{skill.category}</Badge>
                      <div className="text-sm text-muted-foreground">
                        by {skill.profiles.username}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConnect(skill)}
                      disabled={!user}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {skill.skill_type === 'teach' ? 'Request to Learn' : 'Offer to Teach'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}