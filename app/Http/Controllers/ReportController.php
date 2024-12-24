<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Http\Resources\ReportResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReportController extends Controller
{
    public function show(Request $request)
	{
		try {
			return new ReportResource(Report::findOrFail($request->id));
		} catch (ModelNotFoundException $e) {
			// No existen dominios activos
			return response()->json(['message' => 'No se ha encontrado ningún elemento.'], 404);
    } catch (\Exception $e) {
			// Handle other general exceptions
			return response()->json(['message' => 'Se produjo un error al obtener el reporte: ' . $e->getMessage()], 500);
    }
	}
}
