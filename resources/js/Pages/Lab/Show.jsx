import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import StarRating from "@/Components/Lab/Star/StarRating";
import { formatRating } from "@/utils/formatRating";
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

const Show = ({ lab, averagePerItem, overallAverage }) => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 左側: レーダーチャート */}
                <div className="flex justify-center items-start">
                  {lab.reviews && lab.reviews.length > 0 ? (
                    <div className="w-full max-w-sm">
                      <Radar data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      まだレビューがありません
                    </p>
                  )}
                </div>

                {/* 右側: 総合評価と研究室概要 */}
                <div>
                  {/* 総合評価 */}
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">
                      総合評価({lab.reviews?.length || 0})
                    </h2>
                    {lab.reviews && lab.reviews.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <StarRating rating={overallAverage || 0} />
                        <span className="text-sm text-[#F4BB42]">
                          {formatRating(overallAverage, "0.00")}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">まだ評価がありません</p>
                    )}
                  </div>

                  {/* 研究室概要 */}
                  <h2 className="text-base font-semibold text-gray-800 mb-2">
                    研究室概要
                  </h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-tight">
                    {lab.description || "概要はまだ登録されていません"}
                  </p>

                  {/* 研究室ページ */}
                  <div className="mt-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">
                      研究室ページ
                    </h2>
                    {lab.url ? (
                      <a
                        href={lab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        {lab.url}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">URLはまだ登録されていません</p>
                    )}
                  </div>

                  {/* 教授 */}
                  <div className="mt-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">
                      教授  
                    </h2>
                    <p className="text-sm text-gray-600">
                      {lab.professor_name ? `${lab.professor_name} 先生` : "教授名はまだ登録されていません"}
                    </p>
                  </div>

                  {/* 男女比 */}
                  <div className="mt-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">
                      男女比{(lab.gender_ratio_male != null && lab.gender_ratio_female != null) && `(${lab.gender_ratio_male}:${lab.gender_ratio_female})`}
                    </h2>
                    {(lab.gender_ratio_male != null && lab.gender_ratio_female != null) ? (
                      <div className="flex w-full h-6 rounded overflow-hidden text-sm text-white font-medium">
                        {lab.gender_ratio_male > 0 && (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              backgroundColor: "#7BB3CE",
                              width: `${(lab.gender_ratio_male / (lab.gender_ratio_male + lab.gender_ratio_female)) * 100}%`,
                            }}
                          >
                            男
                          </div>
                        )}
                        {lab.gender_ratio_female > 0 && (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              backgroundColor: "#E89EB9",
                              width: `${(lab.gender_ratio_female / (lab.gender_ratio_male + lab.gender_ratio_female)) * 100}%`,
                            }}
                          >
                            女
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">男女比はまだ登録されていません</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;