<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Report;
use App\Models\Domain;
use App\Http\Resources\AccountCollection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Lib\CheckEmail;

class AccountController extends Controller
{

	public function index(Request $request)
	{
    /*$accounts = Account::with('report')->get();

    $accountCollection = $accounts->map(function ($account) {
      return [
        'id' => $account->id,
        'report_id' => $account->report ? $account->report->id : null,
      ];
    });*/
    //return Account::all();
    return AccountCollection::make(Account::all());
		//return Account::all();
	}

	public function store(Request $request)
	{
		try {
			$domain = Domain::where('active', 1)->firstOrFail();

			$randomUsername = vsprintf( '%s-%s', str_split(bin2hex(random_bytes(16)), 4) );
			$newAccount = $randomUsername . '@' . $domain->name;

			$account = Account::create([
					'name' => $newAccount,
					'domain_id' => $domain->id,
				]);

			return response()->json(['account' => $newAccount]);
		} catch (ModelNotFoundException $e) {
			// No existen dominios activos
			return response()->json(['message' => $e->getMessage()], 404);
    } catch (\Exception $e) {
			// Handle other general exceptions
			return response()->json(['message' => 'Se produjo un error al crear la cuenta: ' . $e->getMessage()], 500);
    }
	}

	public function check_existence(Request $request)
	{
		try {
			if (filter_var($request->name, FILTER_VALIDATE_EMAIL) === false) {
				echo "Formato de correo electrónico inválido";
				return; // Detener la ejecución del script
			}
		
			// Sanitizar la dirección de correo electrónico
			$emailSanitizado = filter_var($request->name, FILTER_SANITIZE_EMAIL);
			$emailSanitizado = htmlspecialchars($emailSanitizado);
		
		
			$lele = new CheckEmail();

			$lolo = $lele->verify($emailSanitizado);
		
			return response()->json($lolo);

		} catch (ModelNotFoundException $e) {
			// No existen dominios activos
			return response()->json(['message' => $e->getMessage()], 404);
    } catch (\Exception $e) {
			// Handle other general exceptions
			return response()->json(['message' => 'Se produjo un error al comprobar el reporte: ' . $e->getMessage()], 500);
    }
	}

	public function check(Request $request)
	{
		try {
			$account = Account::where('name', $request->name)->firstOrFail();

			$latestReportId = Report::where('account_id', $account->id)->orderBy('created_at', 'desc')->first()?->id;

			if (!$latestReportId) {
				return response()->json([], 204);
			}

			return response()->json(['report' => $latestReportId]);
		} catch (ModelNotFoundException $e) {
			// No existen dominios activos
			return response()->json(['message' => $e->getMessage()], 404);
    } catch (\Exception $e) {
			// Handle other general exceptions
			return response()->json(['message' => 'Se produjo un error al comprobar el reporte: ' . $e->getMessage()], 500);
    }
	}

  public function destroy(Request $request)
	{
		try {
			$account = Account::findOrFail($request->id);

			$account->delete();

			//return response()->json(['account' => $newAccount]);
		} catch (ModelNotFoundException $e) {
			// No existen dominios activos
			return response()->json(['message' => $e->getMessage()], 404);
    } catch (\Exception $e) {
			// Handle other general exceptions
			return response()->json(['message' => 'Se produjo un error al eliminar la cuenta: ' . $e->getMessage()], 500);
    }
	}


}
