import { Card } from "../../components/ui";

/**
 * QuickStats Component
 *
 * Displays 4 key metrics: Overall Progress, Budget Status, Vendors, Tasks
 */
export default function QuickStats({ data }) {
  // Calculate statistics
  const budgetTotal = data.totalBudget || 0;
  const budgetAllocated = Object.values(data.budgetCategories || {}).reduce(
    (sum, cat) => sum + (cat.amount || 0),
    0
  );
  const budgetRemaining = budgetTotal - budgetAllocated;
  const budgetCompletion =
    budgetTotal > 0 ? (budgetAllocated / budgetTotal) * 100 : 0;

  const totalVendors = data.vendorList?.length || 0;
  const bookedVendors =
    data.vendorList?.filter((v) => v.status === "Booked").length || 0;
  const vendorCompletion =
    totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0;

  const totalTasks = data.taskList?.length || 0;
  const completedTasks =
    data.taskList?.filter((t) => t.status === "Completed").length || 0;
  const taskCompletion =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const today = new Date();
  const overdueTasks =
    data.taskList?.filter((task) => {
      if (task.status === "Completed" || !task.dueDate) return false;
      return new Date(task.dueDate) < today;
    }).length || 0;

  const overallProgress = Math.round(
    (budgetCompletion + vendorCompletion + taskCompletion) / 3
  );

  const stats = [
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      icon: "🎯",
      color: "#CE805C",
      showProgress: true,
      progress: overallProgress,
    },
    {
      title: "Budget Status",
      value:
        budgetTotal > 0
          ? new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
            }).format(budgetRemaining)
          : "Not set",
      subtitle:
        budgetTotal > 0
          ? `${Math.round(budgetCompletion)}% allocated`
          : "Set your budget",
      icon: "💰",
    },
    {
      title: "Vendors",
      value: `${bookedVendors}/${totalVendors}`,
      subtitle:
        totalVendors > 0
          ? `${Math.round(vendorCompletion)}% booked`
          : "No vendors yet",
      icon: "🏪",
    },
    {
      title: "Tasks",
      value: `${completedTasks}/${totalTasks}`,
      subtitle:
        overdueTasks > 0 ? (
          <span className="text-red-600 font-medium">
            {overdueTasks} overdue
          </span>
        ) : totalTasks > 0 ? (
          `${Math.round(taskCompletion)}% complete`
        ) : (
          "No tasks yet"
        ),
      icon: "✅",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {stat.title}
            </h3>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          {stat.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.subtitle}
            </p>
          )}
          {stat.showProgress && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${stat.progress}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
