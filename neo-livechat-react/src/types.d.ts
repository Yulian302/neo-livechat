type WsEvent = "user_message" | "active_users_update" | "messages_history"

interface UserMessage {
	sender_id: number
	content: string
	created_at?: string
}

interface ActiveUsersUpdate {
	active_users: number
}

interface MessagesHistory {
	messages: UserMessage[]
}

interface WsMessageBase<T extends WsEvent> {
	type: T
}

interface UserMessageWs extends WsMessageBase<"user_message"> {
	data: UserMessage
}

interface ActiveUsersUpdateWs extends WsMessageBase<"active_users_update"> {
	data: ActiveUsersUpdate
}

interface MessagesHistoryWs extends WsMessageBase<"messages_history"> {
	data: MessagesHistory
}

type WsMessage = UserMessageWs | ActiveUsersUpdateWs | MessagesHistoryWs
