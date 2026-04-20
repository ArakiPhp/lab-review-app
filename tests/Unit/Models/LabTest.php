<?php

namespace Tests\Unit\Models;

use App\Models\Lab;
use App\Models\Review;
use PHPUnit\Framework\TestCase;

class LabTest extends TestCase
{
    // --- getAveragePerItem ---

    public function test_各評価項目の平均値を正しく計算できる(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([
            new Review([
                'mentorship_style' => 3,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]),
            new Review([
                'mentorship_style' => 5,
                'lab_atmosphere' => 2,
                'achievement_activity' => 3,
                'constraint_level' => 4,
                'facility_quality' => 2,
                'work_style' => 5,
                'student_balance' => 2,
            ]),
        ]));

        // Act
        $result = $lab->getAveragePerItem();

        // Assert
        $this->assertEquals(4.0, $result['mentorship_style']);
        $this->assertEquals(3.0, $result['lab_atmosphere']);
        $this->assertEquals(4.0, $result['achievement_activity']);
        $this->assertEquals(3.0, $result['constraint_level']);
        $this->assertEquals(3.0, $result['facility_quality']);
        $this->assertEquals(4.0, $result['work_style']);
        $this->assertEquals(3.0, $result['student_balance']);
    }

    public function test_レビューが1件の場合はその値がそのまま返る(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([
            new Review([
                'mentorship_style' => 3,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]),
        ]));

        // Act
        $result = $lab->getAveragePerItem();

        // Assert
        $this->assertEquals(3.0, $result['mentorship_style']);
        $this->assertEquals(4.0, $result['lab_atmosphere']);
        $this->assertEquals(5.0, $result['achievement_activity']);
        $this->assertEquals(2.0, $result['constraint_level']);
        $this->assertEquals(4.0, $result['facility_quality']);
        $this->assertEquals(3.0, $result['work_style']);
        $this->assertEquals(4.0, $result['student_balance']);
    }

    public function test_レビューが0件の場合はnullが返る(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([]));

        // Act
        $result = $lab->getAveragePerItem();

        // Assert
        foreach (Lab::RATING_COLUMNS as $column) {
            $this->assertNull($result[$column]);
        }
    }

    // --- getOverallAverage ---

    public function test_全項目の総合平均値を正しく計算できる(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([
            new Review([
                'mentorship_style' => 2,
                'lab_atmosphere' => 3,
                'achievement_activity' => 5,
                'constraint_level' => 4,
                'facility_quality' => 5,
                'work_style' => 5,
                'student_balance' => 4,
            ]),
            new Review([
                'mentorship_style' => 5,
                'lab_atmosphere' => 4,
                'achievement_activity' => 3,
                'constraint_level' => 5,
                'facility_quality' => 3,
                'work_style' => 4,
                'student_balance' => 4,
            ]),
        ]));

        // Act
        $result = $lab->getOverallAverage();

        // Assert
        // 各項目平均: 3.5, 3.5, 4.0, 4.5, 4.0, 4.5, 4.0 → 総合平均 = 4.0
        $this->assertEquals(4.0, $result);
    }

    public function test_レビューが0件の場合の総合平均はnullが返る(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([]));

        // Act
        $result = $lab->getOverallAverage();

        // Assert
        $this->assertNull($result);
    }

    // --- getUserReviewAverage ---

    public function test_特定レビューの全項目平均を正しく計算できる(): void
    {
        // Arrange
        $review = new Review([
            'mentorship_style' => 3,
            'lab_atmosphere' => 4,
            'achievement_activity' => 5,
            'constraint_level' => 2,
            'facility_quality' => 4,
            'work_style' => 3,
            'student_balance' => 4,
        ]);

        // Act
        $result = Lab::getUserReviewAverage($review);

        // Assert
        // (3+4+5+2+4+3+4) / 7 ≒ 3.571...
        $this->assertEquals(3.571, $result);
    }

    // --- appendRatingAverages ---

    public function test_動的属性が正しくセットされる(): void
    {
        // Arrange
        $lab = new Lab();
        $lab->setRelation('reviews', collect([
            new Review([
                'mentorship_style' => 3,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]),
            new Review([
                'mentorship_style' => 5,
                'lab_atmosphere' => 2,
                'achievement_activity' => 3,
                'constraint_level' => 4,
                'facility_quality' => 2,
                'work_style' => 5,
                'student_balance' => 2,
            ]),
        ]));

        // Act
        $result = $lab->appendRatingAverages();

        // Assert
        // 各項目平均: 4.0, 3.0, 4.0, 3.0, 3.0, 4.0, 3.0 → 総合平均 ≒ 3.429
        $this->assertEquals(3.429, $result->overall_avg);
        $this->assertEquals(4.0, $result->avg_mentorship_style);
        $this->assertEquals(3.0, $result->avg_lab_atmosphere);
        $this->assertEquals(4.0, $result->avg_achievement_activity);
        $this->assertEquals(3.0, $result->avg_constraint_level);
        $this->assertEquals(3.0, $result->avg_facility_quality);
        $this->assertEquals(4.0, $result->avg_work_style);
        $this->assertEquals(3.0, $result->avg_student_balance);
        $this->assertEquals(2, $result->reviews_count);
    }
}
