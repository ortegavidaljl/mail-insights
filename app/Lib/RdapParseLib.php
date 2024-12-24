<?php

namespace App\Lib;

use Spatie\Rdap\Responses\DomainResponse;

class RdapParseLib extends DomainResponse
{

	public function getEvents()
	{
		$events = $this->get('events');
		$output= [];

		foreach ($events as $event) {
			$output[ $event['eventAction'] ] = $event['eventDate'];
		}

		return $output;
	}

	public function getNameservers()
	{
		$nameservers = $this->get('nameservers');
		$output= [];

		foreach ($nameservers as $nameserver) {
			$output[] = $nameserver['ldhName'];
		}
		
		return $output;
	}

	public function getSecureDNS()
	{
		$secureDNS = $this->get('secureDNS');

		return $secureDNS['delegationSigned'] ?? false;
	}

	public function getEntities()
	{
		$entities = $this->get('entities');

		if (isset($entities)) {

			foreach ($entities as $entity) {
					$parsed_entity = [];
	
					if (isset($entity['objectClassName']) && $entity['objectClassName'] == 'entity') {
							// Añadir tipo de entidad
							if (isset($entity['roles'])) {
									$parsed_entity['type'] = implode(', ', $entity['roles']);
							}
	
							// Añadir información del vCard
							foreach ($entity['vcardArray'][1] as $vcard) {
									if ($vcard[0] == 'fn') {
											$parsed_entity['name'] = $vcard[3];
									} else if ($vcard[0] == 'adr') {
										$parsed_entity['address'] = $vcard[3];
									}else if ($vcard[0] == 'org') {
										$parsed_entity['org'] = $vcard[3];
									}else if ($vcard[0] == 'tel') {
										$parsed_entity['tel'] = str_replace('tel:', '', $vcard[3]);
									}else if ($vcard[0] == 'email') {
										$parsed_entity['email'] =$vcard[3];
									}
							}
	
							// Añadir identificadores públicos
							if (isset($entity['publicIds'])) {
									foreach ($entity['publicIds'] as $publicId) {
											if ($publicId['type'] == 'IANA Registrar ID') {
													$parsed_entity['IANAID'] = $publicId['identifier'];
											}
									}
							}
	
							// Buscar entidades anidadas
							if (isset($entity['entities'])) {
									foreach ($entity['entities'] as $sub_entity) {
											$sub_parsed_entity = [];
	
											if (isset($sub_entity['roles'])) {
													$sub_parsed_entity['type'] = implode(', ', $sub_entity['roles']);
											}
	
											foreach ($sub_entity['vcardArray'][1] as $vcard) {
													if ($vcard[0] == 'tel') {
															$sub_parsed_entity['tel'] = str_replace('tel:', '', $vcard[3]);
													}
													if ($vcard[0] == 'email') {
															$sub_parsed_entity['email'] = $vcard[3];
													}
											}
	
											$parsed_entities[] = $sub_parsed_entity;
									}
							}
	
							// Agregar la entidad principal al array de entidades parseadas
							// Separar la información del registrador del resto
							if (strpos($parsed_entity['type'], 'registrar') !== false) {
                $registrar_info = $parsed_entity;
							} else {
									$parsed_entities[] = $parsed_entity;
							}
					}
			}
		}

		return $parsed_entities;
	}


}