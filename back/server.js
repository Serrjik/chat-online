const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session')
const path = require('path')

// const port = process.env.NODE_ENV === 'production' ? 80 : 3000
// const port = 3000
const port = 80

/*
Последние сообщения, которые увидит пользователь,
только присоединившийся к чату.
*/
let messages = []

// Use the session middleware
const sessionMiddleware = session({
	secret: 'keyboard cat',
	cookie: { maxAge: 99999999 }
});

let idCounter = 0

app.use(sessionMiddleware)

app.use((req, res, next) => {
	if (!req.session.userId) {
		req.session.userId = idCounter++
		// Имя пользователя.
		req.session.userName = `User${req.session.userId}`
		req.session.first = true
		req.session.save()
	}

	next()
})

app.use(express.static(path.join(__dirname, '../front')))

// Access the session as req.session
// app.get('/', function (req, res, next) {
// 	if (!req.session.userId) {
// 		req.session.userId = idCounter++
// 		// Имя пользователя.
// 		req.session.userName = `User${req.session.userId}`
// 		req.session.save()
// 	}

// 	next()
// })

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
})

io.on('connection', (socket) => {
	const { session } = socket.request

	// Если есть сообщения, которые нужно показать:
	if (messages.length) {
		// Отправить их клиенту!
		for (const message of messages) {
			socket.emit('message', message)
		}
	}

	// Если пользователь зашёл в чат первый раз:
	if (session.first) {
		socket.emit('message', {
			user: 'SERVER',
			date: Date.now(),
			content: `Добро пожаловать в чат, ${session.userName}`,
		})

		session.first = false
		session.save()
	}

	// Если пользователь зашёл в чат НЕ первый раз:
	else {
		socket.emit('message', {
			user: 'SERVER',
			date: Date.now(),
			content:
				`Как же хорошо, что вы, ${session.userName}, к нам вернулись!`,
		})
	}

	socket.on('message', content => {
		const message = {
			user: session.userName,
			date: Date.now(),
			content,
		}

		io.emit('message', message)

		messages.push(message)

		// Оставим только последние 15 сообщений:
		if (messages.length > 15) {
			messages = messages.slice(-15)
		}
	})

	// Обработка события установки имени пользователя.
	socket.on('setname', name => {
		session.userName = name
		session.save()
	})

	// console.log('a user connected');
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});