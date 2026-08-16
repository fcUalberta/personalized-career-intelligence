import { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    currentTitle: "",
    yearsExperience: 0,
    industry: "",
    location: "",
    desiredCompMin: 0,
    linkedinUrl: "",
    bio: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        currentTitle: profile.currentTitle || "",
        yearsExperience: profile.yearsExperience || 0,
        industry: profile.industry || "",
        location: profile.location || "",
        desiredCompMin: profile.desiredCompMin || 0,
        linkedinUrl: profile.linkedinUrl || "",
        bio: profile.bio || "",
      });
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'yearsExperience' || name === 'desiredCompMin' ? Number(value) : value 
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile.mutate({
      data: {
        ...formData,
        skills,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Profile updated",
          description: "Your system profile has been successfully saved.",
        });
      },
      onError: () => {
        toast({
          title: "Error saving profile",
          description: "Please check your inputs and try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-mono">LOADING PROFILE DATA...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="smallcaps text-[12px] mb-3" style={{ color: '#E2491F' }}>Section I — Your profile</p>
        <h1 className="serif font-light leading-[0.96] tracking-[-0.02em]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>Job Seeker<br /><span className="font-semibold">Profile.</span></h1>
        <p className="text-muted-foreground">Define your current state to calibrate matches.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-mono">CORE IDENTITY</CardTitle>
            <CardDescription>Base parameters for market calibration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentTitle">Current Title</Label>
                <Input 
                  id="currentTitle" 
                  name="currentTitle" 
                  value={formData.currentTitle} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Senior Product Designer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  name="industry" 
                  value={formData.industry} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. SaaS, Fintech"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input 
                  id="yearsExperience" 
                  name="yearsExperience" 
                  type="number" 
                  min="0"
                  value={formData.yearsExperience} 
                  onChange={handleChange} 
                  required 
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="e.g. San Francisco, CA (or Remote)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredCompMin">Desired Comp Floor ($)</Label>
                <Input 
                  id="desiredCompMin" 
                  name="desiredCompMin" 
                  type="number" 
                  min="0"
                  value={formData.desiredCompMin} 
                  onChange={handleChange} 
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input 
                  id="linkedinUrl" 
                  name="linkedinUrl" 
                  value={formData.linkedinUrl} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Skill Vector</Label>
              <div className="text-xs text-muted-foreground mb-2">Press Enter to add skills.</div>
              <div className="flex flex-wrap gap-2 mb-4 p-4 border bg-muted/20 min-h-[100px]">
                {skills.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">No skills registered.</span>
                ) : (
                  skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1 gap-1 text-sm font-normal">
                      {skill}
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-muted p-0.5 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
              <Input 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and press Enter..."
                className="font-mono text-sm max-w-sm"
              />
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="bio">Professional Bio</Label>
              <textarea 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="flex min-h-[100px] w-full border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Brief summary of your trajectory..."
              />
            </div>

          </CardContent>
          <CardFooter className="bg-muted/50 py-4 flex justify-between">
            <div className="text-sm text-muted-foreground flex items-center">
              {skills.length === 0 && <span className="flex items-center text-amber-500"><AlertCircle className="w-4 h-4 mr-1" /> Add skills to enable matching</span>}
            </div>
            <Button type="submit" disabled={updateProfile.isPending} className="font-mono">
              <Save className="w-4 h-4 mr-2" />
              {updateProfile.isPending ? "SAVING..." : "SAVE PROFILE"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
