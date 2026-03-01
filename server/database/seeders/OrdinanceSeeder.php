<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdinanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('Zoning Ordinance.json');
        if (!file_exists($jsonPath)) {
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        $currentZoning = null;

        foreach ($data as $item) {
            $zoningName = trim($item['ZONING'] ?? '');
            $projectTypeName = trim($item['Type of Project'] ?? '');

            if ($zoningName !== '') {
                $currentZoning = \App\Models\Zoning::firstOrCreate(['name' => $zoningName]);
            }

            if ($projectTypeName !== '' && $currentZoning) {
                \App\Models\ProjectType::create([
                    'zoning_id' => $currentZoning->id,
                    'name' => $projectTypeName,
                ]);
            }
        }
    }
}
