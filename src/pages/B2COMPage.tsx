import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface LayoutContext {
  currentLocation: "MCI_SPAIN" | "MCI_LATAM" | null;
}

const B2COMPage = () => {
  const { currentLocation } = useOutletContext<LayoutContext>();
  const sedeLabel = currentLocation === "MCI_SPAIN" ? "MCI Spain" : currentLocation === "MCI_LATAM" ? "MCI LATAM" : "";

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 size={24} />
          B2COM {sedeLabel && `— ${sedeLabel}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Contenido en desarrollo. Próximamente se mostrará la información B2COM de la sede seleccionada.
        </p>
      </CardContent>
    </Card>
  );
};

export default B2COMPage;
