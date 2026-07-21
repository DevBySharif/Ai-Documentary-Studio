/**
 * Data Mapper contract.
 * Translates between a Domain entity and a persistence (storage) record.
 */
export interface DataMapper<TDomain, TRecord> {
  toDomain(record: TRecord): TDomain;
  toRecord(domain: TDomain): TRecord;
}
