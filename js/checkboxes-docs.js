
const selectAllCheckbox = document.getElementById('doc_all');
const individualCheckboxes = document.querySelectorAll('.js-doc-checkbox');

// Обработчик для чекбокса "Принять все"
selectAllCheckbox.addEventListener('change', function () {
    individualCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});
