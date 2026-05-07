<?php

namespace Tests\Feature\Models;

use App\Models\Lab;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LabTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // scopeWithRatingAverages
    // ---------------------------------------------------------------

    public function test_レビューがない場合はavgがnullでreviewsCountが0(): void
    {
        $lab = Lab::factory()->create();

        $result = Lab::withRatingAverages()->find($lab->id);

        $this->assertNotNull($result);
        $this->assertSame(0, (int) $result->reviews_count);
        $this->assertNull($result->overall_avg);

        foreach (Lab::RATING_COLUMNS as $column) {
            $this->assertNull($result->{"avg_{$column}"}, "avg_{$column} should be null");
        }
    }

    public function test_レビューが1件の場合は各avgがそのレビューの値と一致する(): void
    {
        $lab = Lab::factory()->create();

        $ratings = [
            'mentorship_style'     => 3,
            'lab_atmosphere'       => 4,
            'achievement_activity' => 5,
            'constraint_level'     => 2,
            'facility_quality'     => 1,
            'work_style'           => 3,
            'student_balance'      => 4,
        ];

        Review::factory()->create(array_merge(['lab_id' => $lab->id], $ratings));

        $result = Lab::withRatingAverages()->find($lab->id);

        $this->assertSame(1, (int) $result->reviews_count);

        foreach (Lab::RATING_COLUMNS as $column) {
            $this->assertEquals(
                round($ratings[$column], 3),
                (float) $result->{"avg_{$column}"},
                "avg_{$column} mismatch"
            );
        }

        $expectedOverall = round(array_sum($ratings) / count($ratings), 3);
        $this->assertEquals($expectedOverall, (float) $result->overall_avg);
    }

    public function test_レビューが複数件の場合はavgが正しく計算される(): void
    {
        $lab = Lab::factory()->create();

        Review::factory()->create(array_merge(
            ['lab_id' => $lab->id],
            array_fill_keys(Lab::RATING_COLUMNS, 2)
        ));
        Review::factory()->create(array_merge(
            ['lab_id' => $lab->id],
            array_fill_keys(Lab::RATING_COLUMNS, 4)
        ));

        $result = Lab::withRatingAverages()->find($lab->id);

        $this->assertSame(2, (int) $result->reviews_count);

        foreach (Lab::RATING_COLUMNS as $column) {
            $this->assertEquals(3.0, (float) $result->{"avg_{$column}"}, "avg_{$column} mismatch");
        }

        $this->assertEquals(3.0, (float) $result->overall_avg);
    }

    public function test_他のLabのレビューは集計に含まれない(): void
    {
        $lab1 = Lab::factory()->create();
        $lab2 = Lab::factory()->create();

        Review::factory()->create(array_merge(
            ['lab_id' => $lab2->id],
            array_fill_keys(Lab::RATING_COLUMNS, 5)
        ));

        $result = Lab::withRatingAverages()->find($lab1->id);

        $this->assertSame(0, (int) $result->reviews_count);
        $this->assertNull($result->overall_avg);
    }

    public function test_スコープは複数Labを一括取得できる(): void
    {
        $lab1 = Lab::factory()->create();
        $lab2 = Lab::factory()->create();

        Review::factory()->create(array_merge(
            ['lab_id' => $lab1->id],
            array_fill_keys(Lab::RATING_COLUMNS, 5)
        ));
        // lab2 はレビューなし

        $results = Lab::withRatingAverages()
            ->whereIn('labs.id', [$lab1->id, $lab2->id])
            ->get();

        $this->assertCount(2, $results);

        $r1 = $results->firstWhere('id', $lab1->id);
        $r2 = $results->firstWhere('id', $lab2->id);

        $this->assertSame(1, (int) $r1->reviews_count);
        $this->assertEquals(5.0, (float) $r1->overall_avg);

        $this->assertSame(0, (int) $r2->reviews_count);
        $this->assertNull($r2->overall_avg);
    }
}
