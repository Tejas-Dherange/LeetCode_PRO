/**
 * CSV Export Utilities for Admin Analytics
 */

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  // Use provided headers or extract from first object
  const cols = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = cols.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return cols.map(col => {
      let value = row[col];
      
      // Handle nested objects/arrays
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Convert to string and escape quotes
      value = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file to browser
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export user list to CSV
 */
export const exportUsersToCSV = (users) => {
  const data = users.map(user => ({
    Name: user.name || 'Anonymous',
    Email: user.email,
    Role: user.role,
    'Problems Solved': user.problemsSolved,
    Submissions: user.submissions,
    Subscription: user.subscription,
    'Joined Date': new Date(user.createdAt).toLocaleDateString(),
  }));
  
  const csv = convertToCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `users_export_${timestamp}.csv`);
};

/**
 * Export top users to CSV
 */
export const exportTopUsersToCSV = (topUsers) => {
  const data = topUsers.map((user, idx) => ({
    Rank: idx + 1,
    Name: user.name,
    Email: user.email,
    'Problems Solved': user.problemsSolved,
    Submissions: user.submissions,
    'Success Rate (%)': user.successRate,
    Subscription: user.subscription,
    'Joined Date': new Date(user.createdAt).toLocaleDateString(),
  }));
  
  const csv = convertToCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `top_users_${timestamp}.csv`);
};

/**
 * Export activity timeline to CSV
 */
export const exportActivityToCSV = (timeline) => {
  const data = timeline.map(entry => ({
    Date: entry.date,
    'New Users': entry.newUsers,
    Submissions: entry.submissions,
    'Problems Solved': entry.problemsSolved,
  }));
  
  const csv = convertToCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `activity_timeline_${timestamp}.csv`);
};

/**
 * Export problem stats to CSV
 */
export const exportProblemStatsToCSV = (problemStats) => {
  const data = Object.entries(problemStats.byDifficulty).map(([difficulty, stats]) => ({
    Difficulty: difficulty,
    'Total Problems': stats.total,
    'Solved Problems': stats.solved,
    'Solve Rate (%)': stats.total > 0 
      ? ((stats.solved / stats.total) * 100).toFixed(1)
      : 0,
  }));
  
  const csv = convertToCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `problem_stats_${timestamp}.csv`);
};
