import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ faculty, university }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        url: '',
        professor_url: '',
        gender_ratio_male: 5,
        gender_ratio_female: 5,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('lab.store', faculty.id), {
            onSuccess: () => {
                // 保存成功時の処理（必要に応じて追加）
                console.log('研究室が正常に作成されました');
            },
            onError: (errors) => {
                // エラー時の処理（必要に応じて追加）
                console.log('バリデーションエラー:', errors);
            }
        });
    };

    const handleGenderRatioChange = (type, value) => {
        const numValue = parseInt(value) || 0;
        const clampedValue = Math.max(0, Math.min(10, numValue));
        
        if (type === 'male') {
            setData({
                ...data,
                gender_ratio_male: clampedValue,
                gender_ratio_female: 10 - clampedValue
            });
        } else {
            setData({
                ...data,
                gender_ratio_female: clampedValue,
                gender_ratio_male: 10 - clampedValue
            });
        }
    };

    return (
        <>
            <Head title={`研究室作成 - ${faculty.name} - ${university.name}`} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">研究室作成</h1>
                        <p className="text-gray-600 mt-2">
                            {university.name} / {faculty.name}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                研究室名 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength={50}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                説明
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="研究室の概要や研究内容について説明してください"
                                maxLength={500}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                                研究室URL
                            </label>
                            <input
                                type="url"
                                id="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com"
                                maxLength={255}
                            />
                            {errors.url && (
                                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="professor_url" className="block text-sm font-medium text-gray-700 mb-2">
                                教授URL
                            </label>
                            <input
                                type="url"
                                id="professor_url"
                                value={data.professor_url}
                                onChange={(e) => setData('professor_url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/professor"
                                maxLength={255}
                            />
                            {errors.professor_url && (
                                <p className="text-red-500 text-sm mt-1">{errors.professor_url}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                性別比率 <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="gender_ratio_male" className="block text-sm text-gray-600 mb-1">
                                        男性比率 (0-10)
                                    </label>
                                    <input
                                        type="number"
                                        id="gender_ratio_male"
                                        min="0"
                                        max="10"
                                        value={data.gender_ratio_male}
                                        onChange={(e) => handleGenderRatioChange('male', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender_ratio_female" className="block text-sm text-gray-600 mb-1">
                                        女性比率 (0-10)
                                    </label>
                                    <input
                                        type="number"
                                        id="gender_ratio_female"
                                        min="0"
                                        max="10"
                                        value={data.gender_ratio_female}
                                        onChange={(e) => handleGenderRatioChange('female', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    合計: {data.gender_ratio_male + data.gender_ratio_female} / 10
                                </p>
                                {(data.gender_ratio_male + data.gender_ratio_female) !== 10 && (
                                    <p className="text-orange-500 text-sm">
                                        注意: 男女比の合計は10である必要があります
                                    </p>
                                )}
                            </div>
                            {errors.gender_ratio_male && (
                                <p className="text-red-500 text-sm mt-1">{errors.gender_ratio_male}</p>
                            )}
                            {errors.gender_ratio_female && (
                                <p className="text-red-500 text-sm mt-1">{errors.gender_ratio_female}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing || (data.gender_ratio_male + data.gender_ratio_female) !== 10}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? '作成中...' : '研究室を作成'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}