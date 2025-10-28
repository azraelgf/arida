/**
 * Скрипт затрагивает только .form__input с placeholder, содержащим * — остальные поля не трогаем.
 * */
document.addEventListener('DOMContentLoaded', () => {
    const sel = '.form__input[placeholder*="*"]:not([type="checkbox"]):not([type="radio"])';
    const inputs = document.querySelectorAll(sel);

    inputs.forEach((input) => {
        const ph = input.getAttribute('placeholder') || '';
        // Берём текст до звездочки
        const text = ph.split('*')[0].trim();

        // Обёртка
        const wrap = document.createElement('span');
        wrap.className = 'input-phwrap';
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);

        // Фейковый placeholder
        const fake = document.createElement('span');
        fake.className = 'fake-ph';
        fake.innerHTML = `${text} <span class="fake-ph__star">*</span>`;
        wrap.appendChild(fake);

        // Убираем нативный placeholder, чтобы не было дублирования
        input.setAttribute('data-original-placeholder', ph);
        input.setAttribute('placeholder', '');

        const refresh = () => {
            if (input.value.trim()) {
                wrap.classList.add('has-value');
            } else {
                wrap.classList.remove('has-value');
            }
        };

        // События
        input.addEventListener('input', refresh);
        input.addEventListener('focus', () => wrap.classList.add('has-focus'));
        input.addEventListener('blur', () => {
            wrap.classList.remove('has-focus');
            refresh();
        });

        // Инициализация + учёт авто-заполнения
        refresh();
        setTimeout(refresh, 300);
    });
});
