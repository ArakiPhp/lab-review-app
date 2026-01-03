import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Chart.jsのコンポーネントを登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Show = ({ lab, averagePerItem }) => {
  // 7つの評価指標のラベル
  const labels = [
    "指導スタイル",
    "雰囲気・文化",
    "成果・活動",
    "拘束度",
    "設備",
    "働き方",
    "人数バランス",
  ];

  // LabControllerから渡された平均評価データを配列に変換
  const averageRatings = averagePerItem
    ? [
        averagePerItem.mentorship_style || 0,
        averagePerItem.lab_atmosphere || 0,
        averagePerItem.achievement_activity || 0,
        averagePerItem.constraint_level || 0,
        averagePerItem.facility_quality || 0,
        averagePerItem.work_style || 0,
        averagePerItem.student_balance || 0,
      ]
    : [0, 0, 0, 0, 0, 0, 0];

  // レーダーチャートのデータ
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "全投稿者の平均評価",
        data: averageRatings,
        backgroundColor: "rgba(51, 225, 237, 0.2)",
        borderColor: "rgba(51, 225, 237, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(51, 225, 237, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(51, 225, 237, 1)",
      },
    ],
  };

  // レーダーチャートのオプション
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <AppLayout title={`${lab.faculty.university.name} ${lab.faculty.name} ${lab.name}`}>
      <Head title={`${lab.faculty.university.name} ${lab.faculty.name} ${lab.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-lg">
            <div className="p-6">
              {lab.reviews && lab.reviews.length > 0 ? (
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <Radar data={chartData} options={chartOptions} />
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  まだレビューがありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;