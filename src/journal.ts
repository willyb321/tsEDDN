export const schema = {
	properties: {
		uploader: {
			type: 'string'
		},
		software: {
			type: 'string'
		},
		timestamp: {
			type: 'string',
			format: 'date-time'
		},
		unixTimestamp: {
			type: 'number'
		},
		event: {
			enum: [
				'Docked',
				'FSDJump',
				'Scan',
				'Location'
			]
		},
		StarSystem: {
			type: 'string',
			minLength: 1,
			description: 'Must be added by the sender if not present in the journal event'
		},
		StarPos: {
			type: 'array',
			items: {
				type: 'number'
			},
			minItems: 3,
			maxItems: 3,
			description: 'Must be added by the sender if not present in the journal event'
		}
	}
};
