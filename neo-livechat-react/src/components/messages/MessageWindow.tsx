import clsx from "clsx"
import { memo } from "react"

type MessageWindowProps = {
	messageData: UserMessage
	isMe: boolean
}

const MessageWindow = ({ messageData, isMe }: MessageWindowProps) => {
	return (
		<div className="flex flex-col">
			<div
				className={clsx(
					"bg-white text-black px-4 py-3 rounded-b-xl border-gray-300 border-[1px] w-2/3",
					{
						"self-end": isMe,
						"rounded-tr-xl": !isMe,
						"rounded-tl-xl": isMe,
					}
				)}
			>
				<div className="flex flex-col items-start px-3 pb-3 gap-2">
					<p className="text-gray-600 text-sm">
						{isMe ? "You" : `User ${messageData.sender_id}`}
					</p>
					<div className="w-full text-wrap break-words">
						<span className="whitespace-pre-wrap">{messageData.content}</span>
					</div>
				</div>
			</div>
			<span
				className={clsx("relative bottom-0 px-4", {
					"self-end": isMe,
				})}
			>
				{new Date(messageData.created_at!).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		</div>
	)
}

export default memo(MessageWindow)
