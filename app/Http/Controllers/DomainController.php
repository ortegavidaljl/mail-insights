<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Dns\Dns;

class DomainController extends Controller
{
  public function dnsLookup(Request $request)
	{

    $dns = new Dns();

    $nameserver = $request->nameserver ?? null;

    if ($nameserver) {
      $result = $dns->useNameserver($request->nameserver);
    }

    $result = $dns->getRecords($request->name, $request->type);
    
    $recordsArray = [];
    foreach ($result as $record) {
      $recordsArray[] = $record->toArray();
    }

    return response()->json($recordsArray);
	}
}


