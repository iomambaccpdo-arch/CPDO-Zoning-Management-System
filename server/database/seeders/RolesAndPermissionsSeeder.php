<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Create Permissions
        $permissions = [
            'view.dashboard',
            'view.files',
            'create.files',
            'update.files',
            'delete.files',
            'view.accounts',
            'create.accounts',
            'update.accounts',
            'delete.accounts',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Create Roles
        $coordinator = Role::firstOrCreate(['code' => 1], ['name' => 'Coordinator']);
        $zoningOfficer = Role::firstOrCreate(['code' => 2], ['name' => 'Zoning Officer']);
        $zoningInspector = Role::firstOrCreate(['code' => 3], ['name' => 'Zoning Inspector']);

        // Assign Permissions to Roles
        $coordinator->permissions()->sync(Permission::whereIn('name', [
            'view.dashboard', 'view.files', 'create.files', 'update.files', 'delete.files',
            'view.accounts', 'create.accounts', 'update.accounts', 'delete.accounts'
        ])->pluck('id'));

        $zoningOfficer->permissions()->sync(Permission::whereIn('name', [
            'view.dashboard', 'view.files', 'create.files'
        ])->pluck('id'));

        $zoningInspector->permissions()->sync(Permission::whereIn('name', [
            'view.dashboard', 'view.files'
        ])->pluck('id'));

        // Seed Users
        $coordinatorUser = User::firstOrCreate([
            'email' => 'joseph@example.com'
        ], [
            'name' => 'Joseph Raymund',
            'password' => Hash::make('123456789')
        ]);
        $coordinatorUser->roles()->sync([$coordinator->id]);

        $officerUser = User::firstOrCreate([
            'email' => 'officer@example.com'
        ], [
            'name' => 'Zoning Officer',
            'password' => Hash::make('123456789')
        ]);
        $officerUser->roles()->sync([$zoningOfficer->id]);

        $inspectorUser = User::firstOrCreate([
            'email' => 'ivann@example.com'
        ], [
            'name' => 'Ivann Omambac',
            'password' => Hash::make('123456789')
        ]);
        $inspectorUser->roles()->sync([$zoningInspector->id]);
    }
}
