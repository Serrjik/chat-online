import Message from "./Message";
import EventEmitter from "./EventEmitter";

export default class Chat extends EventEmitter {
	constructor () {
		super()

		// История переписки.
		this.messages = []
		// Активный пользователь.
		this.user = { id: null }

		// Визуальная часть чата.
		this.view = document.createElement('div')
		this.view.innerHTML = template
		this.view = this.view.firstElementChild

		// Повесить обработчик на кнопку "Отправить".
		this.button = this.view.querySelector('button')
		this.button.addEventListener('click', e => this.hanlderClick(e))

		// Повесить обработчик поднятия клавиши на поле ввода сообщения.
		this.input = this.view.querySelector('input')
		this.input.addEventListener('keyup', e => this.handlerKeyup(e))
	}

	// Метод создаёт и добавляет сообщение.
	addMessage (data) {
		// Экземпляр сообщения.
		const message = new Message(data.user, data.date, data.content)
		this.messages.push(message)
		
		const messagesPlate = this.view.querySelector('[data-messages]')
		messagesPlate.append(message.view)
		// Прокрутить чат вниз.
		messagesPlate.scrollTo(0, messagesPlate.scrollHeight)
	}

	// Метод очищает input.
	clearInput () {
		this.input.value = ''
	}

	hanlderClick (e) {
		if (this.input.value) {
			// Генерируем событие "send".
			this.emit('send', this.input.value)
		}
	}

	handlerKeyup (e) {
		// Если нажали на клавишу "Ввод":
		if (e.key === 'Enter') {
			// Генерируем событие "send".
			this.emit('send', this.input.value)
		}
	}
}

const template = `
<div class="container vh-100 p-2">
	<div class="card h-100">
		<div class="d-flex flex-column">
			<div class="card-header">
				<h3 class="card-title">Чат онлайн</h3>
			</div>

			<!-- Контейнер для сообщений. -->
			<div
				class="list-group flex-grow-1 overflow-auto message-panel"
				data-messages
			>
			</div>
			<!-- // Контейнер для сообщений. -->

			<div class="card-footer">
				<div class="input-group w-100 d-flex">
					<input
						type="text"
						class="form-input flex-grow-1"
						id="validatedInputGroupCustomFile"
						required
					>
					<div class="input-group-append">
						<button
							class="btn btn-outline-primary"
							type="button"
						>
							Отправить
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`