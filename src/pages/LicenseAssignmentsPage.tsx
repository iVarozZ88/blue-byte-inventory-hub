
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Asset, getAssets } from '@/lib/db';
import LicenseAssignments from '@/components/LicenseAssignments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const LicenseAssignmentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [license, setLicense] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLicense = async () => {
      if (!id) return;
      
      try {
        const assets = await getAssets();
        const asset = assets.find(a => a.id === id);
        
        if (asset && asset.type === 'license') {
          setLicense(asset);
        } else {
          // If asset not found or not a license, go back
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading license:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLicense();
  }, [id, navigate]);

  const handleLicenseUpdated = () => {
    // Reload the license data
    const reloadLicense = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const assets = await getAssets();
        const asset = assets.find(a => a.id === id);
        
        if (asset && asset.type === 'license') {
          setLicense(asset);
        }
      } catch (error) {
        console.error('Error reloading license:', error);
      } finally {
        setLoading(false);
      }
    };
    
    reloadLicense();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading license...</span>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold">License Not Found</h1>
        <p className="mt-4">The license you are looking for does not exist or is not accessible.</p>
        <Button 
          className="mt-6"
          onClick={() => navigate('/assets')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage License Assignments</h1>
          <p className="text-muted-foreground mt-1">Assign this license to multiple users</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{license.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <LicenseAssignments 
            licenseId={license.id} 
            onUpdate={handleLicenseUpdated} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseAssignmentsPage;
