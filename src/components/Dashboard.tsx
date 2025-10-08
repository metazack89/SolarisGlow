import { motion } from 'framer-motion';
import { Zap, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const sectorData = [
  { name: 'Empresarial', consumo: 4200, color: 'hsl(217, 91%, 60%)' },
  { name: 'Vivienda', consumo: 3100, color: 'hsl(160, 84%, 39%)' },
  { name: 'Industrial', consumo: 5600, color: 'hsl(45, 100%, 60%)' },
  { name: 'Público', consumo: 2400, color: 'hsl(280, 70%, 55%)' },
];

const monthlyData = [
  { mes: 'Ene', santander: 12000, norte: 8500 },
  { mes: 'Feb', santander: 11500, norte: 8200 },
  { mes: 'Mar', santander: 13200, norte: 9100 },
  { mes: 'Abr', santander: 12800, norte: 8900 },
  { mes: 'May', santander: 14100, norte: 9600 },
  { mes: 'Jun', santander: 13500, norte: 9300 },
];

const metrics = [
  {
    title: 'Consumo Total',
    value: '15,300 kWh',
    change: '+12.5%',
    trend: 'up',
    icon: Zap,
    color: 'from-[hsl(var(--energy-electric))] to-blue-600',
  },
  {
    title: 'Ahorro Mensual',
    value: '2,450 kWh',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingDown,
    color: 'from-[hsl(var(--energy-green))] to-green-600',
  },
  {
    title: 'Eficiencia',
    value: '87.3%',
    change: '+3.1%',
    trend: 'up',
    icon: Activity,
    color: 'from-[hsl(var(--energy-warning))] to-orange-600',
  },
  {
    title: 'Costo Promedio',
    value: '$485/kWh',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-700',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Energético</h2>
        <p className="text-muted-foreground">
          Análisis en tiempo real - Santander y Norte de Santander
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-border bg-card backdrop-blur-sm hover:shadow-[var(--shadow-glow)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                      <h3 className="text-2xl font-bold text-card-foreground">{metric.value}</h3>
                      <p
                        className={`text-sm mt-2 flex items-center gap-1 ${
                          metric.trend === 'up'
                            ? 'text-[hsl(var(--energy-green))]'
                            : 'text-[hsl(var(--energy-warning))]'
                        }`}
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {metric.change}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Consumo por Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="consumo" radius={[8, 8, 0, 0]}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Distribución Sectorial</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="consumo"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Tendencia Mensual - Comparativa Regional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="santander"
                  stroke="hsl(var(--energy-electric))"
                  strokeWidth={3}
                  name="Santander"
                />
                <Line
                  type="monotone"
                  dataKey="norte"
                  stroke="hsl(var(--energy-green))"
                  strokeWidth={3}
                  name="Norte de Santander"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
