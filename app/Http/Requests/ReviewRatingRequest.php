<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $ratingFields = [
            'mentorship_style',
            'lab_atmosphere',
            'achievement_activity',
            'constraint_level',
            'facility_quality',
            'work_style',
            'student_balance',
        ];

        $converted = [];

        foreach ($ratingFields as $field) {
            if ($this->has($field) && (int) $this->input($field) === 0) {
                $converted[$field] = null;
            }
        }

        if ($converted !== []) {
            $this->merge($converted);
        }
    }

    public function rules(): array
    {
        return [
            'mentorship_style' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'lab_atmosphere' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'achievement_activity' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'constraint_level' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'facility_quality' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'work_style' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
            'student_balance' => ['bail', 'required', 'integer', 'min:1', 'max:5'],
        ];
    }
}
