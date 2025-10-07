import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Leaf, Zap, Sun, Wind } from "lucide-react";

const newsArticles = [
  {
    id: 1,
    title: "Paneles Solares: Revolución Energética en Bucaramanga",
    excerpt:
      "La instalación de paneles solares en zonas residenciales de Bucaramanga ha reducido el consumo eléctrico en un 40%, contribuyendo significativamente a la sostenibilidad ambiental.",
    date: "2024-03-15",
    readTime: "5 min",
    category: "Solar",
    icon: Sun,
    image: "hsl(45, 100%, 60%)",
    impact: "Reducción de 500 toneladas de CO2 al año",
  },
  {
    id: 2,
    title: "Energía Eólica en Norte de Santander: Proyecto Piloto",
    excerpt:
      "Un innovador proyecto de energía eólica en Cúcuta está generando energía limpia para más de 2,000 hogares, marcando un hito en la transición energética de la región.",
    date: "2024-03-10",
    readTime: "7 min",
    category: "Eólica",
    icon: Wind,
    image: "hsl(200, 80%, 50%)",
    impact: "Energía limpia para 2,000+ hogares",
  },
  {
    id: 3,
    title: "Iluminación LED: Ahorro y Sostenibilidad en Santander",
    excerpt:
      "La implementación de tecnología LED en alumbrado público ha generado un ahorro del 60% en consumo energético, reduciendo la huella de carbono regional.",
    date: "2024-03-05",
    readTime: "4 min",
    category: "Eficiencia",
    icon: Zap,
    image: "hsl(160, 84%, 39%)",
    impact: "60% de ahorro energético",
  },
  {
    id: 4,
    title: "Biomasa: Energía Renovable desde Residuos Agrícolas",
    excerpt:
      "Empresas en Santander están convirtiendo residuos agrícolas en energía renovable, creando un ciclo sostenible que beneficia tanto al medio ambiente como a la economía local.",
    date: "2024-02-28",
    readTime: "6 min",
    category: "Biomasa",
    icon: Leaf,
    image: "hsl(90, 60%, 50%)",
    impact: "Reutilización de 1,200 toneladas de residuos",
  },
  {
    id: 5,
    title: "Smart Grids: Redes Inteligentes para Distribución Eficiente",
    excerpt:
      "La implementación de redes eléctricas inteligentes permite una distribución más eficiente de energía, reduciendo pérdidas y optimizando el consumo en tiempo real.",
    date: "2024-02-20",
    readTime: "5 min",
    category: "Tecnología",
    icon: Zap,
    image: "hsl(217, 91%, 60%)",
    impact: "25% menos de pérdidas en distribución",
  },
  {
    id: 6,
    title: "Hidroeléctricas de Pequeña Escala: Energía Local Sostenible",
    excerpt:
      "Proyectos de mini-hidroeléctricas en ríos de Santander están proporcionando energía limpia a comunidades rurales sin impactar negativamente los ecosistemas acuáticos.",
    date: "2024-02-15",
    readTime: "6 min",
    category: "Hidráulica",
    icon: Wind,
    image: "hsl(190, 70%, 55%)",
    impact: "Energía para 15 comunidades rurales",
  },
];

export const NewsSection = () => {
  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Tecnologías Energéticas
        </h2>
        <p className="text-muted-foreground">
          Noticias y avances en energías renovables para Santander y Norte de Santander
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article, index) => {
          const Icon = article.icon;
          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-border bg-card hover:shadow-[var(--shadow-glow)] transition-all h-full flex flex-col">
                <CardHeader>
                  <div
                    className="w-full h-32 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: article.image }}
                  >
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-[hsl(var(--energy-electric))]/20 text-[hsl(var(--energy-electric))]"
                    >
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-card-foreground text-lg">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--energy-green))]/10 to-[hsl(var(--energy-electric))]/10 border border-[hsl(var(--energy-green))]/20 mb-4">
                      <Leaf className="w-4 h-4 text-[hsl(var(--energy-green))]" />
                      <p className="text-xs text-foreground font-semibold">
                        {article.impact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
