import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from './DashboardContent';

async function getStats() {
  const supabase = await createClient();

  const [projects, services, clients, stats, values, categories] = await Promise.all([
    supabase.from('projects').select('id, is_published', { count: 'exact' }),
    supabase.from('services').select('id, is_published', { count: 'exact' }),
    supabase.from('clients').select('id, is_published', { count: 'exact' }),
    supabase.from('stats').select('id', { count: 'exact' }),
    supabase.from('company_values').select('id', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
  ]);

  // Calculate published counts
  const publishedProjects = projects.data?.filter(p => p.is_published).length || 0;
  const publishedServices = services.data?.filter(s => s.is_published).length || 0;
  const publishedClients = clients.data?.filter(c => c.is_published).length || 0;

  return {
    projects: { total: projects.count || 0, published: publishedProjects },
    services: { total: services.count || 0, published: publishedServices },
    clients: { total: clients.count || 0, published: publishedClients },
    stats: stats.count || 0,
    values: values.count || 0,
    categories: categories.count || 0,
  };
}

async function getDailyRevenue() {
  const supabase = await createClient();

  // Get all projects with revenue and project_date
  const { data: projects } = await supabase
    .from('projects')
    .select('revenue, project_date')
    .order('project_date', { ascending: true });

  if (!projects || projects.length === 0) {
    return [];
  }

  // Group revenue by day using project_date
  const dailyData: Record<string, number> = {};

  projects.forEach((project) => {
    const dateKey = project.project_date; // Already in YYYY-MM-DD format
    dailyData[dateKey] = (dailyData[dateKey] || 0) + (project.revenue || 0);
  });

  // Get sorted dates
  const sortedDates = Object.keys(dailyData).sort();

  // Return last 30 days of data
  const last30Days = sortedDates.slice(-30);

  return last30Days.map((date) => {
    return {
      date,
      revenue: dailyData[date],
    };
  });
}

export default async function AdminDashboard() {
  const [counts, dailyRevenue] = await Promise.all([
    getStats(),
    getDailyRevenue(),
  ]);

  return <DashboardContent counts={counts} dailyRevenue={dailyRevenue} />;
}
