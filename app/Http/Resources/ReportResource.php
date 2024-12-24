<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Report;

class ReportResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{

		$accountId = $this->account_id;

		// Eager load historical data for the same account
		$history = Report::where('account_id', $accountId)
		->select('id', 'created_at')
		->orderBy('created_at', 'desc') // Order by creation date (optional)
		->get();

		return [
			'general' => json_decode($this->general),
			'spamassassin' => json_decode($this->spamassassin),
			'authentication' => json_decode($this->authentication),
			'rbl' => json_decode($this->rbl),
			'history' => $history->toArray()
		];
	}
}
