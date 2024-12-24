<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Report;

class AccountCollection extends ResourceCollection
{
	public static $wrap = null;
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		/*$id = $this->id;

		// Eager load historical data for the same account
		$report = Report::where('account_id', $id)
		->select('created_at')
		->orderBy('created_at', 'desc') // Order by creation date (optional)
		->first();*/

		return [ 'data' => $this->collection ];
	}
}
