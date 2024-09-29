import { memo } from "react"

type MessageWindowProps = {
	messageData: UserMessage
	user_id: number
}

const MessageWindow = ({ messageData, user_id }: MessageWindowProps) => {
	return (
		<div className="bg-white text-black px-4 py-3 rounded-tr-xl rounded-b-xl border border-gray-200 w-2/3">
			<div className="flex flex-col items-start px-3 pb-3 gap-2">
				<p className="text-gray-600 text-sm">
					{messageData.sender_id === user_id
						? "You"
						: `User ${messageData.sender_id}`}
				</p>
				<div className="w-full text-wrap break-words">
					<span className="whitespace-pre-wrap">{messageData.content}</span>
				</div>
			</div>
		</div>
	)
}

export default memo(MessageWindow)
