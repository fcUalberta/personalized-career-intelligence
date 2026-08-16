import { useState } from "react";
import { useListTargetRoles, useCreateTargetRole, useDeleteTargetRole, getListTargetRolesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus, Trash2, Target as TargetIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TargetRoles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: roles, isLoading } = useListTargetRoles();
  const createRole = useCreateTargetRole();
  const deleteRole = useDeleteTargetRole();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    roleName: "",
    location: "",
    compFloor: 0,
    priority: 1
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRole.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTargetRolesQueryKey() });
        setOpen(false);
        setFormData({ roleName: "", location: "", compFloor: 0, priority: 1 });
        toast({ title: "Target role added", description: "System is now tracking this trajectory." });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteRole.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTargetRolesQueryKey() });
        toast({ title: "Target role removed" });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="smallcaps text-[12px] mb-3" style={{ color: '#E2491F' }}>Section II — Your targets</p>
          <h1 className="serif font-light leading-[0.96] tracking-[-0.02em]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>Target<br /><span className="font-semibold">Roles.</span></h1>
          <p className="text-muted-foreground">Define the vectors you want to track.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-mono">
              <Plus className="w-4 h-4 mr-2" /> ADD TARGET
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono">NEW TARGET ROLE</DialogTitle>
              <DialogDescription>Add a new job title and location to your tracking radar.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Title</Label>
                <Input id="roleName" value={formData.roleName} onChange={(e) => setFormData({...formData, roleName: e.target.value})} required placeholder="e.g. Lead Frontend Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required placeholder="e.g. Remote, NYC" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compFloor">Comp Floor ($)</Label>
                  <Input id="compFloor" type="number" min="0" value={formData.compFloor || ''} onChange={(e) => setFormData({...formData, compFloor: Number(e.target.value)})} required className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-5)</Label>
                  <Input id="priority" type="number" min="1" max="5" value={formData.priority} onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})} className="font-mono" />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">CANCEL</Button>
                </DialogClose>
                <Button type="submit" disabled={createRole.isPending} className="font-mono">
                  {createRole.isPending ? "ADDING..." : "ADD TARGET"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground font-mono">LOADING TARGETS...</div>
          ) : roles && roles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">ROLE</TableHead>
                  <TableHead>LOCATION</TableHead>
                  <TableHead>COMP FLOOR</TableHead>
                  <TableHead>PRIORITY</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <TargetIcon className="w-4 h-4 mr-2 text-primary" />
                        {role.roleName}
                      </div>
                    </TableCell>
                    <TableCell>{role.location}</TableCell>
                    <TableCell className="font-mono">${(role.compFloor / 1000).toFixed(0)}k</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">P{role.priority || 1}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(role.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
              <TargetIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No target roles defined.</p>
              <p className="text-sm mt-1">Add a target role to begin matching against live market data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
