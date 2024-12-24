<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Domain;

class ActivateDomain extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'domain:activate {domain}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Activate the specified domain';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		try {
			$domainName = $this->argument('domain');
			$domain = Domain::where('name', $domainName)->first();

			if (!$domain) {
				$this->error('Dominio "'. $domainName .'" no encontrado');
				return 1;
			}
			
			if ($domain->active) {
				$this->info('El dominio "'. $domainName .'" ya está activo');
				return 0;
			}

			Domain::where('active', 1)->update(['active' => 0]);

			$domain->update(['active' => 1]);

			$this->info('Dominio "'. $domainName .'" activado con éxito');

		} catch (\Exception $e) {
			$this->error('Se produjo un error al activar el dominio: '. $e->getMessage());
			return 1;
		}

		return 0;
	}
}
