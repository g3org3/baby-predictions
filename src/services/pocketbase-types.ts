/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Babypredictions = "babypredictions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum BabypredictionsGeneroOptions {
	"boy" = "boy",
	"girl" = "girl",
}
export type BabypredictionsRecord<Tip = unknown> = {
	codigo?: string
	due_date?: string
	genero?: BabypredictionsGeneroOptions
	ip?: null | Tip
	name?: string
	peso_lbs?: string
	phone?: string
	tag?: string
}

export type UsersRecord = {
	avatar?: string
	img?: string
	isAdmin?: boolean
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type BabypredictionsResponse<Tip = unknown, Texpand = unknown> = Required<BabypredictionsRecord<Tip>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	babypredictions: BabypredictionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	babypredictions: BabypredictionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'babypredictions'): RecordService<BabypredictionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
