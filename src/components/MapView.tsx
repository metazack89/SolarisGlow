import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';

// Iconos personalizados
const createIcon = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white"></div>`,
    iconSize: [16, 16],
  });

const centerSantander: [number, number] = [7.1254, -73.1198];

const sectorMarkers = [
  {
    id: 1,
    position: [7.1297, -73.1198] as [number, number],
    sector: 'Empresarial',
    nombre: 'Zona Comercial Bucaramanga',
    consumo: '1,250 kWh',
    color: 'hsl(217, 91%, 60%)',
  },
  {
    id: 2,
    position: [7.1195, -73.126] as [number, number],
    sector: 'Vivienda',
    nombre: 'Sector Residencial Cabecera',
    consumo: '850 kWh',
    color: 'hsl(160, 84%, 39%)',
  },
  {
    id: 3,
    position: [7.8891, -72.4967] as [number, number],
    sector: 'Industrial',
    nombre: 'Parque Industrial Cúcuta',
    consumo: '2,400 kWh',
    color: 'hsl(45, 100%, 60%)',
  },
  {
    id: 4,
    position: [7.135, -73.128] as [number, number],
    sector: 'Público',
    nombre: 'Complejo Gubernamental',
    consumo: '680 kWh',
    color: 'hsl(280, 70%, 55%)',
  },
];

function MapController({ location }: { location: [number, number] | null }) {
  const map = useMap();
  if (location) {
    map.setView(location, 14);
  }
  return null;
}

export const MapView = () => {
  const { toast } = useToast();
  const [selectedMarker, setSelectedMarker] = useState<(typeof sectorMarkers)[0] | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [location, setLocation] = useState<[number, number] | null>(null);

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setLocation(coords);
        toast({
          title: 'Ubicación encontrada',
          description: `Mostrando: ${data[0].display_name}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo encontrar la dirección',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error de conexión',
        description: 'Intenta nuevamente',
      });
    }
  };

  const handleGetDirections = (marker: (typeof sectorMarkers)[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${marker.position[0]},${marker.position[1]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mapa Regional</h2>
        <p className="text-muted-foreground">Santander y Norte de Santander - Datos por sector</p>
      </motion.div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Búsqueda de Dirección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ingresa una dirección..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenedor del mapa con control de stacking */}
      <Card className="border-border bg-card overflow-hidden relative z-0">
        <CardContent className="p-0 relative z-0">
          <div className="relative z-0">
            <MapContainer
              center={centerSantander}
              zoom={8}
              className="z-0"
              style={{ height: '600px', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController location={location} />

              {sectorMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={createIcon(marker.color)}
                  eventHandlers={{
                    click: () => setSelectedMarker(marker),
                  }}
                />
              ))}

              {selectedMarker && (
                <Popup
                  position={selectedMarker.position}
                  eventHandlers={{ remove: () => setSelectedMarker(null) }}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{selectedMarker.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Sector:{' '}
                      <span className="text-foreground font-semibold">{selectedMarker.sector}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consumo:{' '}
                      <span className="text-foreground font-semibold">
                        {selectedMarker.consumo}
                      </span>
                    </p>
                    <Button
                      onClick={() => handleGetDirections(selectedMarker)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Cómo llegar
                    </Button>
                  </div>
                </Popup>
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
