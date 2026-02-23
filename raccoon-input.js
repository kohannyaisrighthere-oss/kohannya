const inputField = document.getElementById('secret-input');
const checkBtn   = document.getElementById('check-btn');
const message    = document.getElementById('message');

const storyKeyWords   = Array.from(document.querySelectorAll('.textStory strong'))
                            .map(el => el.textContent.trim());
const ANSWER_FROM_DOM = storyKeyWords.join(' ');

const STATIC_ANSWERS = [
    'одного дня ми зустрілися',
    'одного дня ми зустрілись',
    'одного дня ми зустр\u0456лися',
    'одного дня ми зустр\u0456лись',
];

const ALL_HINTS = [
    'Єнот склав з зірок твоє ім\'я. Просто так, бо захотів',
    'Єнот притримує для тебе місяць, поки ти шукаєш відповідь',
    'Навіть зорі трохи нахилилися подивитись, як ти намагаєшся',
    'Єнот дивиться на тебе з ніжністю розміром із галактику',
    'Кожна твоя спроба — це просто ще одна мила секунда, яку ми проводимо разом',
    'Твоя любов така велика, що сьогодні вона трохи не поміщається в правильні кліки!',
    'Єнот тягнеться маленькими лапками до екрана, ніби хоче тебе обійняти',
    'Навіть коли ти натискаєш не туди, це виглядає неймовірно мило',
    'Твоя впертість така чарівна, що хочеться аплодувати лапками',
    'Здається, ти намагаєшся зламати систему силою кохання',
    'Подивись уважно на текст. Деякі слова виглядають... пухкішими',
    'Єнот дістав крихітний компас. Стрілка наполегливо вказує на початок тексту',
];

let hintQueue = [];

function nextHint() {
    if (hintQueue.length === 0) {
        hintQueue = [...ALL_HINTS].sort(() => Math.random() - 0.5);
    }
    return hintQueue.pop();
}

function normalize(str) {
    return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

function navigate() {
    window.location.href = 'new-year.html';
}

checkBtn.addEventListener('click', () => {
    const input     = normalize(inputField.value);
    const domAnswer = normalize(ANSWER_FROM_DOM);
    const isCorrect = (input === domAnswer)
                   || STATIC_ANSWERS.some(a => normalize(a) === input);
    if (isCorrect) {
        message.style.color     = '#8b2252';
        message.style.fontStyle = 'italic';
        message.textContent     = '✦ Всесвіт перевірив твоє серце. Доступ до кохання — відкрито ✦';
        message.classList.remove('hidden');
        setTimeout(navigate, 3500);
        return;
    } else {
        message.style.color     = 'rgba(180, 100, 140, 0.9)';
        message.style.fontStyle = 'italic';
        message.textContent     = nextHint();
        message.classList.remove('hidden');
    }
});

inputField.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkBtn.click();
});