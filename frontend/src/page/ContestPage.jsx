import React from 'react';
import 'daisyui';

function ContestCard({ name, date, status, extra, statusColor, animation }) {
  return (
    <div
      className={`card w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-[1.03] ${animation}`}
    >
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-lg sm:text-xl">{name}</h3>
          <span className={`badge badge-lg ${statusColor}`}>{status}</span>
        </div>
        <p className="text-sm text-gray-500">{date}</p>
        {extra && <p className="mt-2 text-green-600 font-semibold">{extra}</p>}
      </div>
    </div>
  );
}

function ContestPage() {
  const today = [
    {
      name: 'LeetCode Weekly #350',
      date: 'Today, 7:00 PM - 9:00 PM',
      status: 'Live',
      extra: 'Live Now',
      statusColor: 'badge-success',
    },
  ];
  const upcoming = [
    {
      name: 'LeetCode Biweekly #100',
      date: 'Tomorrow, 8:00 PM - 10:00 PM',
      status: 'Upcoming',
      statusColor: 'badge-warning',
    },
    {
      name: 'Codeforces Round #900',
      date: 'June 10, 6:00 PM - 8:00 PM',
      status: 'Upcoming',
      statusColor: 'badge-warning',
    },
  ];
  const previous = [
    {
      name: 'LeetCode Weekly #349',
      date: 'June 1, 7:00 PM - 9:00 PM',
      status: 'Past',
      statusColor: 'badge-neutral',
    },
    {
      name: 'Codeforces Round #899',
      date: 'May 28, 6:00 PM - 8:00 PM',
      status: 'Past',
      statusColor: 'badge-neutral',
    },
  ];

  const all = [...today, ...upcoming, ...previous];

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-base-200">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center animate-fade-in">🔥 Programming Contests</h1>

        <Section title="Today's Contests" data={today} />
        <Section title="Upcoming Contests" data={upcoming} />
        <Section title="Previous Contests" data={previous} />

        <section className="mt-12 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4 text-center">📋 All Contests Table</h2>
          <div className="overflow-x-auto bg-base-100 rounded-xl shadow-xl">
            <table className="table w-full text-base">
              <thead>
                <tr className="bg-base-300">
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {all.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.date}</td>
                    <td>
                      <span className={`badge ${c.statusColor}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Fade animation CSS */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out both;
          }
        `}
      </style>
    </div>
  );
}

function Section({ title, data }) {
  return (
    <section className="mb-10 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {data.length ? (
        <div className="space-y-4">
          {data.map((c, i) => (
            <ContestCard key={i} {...c} animation="animate-fade-in" />
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No contests found.</div>
      )}
    </section>
  );
}

export default ContestPage;
