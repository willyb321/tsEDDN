import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export interface JournalSchema {
	eddnSchema: string;
	StarSystem: string;
	StationName: string;
	uploader: string;
	header: {
		unixTimestamp: string;
		uploaderID: string;
		softwareName: string;
		softwareVersion: string;
		/**
	   * Timestamp upon receipt at the gateway. If present, this property will be overwritten by the gateway; submitters are not intended to populate this property.
	   */
		gatewayTimestamp?: string;
		[k: string]: any;
	};
	/**
	 * Contains all properties from the listed events in the client's journal minus Localised strings and the properties marked below as 'disallowed'
	 */
	message: {
		timestamp: string;
		event: ('Docked' | 'FSDJump' | 'Scan' | 'Location');
		/**
	   * Must be added by the sender if not present in the journal event
	   */
		StarSystem: string;
		/**
	   * Must be added by the sender if not present in the journal event
	   */
		StarPos: number[];
		CockpitBreach?: Disallowed;
		BoostUsed?: Disallowed;
		FuelLevel?: Disallowed;
		FuelUsed?: Disallowed;
		JumpDist?: Disallowed;
		Latitude?: Disallowed;
		Longitude?: Disallowed;
		[k: string]: any;
	};
}
export interface Disallowed {
	[k: string]: any;
}

export const journalSchema = new mongoose.Schema({
	eddnSchema: String,
	type: Object,
	$schemaRef: String,
	uploader:String,
	StarSystem: String,
	StationName: String,
	header: {
		unixTimestamp: Number,
		uploaderID: String,
		softwareName: String,
		softwareVersion: String,
		gatewayTimestamp: String
	},
	message: Object
});
journalSchema.plugin(mongoosePaginate);
export const journalModel: any = mongoose.model('JournalModel', journalSchema);
