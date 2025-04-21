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

// Response types include system fields and match responses from the PocketBase API

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
