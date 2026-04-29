// Fix para checkboxes - asegura que el estado visual coincida con el estado real
document.addEventListener('DOMContentLoaded', function() {
    // Función para actualizar el estado visual de los checkboxes
    function updateCheckboxVisualState() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const checkmark = checkbox.nextElementSibling;
            if (checkmark && checkmark.classList.contains('checkmark')) {
                // Actualizar clase según el estado checked
                checkmark.classList.toggle('checked', checkbox.checked);
            }
        });
    }

    // Añadir event listeners a todos los checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckboxVisualState);
        
        // También actualizar cuando se hace clic en el label completo
        const label = checkbox.closest('.checkbox-label');
        if (label) {
            label.addEventListener('click', function(e) {
                // Pequeño delay para que el estado se actualice
                setTimeout(updateCheckboxVisualState, 50);
            });
        }
    });

    // Actualizar estado inicial
    updateCheckboxVisualState();
});