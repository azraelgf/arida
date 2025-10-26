(() => {
    "use strict";
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-phone-authorization');
        if (!btn) return;

        const form = btn.closest('.form');
        const authRow = form?.querySelector('.form__row_authorization');

        // если форма уже активна — значит, теперь нужно отправлять
        if (authRow?.classList.contains('_active')) {
            form.submit(); // можно заменить на свою AJAX-отправку
            return;
        }

        // иначе показываем поля и меняем кнопку
        authRow?.classList.add('_active');
        btn.textContent = 'Войти';
        btn.type = 'submit'; // теперь кнопка отправляет форму
    });

    //ввод чисел для аторизации
    document.addEventListener('input', (e) => {
        const input = e.target.closest('.js-input_auth');
        if (!input) return;

        // Разрешаем только цифры
        input.value = input.value.replace(/\D/g, '').slice(0, 1);

        if (input.value && input.nextElementSibling?.classList.contains('js-input_auth')) {
            input.nextElementSibling.focus();
        }
    });

    document.addEventListener('keydown', (e) => {
        const input = e.target.closest('.js-input_auth');
        if (!input) return;

        // При Backspace на пустом поле — переходим назад
        if (e.key === 'Backspace' && !input.value) {
            const prev = input.previousElementSibling;
            if (prev?.classList.contains('js-input_auth')) {
                prev.focus();
            }
        }
    });
})();
