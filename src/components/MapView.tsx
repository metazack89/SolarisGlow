import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "12px",
};

const centerSantander = {
  lat: 7.1254,
  lng: -73.1198,
};

const sectorMarkers = [
  {
    id: 1,
    position: { lat: 7.1297, lng: -73.1198 },
    sector: "Empresarial",
    nombre: "Zona Comercial Bucaramanga",
    consumo: "1,250 kWh",
    color: "hsl(217, 91%, 60%)",
  },
  {
    id: 2,
    position: { lat: 7.1195, lng: -73.1260 },
    sector: "Vivienda",
    nombre: "Sector Residencial Cabecera",
    consumo: "850 kWh",
    color: "hsl(160, 84%, 39%)",
  },
  {
    id: 3,
    position: { lat: 7.8891, lng: -72.4967 },
    sector: "Industrial",
    nombre: "Parque Industrial Cúcuta",
    consumo: "2,400 kWh",
    color: "hsl(45, 100%, 60%)",
  },
  {
    id: 4,
    position: { lat: 7.1350, lng: -73.1280 },
    sector: "Público",
    nombre: "Complejo Gubernamental",
    consumo: "680 kWh",
    color: "hsl(280, 70%, 55%)",
  },
];

interface MapViewProps {
  apiKey: string;
}

export const MapView = ({ apiKey }: MapViewProps) => {
  const { toast } = useToast();
  const [selectedMarker, setSelectedMarker] = useState<typeof sectorMarkers[0] | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSearch = () => {
    if (!map || !searchAddress) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchAddress }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const location = results[0].geometry.location;
        map.panTo({ lat: location.lat(), lng: location.lng() });
        map.setZoom(15);
        toast({
          title: "Ubicación encontrada",
          description: `Mostrando: ${results[0].formatted_address}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo encontrar la dirección",
        });
      }
    });
  };

  const handleGetDirections = (marker: typeof sectorMarkers[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`;
    window.open(url, "_blank");
  };

  if (loadError) {
    return (
      <div className="p-8">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">Error al cargar Google Maps. Verifica tu API key.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mapa Regional</h2>
        <p className="text-muted-foreground">
          Santander y Norte de Santander - Datos por sector
        </p>
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
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={centerSantander}
            zoom={8}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry",
                  stylers: [{ color: "#242f3e" }],
                },
                {
                  featureType: "all",
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#242f3e" }],
                },
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#746855" }],
                },
              ],
            }}
          >
            {sectorMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedMarker(marker)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: marker.color,
                  fillOpacity: 0.9,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: 10,
                }}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-3 bg-card text-card-foreground rounded-lg min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{selectedMarker.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Sector: <span className="text-foreground font-semibold">{selectedMarker.sector}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Consumo: <span className="text-foreground font-semibold">{selectedMarker.consumo}</span>
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
              </InfoWindow>
            )}
          </GoogleMap>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sectorMarkers.map((marker) => (
          <motion.div
            key={marker.id}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedMarker(marker);
              map?.panTo(marker.position);
              map?.setZoom(14);
            }}
          >
            <Card className="border-border bg-card hover:shadow-[var(--shadow-glow)] transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: marker.color }}
                  />
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">
                      {marker.sector}
                    </p>
                    <p className="text-xs text-muted-foreground">{marker.consumo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
