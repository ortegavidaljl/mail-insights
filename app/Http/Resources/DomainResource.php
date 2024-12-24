<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DomainResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		
		return [
			'status' => $this->get('status'),
			'events' => $this->getEvents(),
			//'registrar' => $registrar_info ?? null,
			'entities' => $this->getEntities(),
			'secureDNS' => $this->getSecureDNS(),
			'nameservers' => $this->getNameservers()
		];

	}
}
