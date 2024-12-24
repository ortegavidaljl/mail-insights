<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Account;
use App\Models\Domain;

class CreateAccount extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'account:create {domain?}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Create an account for a given domain. If not specified, the account will be created for the active domain';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		try {
			if (!Domain::exists()) {
				$this->error('No existe ningún dominio; Crea uno antes de añadir una cuenta');
				return 1;
			}

			$domainName = $this->argument('domain');

			if (!$domainName) {
				$domain = Domain::where('active', 1)->first();

				if (!$domain) {
						$this->error('No hay dominios activos; Por favor, especifica un dominio en el comando');
						return 1;
				}

				$domainName = $domain->name;
			}

			$random = vsprintf( '%s-%s', str_split(bin2hex(random_bytes(16)), 4) );
			$newAccount = $random. '@' .$domainName;

			$account = Account::create([
				'name' => $newAccount,
				'domain_id' => $domain->id
			]);

			$this->info('Cuenta "'. $newAccount .'" creada en el dominio "'. $domainName .'" con éxito');
		} catch (\Exception $e) {
			$this->error('Se produjo un error al crear la cuenta: '. $e->getMessage());
			return 1;
		}

		return 0;
	}
}
