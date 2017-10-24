/**
* This file was automatically generated by json-schema-to-typescript.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run json-schema-to-typescript to regenerate this file.
*/

/**
 * Note: A value of "" indicates that the commodity is not normally sold/purchased at this station, but is currently temporarily for sale/purchase
 */
export type LevelType = (0 | 1 | 2 | 3 | '');

export interface CommoditySchema {
	$schemaRef: string;
	header: {
		uploaderID: string;
		softwareName: string;
		softwareVersion: string;
		/**
	   * Timestamp upon receipt at the gateway. If present, this property will be overwritten by the gateway; submitters are not intended to populate this property.
	   */
		gatewayTimestamp?: string;
		[k: string]: any;
	};
	message: {
		systemName: string;
		stationName: string;
		timestamp: string;
		/**
	   * Commodities returned by the Companion API, with illegal commodities omitted
	   */
		commodities: {
			/**
	   * Symbolic name as returned by the Companion API
	   */
			name: string;
			meanPrice: number;
			/**
	   * Price to buy from the market
	   */
			buyPrice: number;
			stock: number;
			stockBracket: LevelType;
			/**
	   * Price to sell to the market
	   */
			sellPrice: number;
			demand: number;
			demandBracket: LevelType;
			statusFlags?: string[];
		}[];
		economies?: {
			/**
	   * Economy type as returned by the Companion API
	   */
			name: string;
			proportion: number;
		}[];
		prohibited?: string[];
	};
}