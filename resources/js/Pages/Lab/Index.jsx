import React from 'react';
import { Head } from '@inertiajs/react';

export default function Index({ labs }) {
  return (
    <div>
      <h1>研究室一覧</h1>

      <div>
        {labs.map((lab) => (
          <div
            key={lab.id}
          >
            <p>{lab.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
