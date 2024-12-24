<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Domain;
use Spatie\Rdap\Facades\Rdap;
use App\Http\Resources\DomainResource;
use Spatie\Dns\Dns;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

use App\Lib\RdapParseLib;

class DomainController extends Controller
{
	public function rdapLookup(Request $request)
	{
    if (! Rdap::domainIsSupported($request->name)) {
      return response()->json(['data' => "domain:notValid"], 400);
    }

    $domain = Rdap::domain($request->name);

    $url = $domain->get('links.1.value');

    try {
      $response = Http::timeout(5)
          ->retry(times: 3, sleepMilliseconds: 1000)
          ->get($url)
          ->json();
    } catch (RequestException $exception) {
        if ($exception->getCode() === 404) {
          return null;
        }

        throw $exception;
    } catch (ConnectionException $exception) {
      return response()->json(['data' => $exception], 500);
    }

    $parsedRdap = new RdapParseLib($response);

    //return $parsedRdap->all();

    return new DomainResource($parsedRdap);
    //return new DomainResource(Rdap::domain($request->name)->all());
	}

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


