<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Domain;
use App\Http\Resources\DomainResource;
use Spatie\Dns\Dns;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class DomainController extends Controller
{
  public function dnsLookup(Request $request)
	{

    $records = (new Dns)
    ->useNameserver('1.1.1.1')
    ->getRecords($request->name);

    $recordsArray = [];
    foreach ($records as $record) {
      $recordArray = $record->toArray();
      $type = $recordArray['type'];
      if (!isset($recordsArray[$type])) {
          $recordsArray[$type] = [];
      }
      $recordsArray[$type][] = $recordArray;
  }

    return response()->json($recordsArray);
	}
}


