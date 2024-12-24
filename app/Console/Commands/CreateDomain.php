<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Domain;

class CreateDomain extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'domain:create {domain}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Create a domain';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		try {
			$domainName = $this->argument('domain');
			$isFirstDomain = Domain::count() === 0;

			$domain = Domain::create(['name' => $domainName, 'active' => $isFirstDomain]);

			$state = $isFirstDomain ? '(activo)' : '(inactivo)';

			$this->info('Dominio "'. $domainName .'" creado con éxito '. $state);
		} catch (\Exception $e) {
			$this->error('Se produjo un error al crear el dominio: '. $e->getMessage());
			return 1;
		}

		return 0;
	}
}
