<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Domain;

class RemoveDomain extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'domain:remove {domain}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Remove the specified domain';

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
				$this->error('El Dominio "'. $domainName .'" está activo; No se puede eliminar');
				return 1;
			}

			$isOnlyDomain = Domain::count() === 1;

			if ($isOnlyDomain) {
				$this->error('El Dominio "'. $domainName .'" es el único existente; No se puede eliminar');
				return 1;
			}

			$domain->delete();

			$this->info('Dominio "'. $domainName .'" eliminado con éxito');

		} catch (\Exception $e) {
			$this->error('Se produjo un error al eliminar el dominio: '. $e->getMessage());
			return 1;
		}

		return 0;
	}
}
