import { RefObject, useEffect, useRef, useState } from "react"

import { BsEmojiSmile } from "react-icons/bs"
import { GrStatusGoodSmall } from "react-icons/gr"
import { TbSend2 } from "react-icons/tb"
import "./App.css"
import MessageWindow from "./components/messages/MessageWindow"
import clsx from "clsx"
import EmojiPicker from "emoji-picker-react"

function App() {
	const MAX_INPUT_CHARS = 500
	const [charCounter, setCharCounter] = useState(0)
	const [username, setUsername] = useState<string>()
	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false)
	const [userId, setUserId] = useState<number>(
		Number(localStorage.getItem("userId"))
	)
	const [message, setMessage] = useState<string>("")
	const [activeUsers, setActiveUsers] = useState<number>()
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [chatMessages, setChatMessages] = useState<UserMessage[]>([])
	const chatWrapperRef = useRef(null)

	useEffect(() => {
		if (!userId) {
			const user_id = Math.floor(Math.random() * (1000000 - 0) + 0)
			setUserId(user_id)
			localStorage.setItem("userId", String(user_id))
		}
		setUsername(`User${userId}`)
		const ws = new WebSocket(`wss://neo-livechat.onrender.com/ws/${userId}`)
		// const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`)
		setSocket(ws)

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data)

			switch (message.type) {
				case "messages_history":
					const userMessages = message.data.messages.map(
						(userMsg: any) => userMsg.data
					)
					setChatMessages(userMessages)
					break
				case "active_users_update":
					setActiveUsers(message.data.active_users)
					break
				case "user_message":
					setChatMessages((prevMessages) => [...prevMessages, message.data])
					break
			}
		}

		return () => {
			ws.close()
		}
	}, [userId])

	useEffect(() => {
		if (chatWrapperRef.current) {
			;(chatWrapperRef as RefObject<HTMLElement>).current!.scrollTop = (
				chatWrapperRef as RefObject<HTMLElement>
			).current!.scrollHeight
		}
	}, [chatMessages])

	const addMyMessage = async (msg: string) => {
		setChatMessages((prevMessages) => [
			...prevMessages,
			{
				sender_id: userId,
				content: msg,
				created_at: new Date().toLocaleString(),
			} as UserMessage,
		])
	}
	const handleSendMessage = (e: any) => {
		e.preventDefault()
		if (socket && socket.readyState === WebSocket.OPEN && message) {
			socket.send(
				JSON.stringify({
					type: "user_message",
					data: {
						sender_id: userId,
						content: message,
					},
				})
			)
			addMyMessage(message)
			setMessage("")
			setCharCounter(0)
		}
	}

	const debounceFunc = (func: Function, interval: number) => {
		let timeout: any // Timeout
		return function (...args: any[]) {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(null, args), interval)
		}
	}
	const handleOnEmojiPanelOpen = debounceFunc(() => {
		setIsEmojiPickerVisible((prev) => !prev)
	}, 200)

	const handleOnEmojiClick = (e: any) => {
		setMessage((prevMsg) => prevMsg + e.emoji)
		setCharCounter((prev) => prev + 1)
	}

	return (
		<div className="flex flex-col justify-start items-center h-screen">
			<div className="text-center">
				<p className="font-bold text-5xl">Live Reactive Chat</p>
				<div className="flex justify-center">
					<div className="flex justify-between items-center gap-2">
						<GrStatusGoodSmall size={15} color="green" />
						<span>Active users: {activeUsers}</span>
					</div>
				</div>
				<p className="text-3xl my-4">
					Welcome, <span className="font-semibold">{username}</span>
				</p>
			</div>
			<div className="w-full flex-1 flex justify-center items-start overflow-y-auto">
				<div className="sm:w-1/2 max-sm:w-full h-full sm:min-w-[600px]">
					<div
						className="h-full bg-default-chat rounded-md p-6 border-gray-500 border-x-2 border-t-2 overflow-y-auto"
						ref={chatWrapperRef}
						id="chatWrapper"
					>
						<div>
							<ul className="flex flex-col gap-4">
								{chatMessages.map((msg: UserMessage, id: number) => (
									<li key={id}>
										<div id="messageWrapper">
											<MessageWindow
												messageData={msg}
												isMe={userId === msg.sender_id}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="sm:w-1/2 max-sm:w-full sm:min-w-[600px]">
				<div
					id="chatInput"
					className="relative bottom-0 flex justify-start items-center h-12 bg-gray-400 rounded-xl"
				>
					<div className="relative inline-block">
						<BsEmojiSmile
							size={25}
							className="mx-4 hover:text-white cursor-pointer"
							onClick={() => {
								handleOnEmojiPanelOpen()
							}}
						/>
						{isEmojiPickerVisible && (
							<div
								id="emojiPicker"
								className="absolute -translate-x-full -translate-y-full"
							>
								<EmojiPicker
									onEmojiClick={(e) => {
										handleOnEmojiClick(e)
									}}
								/>
							</div>
						)}
					</div>
					<form
						onSubmit={handleSendMessage}
						className="flex items-center flex-1"
					>
						<input
							type="text"
							placeholder="Enter message..."
							className="px-2 rounded-xl h-[80%] w-full"
							value={message}
							onChange={(e) => {
								setMessage(e.target.value)
								setCharCounter(Array.from(e.target.value).length)
							}}
							maxLength={MAX_INPUT_CHARS}
						/>
						<span
							className={clsx("px-2", {
								"text-red-700": charCounter === MAX_INPUT_CHARS,
							})}
						>
							{charCounter}/{MAX_INPUT_CHARS}
						</span>
						<button type="submit">
							<TbSend2 size={25} className="mx-2 hover:text-white" />
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default App
