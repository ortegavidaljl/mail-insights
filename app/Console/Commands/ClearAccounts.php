<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use \App\Models\Account;
use \App\Models\Report;

class ClearAccounts extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'account:clear';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Remove acounts without reports or accounts with old reports';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		// Eliminar cuentas sin reportes creados hace 1 hora
		$this->deleteAccountsWithoutReports();

		// Eliminar cuentas con reportes antiguos (7 días o más)
		$this->deleteAccountsWithOldReports();
	}

	private function deleteAccountsWithoutReports()
	{
		$reportsID = Report::select('account_id')->get();
		$accountsToDelete = Account::whereNotIn('id', $reportsID)->where('created_at', '<', now()->subHours(1))->delete();
	}

	private function deleteAccountsWithOldReports()
	{
		$reportsID = Report::select('account_id')->get();
		$accountsToDelete = Account::whereIn('id', $reportsID)->where('created_at', '<', now()->subDays(7))->delete();
	}
}
