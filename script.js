const draggable = document.querySelector('.draggable');
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
let velocityX = 0, velocityY = 0; // Скорость по осям X и Y
let lastTime = 0; // Время последнего кадра
let rafId; // ID для requestAnimationFrame

draggable.ondragstart = function() { // Отменяем перетаскивание элемента собственным drag'n'drop
    return false;
};

draggable.onmousedown = (e) => { 
    isDragging = true;
    startX = e.pageX - draggable.offsetLeft;
    startY = e.pageY - draggable.offsetTop;
    scrollLeft = draggable.scrollLeft;
    scrollTop = draggable.scrollTop;
    lastTime = Date.now();
    draggable.style.cursor = 'grabbing';

    // Останавливаем анимацию инерции, если она была запущена
    cancelAnimationFrame(rafId);
    velocityX = 0;
    velocityY = 0;
};

draggable.onmousemove = (e) => { 
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - draggable.offsetLeft;
    const y = e.pageY - draggable.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    
    // Обновляем скорость на основе перемещения мыши
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;

    if (timeDiff > 0) {
        velocityX = (walkX - (draggable.scrollLeft - scrollLeft)) / timeDiff;
        velocityY = (walkY - (draggable.scrollTop - scrollTop)) / timeDiff;

        // Ограничиваем максимальную скорость:
        const velosityLimit = 100;

        if (velocityX > velosityLimit) { 
            velocityX = velosityLimit;
        }
        if (velocityX < -velosityLimit) {
            velocityX = -velosityLimit;
        }  
        
        if (velocityY > velosityLimit) {
            velocityY = velosityLimit;
        } 
        if (velocityY < -velosityLimit) {
            velocityY = -velosityLimit;
        }

        lastTime = currentTime;
    }

    draggable.scrollLeft = scrollLeft - walkX;
    draggable.scrollTop = scrollTop - walkY;
};

draggable.onmouseup = () => {
    isDragging = false;
    draggable.style.cursor = 'grab';

    const currentTime = Date.now();  
    const timeDiff = currentTime - lastTime;

    // Запускаем анимацию инерции
    if (timeDiff < 10) {
        inertia();
    }
  };

draggable.onmouseleave = () => {
    isDragging = false;
    draggable.style.cursor = 'grab';
};

// Функция для анимации инерции
function inertia() {
    const friction = 0.98; // Коэффициент трения (замедления)
    const minVelocity = 0.1; // Минимальная скорость для остановки

    // Если скорость достаточно большая, продолжаем анимацию
    if (Math.abs(velocityX) > minVelocity || Math.abs(velocityY) > minVelocity) {
        draggable.scrollLeft -= velocityX * 0.3;
        draggable.scrollTop -= velocityY * 0.3;

        // Замедляем скорость
        velocityX *= friction;
        velocityY *= friction;

        // Запускаем следующий кадр анимации
        rafId = requestAnimationFrame(inertia);
    } else {
        // Останавливаем анимацию
        velocityX = 0;
        velocityY = 0;
    }
}