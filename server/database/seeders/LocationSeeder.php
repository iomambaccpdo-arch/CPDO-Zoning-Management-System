<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('Purok Name per Barangay.json');
        if (!file_exists($jsonPath)) {
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        $currentBarangay = null;

        foreach ($data as $item) {
            $barangayName = trim($item['BARANGAY'] ?? '');
            $purokName = trim($item['PUROK'] ?? '');

            if ($barangayName !== '') {
                $currentBarangay = \App\Models\Barangay::firstOrCreate(['name' => $barangayName]);
            }

            if ($purokName !== '' && $currentBarangay) {
                \App\Models\Purok::create([
                    'barangay_id' => $currentBarangay->id,
                    'name' => $purokName,
                ]);
            }
        }
    }
}
