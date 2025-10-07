import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Download, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface BillData {
  nombre: string;
  consumo: string;
  sector: string;
  direccion: string;
}

const tarifas = {
  empresarial: 520,
  vivienda: 485,
  industrial: 650,
  publico: 510,
};

export const BillSimulator = () => {
  const { toast } = useToast();
  const [billData, setBillData] = useState<BillData>({
    nombre: "",
    consumo: "",
    sector: "",
    direccion: "",
  });
  const [calculatedBill, setCalculatedBill] = useState<number | null>(null);

  const handleInputChange = (field: keyof BillData, value: string) => {
    setBillData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBill = () => {
    if (!billData.nombre || !billData.consumo || !billData.sector || !billData.direccion) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos",
      });
      return;
    }

    const consumo = parseFloat(billData.consumo);
    const tarifa = tarifas[billData.sector as keyof typeof tarifas];
    const subtotal = consumo * tarifa;
    const alumbrado = subtotal * 0.05;
    const total = subtotal + alumbrado;

    setCalculatedBill(total);
    toast({
      title: "Factura calculada",
      description: `Total: $${total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`,
    });
  };

  const downloadPDF = () => {
    if (!calculatedBill) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Primero calcula la factura",
      });
      return;
    }

    const doc = new jsPDF();
    const tarifa = tarifas[billData.sector as keyof typeof tarifas];
    const consumo = parseFloat(billData.consumo);
    const subtotal = consumo * tarifa;
    const alumbrado = subtotal * 0.05;

    // Header
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Energy Platform", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Factura de Energía Eléctrica", 105, 30, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Client info
    doc.setFontSize(12);
    doc.text("Información del Cliente", 20, 55);
    doc.setFontSize(10);
    doc.text(`Nombre: ${billData.nombre}`, 20, 65);
    doc.text(`Dirección: ${billData.direccion}`, 20, 72);
    doc.text(`Sector: ${billData.sector.charAt(0).toUpperCase() + billData.sector.slice(1)}`, 20, 79);

    // Consumption details
    doc.setFontSize(12);
    doc.text("Detalles de Consumo", 20, 95);
    doc.setFontSize(10);
    doc.text(`Consumo: ${consumo} kWh`, 20, 105);
    doc.text(`Tarifa: $${tarifa}/kWh`, 20, 112);
    doc.text(`Subtotal: $${subtotal.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, 20, 119);
    doc.text(`Contribución alumbrado público (5%): $${alumbrado.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, 20, 126);

    // Total
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 135, 180, 15, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL A PAGAR: $${calculatedBill.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`, 105, 145, { align: "center" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Energy Platform - Gestión Energética Santander y Norte de Santander", 105, 280, { align: "center" });
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-CO")}`, 105, 285, { align: "center" });

    doc.save(`factura_${billData.nombre.replace(/\s/g, "_")}.pdf`);

    toast({
      title: "PDF descargado",
      description: "La factura se ha descargado correctamente",
    });
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-foreground mb-2">Simulador de Factura</h2>
        <p className="text-muted-foreground">Calcula y descarga tu factura de energía</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-card-foreground">
                Nombre Completo
              </Label>
              <Input
                id="nombre"
                value={billData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Juan Pérez"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="direccion" className="text-card-foreground">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={billData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                placeholder="Calle 45 #23-15"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="sector" className="text-card-foreground">
                Sector
              </Label>
              <Select value={billData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresarial">Empresarial</SelectItem>
                  <SelectItem value="vivienda">Vivienda</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="publico">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consumo" className="text-card-foreground">
                Consumo (kWh)
              </Label>
              <Input
                id="consumo"
                type="number"
                value={billData.consumo}
                onChange={(e) => handleInputChange("consumo", e.target.value)}
                placeholder="450"
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button
              onClick={calculateBill}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Zap className="w-4 h-4 mr-2" />
              Calcular Factura
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {calculatedBill ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-lg bg-gradient-to-br from-[hsl(var(--energy-electric))]/20 to-[hsl(var(--energy-green))]/20 border border-[hsl(var(--energy-electric))]/30">
                  <p className="text-sm text-muted-foreground mb-2">Total a pagar</p>
                  <p className="text-4xl font-bold text-foreground">
                    ${calculatedBill.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consumo:</span>
                    <span className="text-foreground font-semibold">{billData.consumo} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarifa:</span>
                    <span className="text-foreground font-semibold">
                      ${tarifas[billData.sector as keyof typeof tarifas]}/kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sector:</span>
                    <span className="text-foreground font-semibold capitalize">
                      {billData.sector}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={downloadPDF}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Factura PDF
                </Button>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-center py-12">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Completa el formulario y calcula tu factura para ver el resultado
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Tarifas por Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tarifas).map(([sector, tarifa]) => (
              <div
                key={sector}
                className="p-4 rounded-lg bg-gradient-to-br from-card to-muted border border-border"
              >
                <p className="text-sm text-muted-foreground capitalize mb-1">{sector}</p>
                <p className="text-2xl font-bold text-foreground">${tarifa}</p>
                <p className="text-xs text-muted-foreground">por kWh</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
