const socket = io();

// socket.emit("message", "Привет, мир!", { a: 5 })

import Chat from "./Chat";

const chat = new Chat()

document.body.append(chat.view)

// Повесить на чат обработчик пользовательского события "send".
chat.addEventListener('send', message => {
	message = message.trim()

	if (!message) {
		return
	}

	// Если пользователь ввёл команду установки своего имени:
	if (message.startsWith('/setname')) {
		const split = message.split(' ')
		const name = split[1].slice(0, 10)

		socket.emit('setname', name)
		chat.clearInput()
		return
	}

	socket.emit("message", message)
	chat.clearInput()
})

socket.on('message', data => {
	chat.addMessage(data)
})

// chat.addMessage({
// 	user: 'Сергей Воронин',
// 	date: Date.now(),
// 	content: 'Привет, други!',
// })

// chat.addMessage({
// 	user: 'Татьяна Ошка',
// 	date: Date.now(),
// 	content: 'Всем добрый вечер!',
// })

// chat.addMessage({
// 	user: 'Сергей Воронин',
// 	date: Date.now(),
// 	content: 'Привет, други!',
// })