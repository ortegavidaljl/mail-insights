<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Report;

class AccountResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{

		$id = $this->id;

		// Eager load historical data for the same account
		$report = Report::where('account_id', $id)
		->select('id')
		->orderBy('created_at', 'desc') // Order by creation date (optional)
		->first();

		return [
			'id' => $this->id,
			'name' => $this->name,
			'report' => $report->id ?? null
		];
	}
}
