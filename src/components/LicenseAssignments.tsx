
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { toast } from './ui/use-toast';
import { Asset, getAssets, updateAsset } from '@/lib/db';
import { Plus, X, Users, User, Loader2 } from 'lucide-react';

interface LicenseAssignmentsProps {
  licenseId: string;
  onUpdate?: () => void;
}

interface LicenseAssignment {
  id: string;
  username: string;
}

const LicenseAssignments = ({ licenseId, onUpdate }: LicenseAssignmentsProps) => {
  const [license, setLicense] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignments, setAssignments] = useState<LicenseAssignment[]>([]);
  const [newAssignment, setNewAssignment] = useState('');

  useEffect(() => {
    const loadLicense = async () => {
      try {
        const assets = await getAssets();
        const foundLicense = assets.find(asset => asset.id === licenseId);
        
        if (foundLicense) {
          setLicense(foundLicense);
          
          // Check if we have existing assignments in notes (JSON format)
          if (foundLicense.notes) {
            try {
              const parsedNotes = JSON.parse(foundLicense.notes);
              if (Array.isArray(parsedNotes.assignments)) {
                setAssignments(parsedNotes.assignments);
              }
            } catch (e) {
              console.error('Error parsing license assignments:', e);
              // If not valid JSON, initialize with current assignedTo if available
              if (foundLicense.assignedTo) {
                setAssignments([{ 
                  id: 'initial', 
                  username: foundLicense.assignedTo 
                }]);
              }
            }
          } else if (foundLicense.assignedTo) {
            // If no notes but assignedTo is set, initialize with that
            setAssignments([{ 
              id: 'initial', 
              username: foundLicense.assignedTo 
            }]);
          }
        }
      } catch (error) {
        console.error('Error loading license:', error);
        toast({
          title: "Error",
          description: "Could not load license information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadLicense();
  }, [licenseId]);
  
  const handleAddAssignment = () => {
    if (!newAssignment.trim()) return;
    
    const newId = `assignment-${Date.now()}`;
    setAssignments([...assignments, { id: newId, username: newAssignment.trim() }]);
    setNewAssignment('');
  };
  
  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };
  
  const handleSaveAssignments = async () => {
    if (!license) return;
    
    try {
      setSaving(true);
      
      // Store assignments in notes as JSON
      const notesObj = {
        assignments,
        generalNotes: license.notes ? extractGeneralNotes(license.notes) : ''
      };
      
      // Update assignedTo to the first assignment or empty if none
      const primaryAssignee = assignments.length > 0 ? assignments[0].username : '';
      
      // Update the license
      await updateAsset({
        ...license,
        notes: JSON.stringify(notesObj),
        assignedTo: primaryAssignee
      });
      
      toast({
        title: "Assignments saved",
        description: `License assignments have been updated.`,
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving license assignments:', error);
      toast({
        title: "Error saving assignments",
        description: "There was a problem updating the license assignments.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Extract general notes if they exist in the JSON
  const extractGeneralNotes = (notes: string): string => {
    try {
      const parsedNotes = JSON.parse(notes);
      return parsedNotes.generalNotes || '';
    } catch (e) {
      return notes; // Return the original notes if parsing fails
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading license information...</span>
      </div>
    );
  }
  
  if (!license) {
    return (
      <div className="p-4 text-center">
        <p>License not found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">License Assignments</h3>
          <p className="text-sm text-muted-foreground">
            {license.name} - {license.model || 'No model specified'}
          </p>
        </div>
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{assignments.length} users</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <Label htmlFor="new-assignment">Add User Assignment</Label>
            <Input
              id="new-assignment"
              value={newAssignment}
              onChange={(e) => setNewAssignment(e.target.value)}
              placeholder="Enter username"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAssignment();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleAddAssignment}
            className="flex items-center gap-1"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label>Current Assignments</Label>
          {assignments.length === 0 ? (
            <div className="border rounded p-4 text-center text-muted-foreground">
              No users are currently assigned to this license.
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{assignment.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAssignment(assignment.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSaveAssignments} 
            className="w-full"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Assignments'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LicenseAssignments;
