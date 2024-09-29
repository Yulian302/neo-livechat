import {
	HtmlHTMLAttributes,
	RefObject,
	useEffect,
	useRef,
	useState,
} from "react"

import { BsEmojiSmile } from "react-icons/bs"
import { GrStatusGoodSmall } from "react-icons/gr"
import { TbSend2 } from "react-icons/tb"
import "./App.css"
import MessageWindow from "./components/messages/MessageWindow"

function App() {
	const [username, setUsername] = useState("")
	const [userId, setUserId] = useState<number>()
	const [message, setMessage] = useState<string>("")
	const [activeUsers, setActiveUsers] = useState<number>()
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [chatMessages, setChatMessages] = useState<UserMessage[]>([])
	const chatWrapperRef = useRef(null)

	useEffect(() => {
		const user_id = Math.floor(Math.random() * (1000000 - 0) + 0)
		setUserId(user_id)
		setUsername(`User${user_id}`)
		// const ws = new WebSocket(`ws://localhost:8000/ws/${user_id}`)
		const ws = new WebSocket(`wss://neo-livechat.onrender.com/ws/${user_id}`)
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
	}, [])

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
		}
	}
	return (
		<div className="flex flex-col justify-around h-screen gap-4">
			<div className="text-center">
				<p className="font-bold text-5xl">Live Reactive Chat</p>
				<div className="flex justify-center">
					<div className="flex justify-between items-center gap-2">
						<GrStatusGoodSmall size={15} color="green" />
						<span>Active users: {activeUsers}</span>
					</div>
				</div>
				<p className="text-3xl mt-4">
					Welcome, <span className="font-semibold">{username}</span>
				</p>
			</div>
			<div className="flex-1 flex justify-center items-start overflow-y-auto">
				<div className="w-1/2 h-full min-w-[600px]">
					<div
						className="h-full bg-default-chat rounded-md p-6 border-gray-500 border-x-2 border-t-2 overflow-y-auto"
						ref={chatWrapperRef}
						id="chatWrapper"
					>
						<div>
							<ul className="flex flex-col gap-4">
								{chatMessages.map((msg: UserMessage, id: number) => (
									<li key={id}>
										<MessageWindow messageData={msg} user_id={userId!} />
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="relative bottom-0 flex justify-start items-center h-12 w-full bg-gray-400 rounded-xl">
						<BsEmojiSmile size={25} className="mx-4" />
						<form
							onSubmit={handleSendMessage}
							className="flex items-center flex-1"
						>
							<input
								type="text"
								placeholder="Send"
								className="px-2 rounded-xl h-[80%] w-full"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<button type="submit">
								<TbSend2 size={25} className="mx-4" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
