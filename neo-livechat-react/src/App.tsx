import { useEffect, useState } from "react"

import { BsEmojiSmile } from "react-icons/bs"
import { TbSend2 } from "react-icons/tb"
import "./App.css"
interface Message {
	username: string
	message: string
}

function App() {
	const [username, setUsername] = useState("")
	const [message, setMessage] = useState<string>("")
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [chatMessages, setChatMessages] = useState<Message[]>([])

	useEffect(() => {
		const user_id = Math.floor(Math.random() * (1000000 - 0) + 0)
		// const ws = new WebSocket(`ws://localhost:8000/ws/${user_id}`)
		const ws = new WebSocket(`wss://neo-livechat.onrender.com/ws/${user_id}`)
		setSocket(ws)

		ws.onmessage = (event) => {
			setChatMessages((prevMessages) => [
				...prevMessages,
				JSON.parse(event.data),
			])
		}
		return () => {
			ws.close()
		}
	}, [])

	const addMyMessage = (msg: Message) => {
		setChatMessages((prevMsgs) => [...prevMsgs, msg])
	}
	const handleSendMessage = (e: any) => {
		e.preventDefault()
		if (socket && socket.readyState === WebSocket.OPEN && message) {
			socket.send(
				JSON.stringify({
					username: username || "Anonymous",
					message: message,
				})
			)
			addMyMessage({ username: "You", message: message })
			setMessage("")
		}
	}
	return (
		<div>
			<div className="text-center">
				<p className="font-bold text-5xl my-4">One-Time Reactive Chat</p>
				<span className="text-gray-500 font-semibold text-sm">
					Don't reload the page
				</span>
			</div>
			<div className="flex justify-center items-start m-8">
				<div className="w-1/2 h-screen">
					<div
						className="bg-default-chat h-screen rounded-md p-6"
						id="chatWrapper"
					>
						Hello, this is chat
						<div>
							<p>Messages:</p>
							<ul>
								{chatMessages.map((msg: Message, id: number) => (
									<li key={id}>
										{msg.username} : {msg.message}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex justify-start items-center relative bottom-0 h-12 w-full bg-gray-400 rounded-xl mb-8">
						<BsEmojiSmile size={25} className="mx-4" />
						<form onSubmit={handleSendMessage}>
							<input
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<input
								type="text"
								placeholder="Send"
								className="px-2 rounded-xl h-[80%]"
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
