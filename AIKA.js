// AIKA.js - Main JavaScript file for A.I.K.A. (AI-көмекшісі)
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textBox = document.getElementById('textBox');
    const translationBox = document.getElementById('translationBox');
    const brailleBox = document.getElementById('brailleBox');
    const recognizeBtn = document.getElementById('recognizeBtn');
    const importAudioBtn = document.getElementById('importAudioBtn');
    const recordAudioBtn = document.getElementById('recordAudioBtn');
    const speakTranslationBtn = document.getElementById('speakTranslationBtn');
    const generateQrBtn = document.getElementById('generateQrBtn');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const showBrailleTableBtn = document.getElementById('showBrailleTableBtn');
    const showLanguageSelectorBtn = document.getElementById('showLanguageSelectorBtn');
    const langLabel = document.getElementById('langLabel');
    const statusMessage = document.getElementById('statusMessage');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const mobileQrBtn = document.getElementById('mobileQrBtn');
    
    // Modal elements
    const languageModal = document.getElementById('languageModal');
    const brailleTableModal = document.getElementById('brailleTableModal');
    const closeButtons = document.querySelectorAll('.close');
    const langButtons = document.querySelectorAll('.lang-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // QR code elements
    const qrCode = document.getElementById('qrCode');
    const mobileQrCode = document.getElementById('mobileQrCode');
    
    // App state
    let currentLanguage = 'kk'; // Default language: Kazakh
    let isRecording = false;
    let recorder = null;
    let isThemeDark = false;
    
    // Translation API configuration
    const TRANSLATION_API_KEY = 'your-translation-api-key';  // Replace with your actual API key
    const TRANSLATION_API_URL = 'https://translation-api.example.com/translate';  // Replace with actual API endpoint
    
    // Speech recognition configuration
    const SPEECH_TO_TEXT_API_URL = 'https://speech-api.example.com/recognize';  // Replace with actual API endpoint
    
    // Braille mapping data from the provided code
    const brailleData = {
        kazakh: [
            ['а', '⠁'], ['ә', '⠜'], ['б', '⠃'], ['в', '⠺'], ['г', '⠛'], 
            ['ғ', '⠣'], ['д', '⠙'], ['е', '⠑'], ['ё', '⠡'], ['ж', '⠚'], 
            ['з', '⠵'], ['и', '⠊'], ['й', '⠯'], ['к', '⠅'], ['қ', '⠟'], 
            ['л', '⠇'], ['м', '⠍'], ['н', '⠝'], ['ң', '⠻'], ['о', '⠕'], 
            ['ө', '⠪'], ['п', '⠏'], ['р', '⠗'], ['с', '⠎'], ['т', '⠞'], 
            ['у', '⠥'], ['ұ', '⠳'], ['ү', '⠿'], ['ф', '⠋'], ['х', '⠓'], 
            ['һ', '⠧'], ['ц', '⠉'], ['ч', '⠟'], ['ш', '⠱'], ['щ', '⠭'], 
            ['ъ', '⠷'], ['ы', '⠮'], ['і', '⠌'], ['ь', '⠮'], ['э', '⠪'], 
            ['ю', '⠳'], ['я', '⠫']
        ],
        russian: [
            ['а', '⠁'], ['б', '⠃'], ['в', '⠺'], ['г', '⠛'], ['д', '⠙'], 
            ['е', '⠑'], ['ё', '⠡'], ['ж', '⠚'], ['з', '⠵'], ['и', '⠊'], 
            ['й', '⠯'], ['к', '⠅'], ['л', '⠇'], ['м', '⠍'], ['н', '⠝'], 
            ['о', '⠕'], ['п', '⠏'], ['р', '⠗'], ['с', '⠎'], ['т', '⠞'], 
            ['у', '⠥'], ['ф', '⠋'], ['х', '⠓'], ['ц', '⠉'], ['ч', '⠟'], 
            ['ш', '⠱'], ['щ', '⠭'], ['ъ', '⠷'], ['ы', '⠮'], ['ь', '⠮'], 
            ['э', '⠪'], ['ю', '⠳'], ['я', '⠫']
        ],
        latin: [
            ['a', '⠁'], ['b', '⠃'], ['c', '⠉'], ['d', '⠙'], ['e', '⠑'], 
            ['f', '⠋'], ['g', '⠛'], ['h', '⠓'], ['i', '⠊'], ['j', '⠚'], 
            ['k', '⠅'], ['l', '⠇'], ['m', '⠍'], ['n', '⠝'], ['o', '⠕'], 
            ['p', '⠏'], ['q', '⠟'], ['r', '⠗'], ['s', '⠎'], ['t', '⠞'], 
            ['u', '⠥'], ['v', '⠧'], ['w', '⠺'], ['x', '⠭'], ['y', '⠽'], 
            ['z', '⠵']
        ],
        german: [
            ['ä', '⠜'], ['ö', '⠪'], ['ü', '⠳'], ['ß', '⠮']
        ],
        french: [
            ['à', '⠁'], ['â', '⠁'], ['ç', '⠉'], ['è', '⠑'], ['é', '⠑'], 
            ['ê', '⠑'], ['ë', '⠑'], ['î', '⠊'], ['ï', '⠊'], ['ô', '⠕'], 
            ['œ', '⠕'], ['ù', '⠥'], ['û', '⠥'], ['ü', '⠥']
        ],
        korean: [
            ['ㄱ', '⠈'], ['ㄴ', '⠉'], ['ㄷ', '⠊'], ['ㄹ', '⠐'], ['ㅁ', '⠑'],
            ['ㅂ', '⠘'], ['ㅅ', '⠠'], ['ㅇ', '⠨'], ['ㅈ', '⠰'], ['ㅊ', '⠠⠴'],
            ['ㅋ', '⠠⠈'], ['ㅌ', '⠠⠉'], ['ㅍ', '⠠⠊'], ['ㅎ', '⠠⠑'],
            ['ㅏ', '⠣'], ['ㅓ', '⠎'], ['ㅗ', '⠥'], ['ㅜ', '⠍'], ['ㅡ', '⠸'], ['ㅣ', '⠇']
        ],
        japanese: [
            ['ア', '⠁'], ['イ', '⠃'], ['ウ', '⠉'], ['エ', '⠋'], ['オ', '⠊'],
            ['カ', '⠅'], ['キ', '⠇'], ['ク', '⠍'], ['ケ', '⠏'], ['コ', '⠗'],
            ['サ', '⠎'], ['シ', '⠞'], ['ス', '⠥'], ['セ', '⠧'], ['ソ', '⠽'],
            ['タ', '⠙'], ['チ', '⠛'], ['ツ', '⠦'], ['テ', '⠕'], ['ト', '⠺']
        ],
        numbers: [
            ['0', '⠴'], ['1', '⠂'], ['2', '⠆'], ['3', '⠒'], ['4', '⠲'],
            ['5', '⠢'], ['6', '⠖'], ['7', '⠶'], ['8', '⠦'], ['9', '⠔'],
            ['.', '⠲'], [',', '⠂'], ['?', '⠦'], ['!', '⠖'], [':', '⠒'], 
            [';', '⠆'], ["'", '⠄'], ['"', '⠄⠄'], ['(', '⠐⠣'], [')', '⠐⠜'], 
            ['[', '⠨⠣'], [']', '⠨⠜'], ['{', '⠸⠣'], ['}', '⠸⠜'], ['/', '⠸⠌'], 
            ['\\', '⠸⠡'], ['-', '⠤'], ['+', '⠬'], ['=', '⠐⠶'], ['*', '⠐⠔']
        ]
    };
    
    // Language display names
    const languageNames = {
        'kk': '🇰🇿 Қазақша',
        'en': '🇬🇧 Ағылшынша',
        'ru': '🇷🇺 Орысша',
        'ko': '🇰🇷 Кореяша',
        'ja': '🇯🇵 Жапонша',
        'de': '🇩🇪 Немісше',
        'fr': '🇫🇷 Французша'
    };
    
    // ISO language codes for translation API
    const translationLanguageCodes = {
        'kk': 'kk',
        'en': 'en',
        'ru': 'ru',
        'ko': 'ko',
        'ja': 'ja',
        'de': 'de',
        'fr': 'fr'
    };
    
    // Initialize app
    initializeApp();
    
    // Initialize application
    function initializeApp() {
        // Set up event listeners
        setupEventListeners();
        
        // Create Braille reference tables
        createBrailleTables();
        
        // Generate mobile QR code
        generateMobileQR();
        
        // Check for saved theme preference
        checkThemePreference();
        
        // Show initial status message
        setStatus('A.I.K.A. іске қосылды!', 3000);
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Text input event
        textBox.addEventListener('input', debounce(handleTextInput, 500));
        
        // Button click events
        recognizeBtn.addEventListener('click', startSpeechRecognition);
        importAudioBtn.addEventListener('click', importAudio);
        recordAudioBtn.addEventListener('click', toggleRecording);
        speakTranslationBtn.addEventListener('click', speakTranslation);
        generateQrBtn.addEventListener('click', generateTextQR);
        toggleThemeBtn.addEventListener('click', toggleTheme);
        showBrailleTableBtn.addEventListener('click', () => openModal(brailleTableModal));
        showLanguageSelectorBtn.addEventListener('click', () => openModal(languageModal));
        mobileQrBtn.addEventListener('click', showMobileQR);
        
        // Close buttons for modals
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });
        
        // Language selection buttons
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
                closeModal(languageModal);
            });
        });
        
        // Tab buttons in Braille table modal
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                switchTab(tab);
            });
        });
        
        // Close modal when clicking outside content
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                closeModal(event.target);
            }
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    // Create Braille reference tables
    function createBrailleTables() {
        // Create tables for each language/category
        createBrailleTable('kazakhGrid', brailleData.kazakh);
        createBrailleTable('russianGrid', brailleData.russian);
        createBrailleTable('latinGrid', brailleData.latin);
        createBrailleTable('germanGrid', brailleData.german);
        createBrailleTable('frenchGrid', brailleData.french);
        createBrailleTable('koreanGrid', brailleData.korean);
        createBrailleTable('japaneseGrid', brailleData.japanese);
        createBrailleTable('numbersGrid', brailleData.numbers);
    }
    
    // Create a single Braille reference table
    function createBrailleTable(gridId, data) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        grid.innerHTML = '';
        
        data.forEach(pair => {
            const item = document.createElement('div');
            item.className = 'braille-item';
            
            const letter = document.createElement('div');
            letter.className = 'letter';
            letter.textContent = pair[0];
            
            const braille = document.createElement('div');
            braille.className = 'braille-char';
            braille.textContent = pair[1];
            
            item.appendChild(letter);
            item.appendChild(braille);
            grid.appendChild(item);
        });
    }
    
    // Handle text input and convert to Braille
    function handleTextInput() {
        const text = textBox.value.trim();
        
        if (text) {
            // Convert to Braille
            const brailleText = convertToBraille(text);
            brailleBox.value = brailleText;
            
            // Translate text if it's not in the current target language
            if (currentLanguage !== 'kk' || text.match(/[a-zA-Z]/)) { // Translate if not Kazakh or contains Latin characters
                translateText(text);
            } else {
                translationBox.value = text; // Same language, no translation needed
            }
        } else {
            translationBox.value = '';
            brailleBox.value = '';
        }
    }
    
    // Convert text to Braille
    function convertToBraille(text) {
        let result = '';
        const lowerText = text.toLowerCase();
        
        // Combine all character mappings
        const allMappings = {};
        
        Object.values(brailleData).forEach(mappingArray => {
            mappingArray.forEach(pair => {
                allMappings[pair[0]] = pair[1];
            });
        });
        
        // Convert each character
        for (let i = 0; i < lowerText.length; i++) {
            const char = lowerText[i];
            if (allMappings[char]) {
                result += allMappings[char];
            } else if (char === ' ') {
                result += ' ';
            } else {
                result += char; // Keep original if no mapping exists
            }
        }
        
        return result;
    }
    
    // Translate text using translation API (similar to Yandex Translate)
    function translateText(text) {
        showLoading('Аударма жүруде...');
        
        // Check if we have network connectivity to use real API
        if (navigator.onLine) {
            // Prepare the target language code
            const targetLang = translationLanguageCodes[currentLanguage];
            
            // Try to use real translation API
            try {
                // Use the free translation API or fallback to our mock
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const translationUrl = encodeURIComponent(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
                );
                
                fetch(proxyUrl + translationUrl)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => {
                        try {
                            // Parse the response to get the translation
                            const translatedContent = JSON.parse(data.contents);
                            let translatedText = '';
                            
                            // Extract the translated text from the response
                            if (translatedContent && translatedContent[0]) {
                                translatedContent[0].forEach(item => {
                                    if (item[0]) {
                                        translatedText += item[0];
                                    }
                                });
                            }
                            
                            if (translatedText) {
                                translationBox.value = translatedText;
                                setStatus('Аударма аяқталды!', 2000);
                            } else {
                                throw new Error('Translation failed');
                            }
                        } catch (e) {
                            // If JSON parsing fails, fall back to mock translation
                            provideMockTranslation(text);
                        }
                        hideLoading();
                    })
                    .catch(error => {
                        console.error('Translation API error:', error);
                        provideMockTranslation(text);
                        hideLoading();
                    });
            } catch (error) {
                console.error('Translation setup error:', error);
                provideMockTranslation(text);
                hideLoading();
            }
        } else {
            // No internet connection, use mock translation
            provideMockTranslation(text);
            hideLoading();
        }
    }
    
    // Provide mock translations when API is not available
    function provideMockTranslation(text) {
        // Simple mock translations for demo or fallback
        let translation = '';
        
        // For demo purposes, we'll simulate translations
        // In a real app, you would use a proper translation API
        switch(currentLanguage) {
            case 'kk':
                translation = text; // Same language, no translation
                break;
            case 'en':
                if (text.match(/[а-яА-ЯәөңғұҮі]/i)) { // Contains Cyrillic/Kazakh characters
                    translation = `[Translation to English: "${text}"]`;
                } else {
                    translation = text; // Already in English or other Latin script
                }
                break;
            case 'ru':
                if (!text.match(/[а-яА-Я]/i) || text.match(/[әөңғұҮі]/i)) { // Not Russian or contains Kazakh-specific characters
                    translation = `[Перевод на русский: "${text}"]`;
                } else {
                    translation = text; // Already in Russian
                }
                break;
            case 'ko':
                translation = `[한국어 번역: "${text}"]`;
                break;
            case 'ja':
                translation = `[日本語翻訳: "${text}"]`;
                break;
            case 'de':
                translation = `[Deutsche Übersetzung: "${text}"]`;
                break;
            case 'fr':
                translation = `[Traduction française: "${text}"]`;
                break;
            default:
                translation = text;
        }
        
        translationBox.value = translation;
        setStatus('Аударма аяқталды (демо режим)!', 2000);
    }
    
    // Speech recognition functionality
    function startSpeechRecognition() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            setStatus('Сөйлеу тану қолдау көрсетілмейді', 3000);
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = getLangCodeForSpeech();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        showLoading('Тыңдау...');
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            textBox.value = transcript;
            handleTextInput();
            hideLoading();
            setStatus('Сөйлемді тану аяқталды!', 2000);
        };
        
        recognition.onerror = function(event) {
            hideLoading();
            setStatus('Қате: ' + event.error, 3000);
        };
        
        recognition.onend = function() {
            hideLoading();
        };
    }
    
    // Get appropriate language code for speech recognition
    function getLangCodeForSpeech() {
        const speechLangCodes = {
            'kk': 'kk-KZ',
            'en': 'en-US',
            'ru': 'ru-RU',
            'ko': 'ko-KR',
            'ja': 'ja-JP',
            'de': 'de-DE',
            'fr': 'fr-FR'
        };
        
        return speechLangCodes[currentLanguage] || 'en-US';
    }
    
    // Import audio file and process it for speech-to-text conversion
    function importAudio() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                showLoading('Аудио файлды өңдеу...');
                setStatus(`"${file.name}" өңделуде...`, 2000);
                
                // Create audio context for processing
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                
                // Read the file
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Convert file to audio buffer
                    const arrayBuffer = e.target.result;
                    
                    // Decode audio data
                    audioContext.decodeAudioData(arrayBuffer)
                        .then(audioBuffer => {
                            // Successfully decoded audio
                            processAudioBuffer(audioBuffer, file.name);
                        })
                        .catch(error => {
                            console.error('Error decoding audio data:', error);
                            tryDirectSpeechRecognition(file);
                        });
                };
                
                reader.onerror = function() {
                    hideLoading();
                    setStatus('Файлды оқу кезінде қате пайда болды', 3000);
                };
                
                reader.readAsArrayBuffer(file);
            }
        };
        
        input.click();
    }
    
    // Process audio buffer for speech recognition
    function processAudioBuffer(audioBuffer, fileName) {
        // If we have Web Speech API support and audio in memory, we can try direct recognition
        if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            // In a real application, you would:
            // 1. Convert the audioBuffer to WAV or other format
            // 2. Send it to a speech-to-text API
            // 3. Process the response
            
            // For demo purposes, we'll simulate a successful transcription
            setTimeout(() => {
                // Simulate different transcriptions based on filename for demo
                let transcription;
                const lowerFileName = fileName.toLowerCase();
                
                if (lowerFileName.includes('hello') || lowerFileName.includes('greeting')) {
                    transcription = 'Hello, how are you today?';
                } else if (lowerFileName.includes('test')) {
                    transcription = 'This is a test audio file.';
                } else if (lowerFileName.includes('казахский') || lowerFileName.includes('kazakh')) {
                    transcription = 'Сәлеметсіз бе, қалыңыз қалай?';
                } else if (lowerFileName.includes('русский') || lowerFileName.includes('russian')) {
                    transcription = 'Здравствуйте, как у вас дела?';
                } else {
                    transcription = `Транскрипция для файла "${fileName}"`;
                }
                
                textBox.value = transcription;
                handleTextInput();
                hideLoading();
                setStatus('Аудио файл сәтті өңделді!', 2000);
            }, 2000);
        } else {
            // No speech recognition available
            hideLoading();
            setStatus('Сөйлеу тану функциясы қолжетімсіз', 3000);
        }
    }
    
    // Try to use Web Speech API for direct recognition from file
    function tryDirectSpeechRecognition(file) {
        // For demo, we'll simulate processing with timeout
        // In a real app, you would use a speech-to-text API with file upload
        setTimeout(() => {
            const fakePhrases = [
                "Сәлеметсіз бе, бұл тест хабарлама.",
                "Hello, this is a test message.",
                "Добрый день, это тестовое сообщение.",
                "안녕하세요, 테스트 메시지입니다.",
                "こんにちは、これはテストメッセージです。"
            ];
            
            // Choose random phrase based on file name hash
            const fileNameHash = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const phrase = fakePhrases[fileNameHash % fakePhrases.length];
            
            textBox.value = phrase;
            handleTextInput();
            hideLoading();
            setStatus('Аудио файл өңделді (демо режим)!', 2000);
        }, 2000);
    }
    
    // Toggle audio recording
    function toggleRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setStatus('Аудио жазу қолдау көрсетілмейді', 3000);
            return;
        }
        
        if (isRecording) {
            // Stop recording
            stopRecording();
        } else {
            // Start recording
            startRecording();
        }
    }
    
    // Start audio recording
    function startRecording() {
        showLoading('Жазба дайындалуда...');
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                hideLoading();
                showLoading('Жазба жүріп жатыр...');
                
                // Make sure RecordRTC is available
                if (typeof RecordRTC === 'undefined') {
                    throw new Error('RecordRTC is not loaded');
                }
                
                recorder = new RecordRTC(stream, {
                    type: 'audio',
                    mimeType: 'audio/webm',
                    recorderType: RecordRTC.StereoAudioRecorder,
                    numberOfAudioChannels: 1,
                    desiredSampRate: 16000 // Better for speech recognition
                });
                
                recorder.startRecording();
                
                isRecording = true;
                recordAudioBtn.innerHTML = '<i class="fas fa-stop"></i> Тоқтату';
                recordAudioBtn.classList.add('active');
                
                setStatus('Жазба басталды', 2000);
            })
            .catch(error => {
                console.error('Recording error:', error);
                hideLoading();
                setStatus('Қате: ' + error.message, 3000);
            });
    }
    
    // Stop audio recording
    function stopRecording() {
        if (recorder) {
            recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                processAudioRecording(blob);
                
                isRecording = false;
                recordAudioBtn.innerHTML = '<i class="fas fa-record-vinyl"></i> Жазба';
                recordAudioBtn.classList.remove('active');
                
                // Stop all tracks from the stream
                recorder.getBlob().stream.getTracks().forEach(track => track.stop());
            });
        }
    }
    
    // Process the recorded audio
    function processAudioRecording(blob) {
        showLoading('Жазбаны өңдеу...');
        
        // Create a URL for the audio blob
        const audioURL = URL.createObjectURL(blob);
        
        // Create audio element to verify recording
        const audio = new Audio(audioURL);
        
        // Get speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            // In a real app, you would send the blob to a speech-to-text API
            // For demo, we'll use a timeout to simulate processing
            
            setTimeout(() => {
                // Generate different fake transcription based on current language
                let transcription;
                
                switch(currentLanguage) {
                    case 'kk':
                        transcription = 'Сіздің жазбаңыз сәтті өңделді. Бұл демо нұсқасы.';
                        break;
                    case 'en':
                        transcription = 'Your recording has been successfully processed. This is a demo version.';
                        break;
                    case 'ru':
                        transcription = 'Ваша запись успешно обработана. Это демо-версия.';
                        break;
                    case 'ko':
                        transcription = '녹음이 성공적으로 처리되었습니다. 이것은 데모 버전입니다.';
                        break;
                    case 'ja':
                        transcription = '録音が正常に処理されました。これはデモバージョンです。';
                        break;
                    case 'de':
                        transcription = 'Ihre Aufnahme wurde erfolgreich verarbeitet. Dies ist eine Demo-Version.';
                        break;
                    case 'fr':
                        transcription = 'Votre enregistrement a été traité avec succès. Il s\'agit d\'une version de démonstration.';
                        break;
                    default:
                        transcription = 'Your recording has been processed successfully. This is a demo version.';
                }
                
                textBox.value = transcription;
                handleTextInput();
                hideLoading();
                setStatus('Жазба сәтті өңделді (демо режим)!', 2000);
            }, 2000);
        } else {
            // No speech recognition available
            hideLoading();
            setStatus('Сөйлеу тану функциясы қолжетімсіз', 3000);
        }
    }
    
    // Generate QR Code for the text content
    function generateTextQR() {
        // Clear previous QR code
        qrCode.innerHTML = '';
        
        const text = textBox.value.trim();
        
        if (!text) {
            setStatus('QR кодын жасау үшін мәтін енгізіңіз', 3000);
            return;
        }
        
        // Create QR code
        new QRCode(qrCode, {
            text: text,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        setStatus('QR код жасалды!', 2000);
    }
    
    // Generate QR Code for mobile app download
    function generateMobileQR() {
        // Generate a QR code with link to the mobile app
        // For demo, we'll use the current URL
        const appUrl = window.location.href;
        
        new QRCode(mobileQrCode, {
            text: appUrl,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // Show the mobile QR code in a modal
    function showMobileQR() {
        // Create a modal for mobile QR code
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function() {
            document.body.removeChild(modal);
        };
        
        const title = document.createElement('h2');
        title.textContent = 'Мобильді нұсқаға арналған QR-код';
        
        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-container';
        qrContainer.style.textAlign = 'center';
        qrContainer.style.padding = '20px';
        
        // Clone the existing mobile QR code
        const qrClone = mobileQrCode.cloneNode(true);
        
        qrContainer.appendChild(qrClone);
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(qrContainer);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }
    
    // Text-to-speech functionality for translation
    function speakTranslation() {
        const text = translationBox.value.trim();
        
        if (!text) {
            setStatus('Сөйлеу үшін аударма мәтіні енгізіңіз', 3000);
            return;
        }
        
        // Check if browser supports text-to-speech
        if ('speechSynthesis' in window) {
            showLoading('Сөйлеу дайындалуда...');
            
            // Create speech synthesis utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set language based on selected language
            utterance.lang = getLangCodeForSpeech();
            
            // Set voice if available
            window.speechSynthesis.onvoiceschanged = function() {
                const voices = window.speechSynthesis.getVoices();
                const langCode = getLangCodeForSpeech();
                
                // Find a matching voice for the language
                const voice = voices.find(voice => voice.lang.includes(langCode.split('-')[0]));
                if (voice) {
                    utterance.voice = voice;
                }
            };
            
            // Handle speech events
            utterance.onstart = function() {
                hideLoading();
                setStatus('Сөйлеп жатыр...', 1000);
            };
            
            utterance.onend = function() {
                setStatus('Сөйлеу аяқталды', 2000);
            };
            
            utterance.onerror = function(event) {
                hideLoading();
                setStatus('Сөйлеу кезінде қате: ' + event.error, 3000);
            };
            
            // Speak
            window.speechSynthesis.speak(utterance);
        } else {
            setStatus('Сіздің браузеріңіз сөйлеу синтезін қолдамайды', 3000);
        }
    }
    
    // Toggle between light and dark themes
    function toggleTheme() {
        isThemeDark = !isThemeDark;
        
        if (isThemeDark) {
            document.body.classList.add('dark-mode');
            toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i> Фон';
            setStatus('Күңгірт фон қосылды', 2000);
        } else {
            document.body.classList.remove('dark-mode');
            toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i> Фон';
            setStatus('Жарық фон қосылды', 2000);
        }
        
        // Save preference to localStorage
        localStorage.setItem('aikaTheme', isThemeDark ? 'dark' : 'light');
    }
    
    // Check for saved theme preference
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('aikaTheme');
        
        if (savedTheme === 'dark') {
            isThemeDark = true;
            document.body.classList.add('dark-mode');
            toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i> Фон';
        }
    }
    
    // Change the selected language
    function changeLanguage(lang) {
        if (translationLanguageCodes[lang]) {
            currentLanguage = lang;
            
            // Update UI
            langLabel.textContent = `🌐 Таңдалған тіл: ${languageNames[lang]}`;
            
            // Update active button in modal
            langButtons.forEach(button => {
                if (button.getAttribute('data-lang') === lang) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            
            // Re-translate if there's text
            if (textBox.value.trim()) {
                handleTextInput();
            }
            
            setStatus(`Тіл ${languageNames[lang]} болып өзгертілді!`, 2000);
            
            // Save preference to localStorage
            localStorage.setItem('aikaLanguage', lang);
        }
    }
    
    // Switch between tabs in Braille table modal
    function switchTab(tabId) {
        // Hide all tab panes
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Show selected tab pane
        const selectedPane = document.getElementById(tabId);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }
        
        // Update active tab button
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Open modal
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    // Close modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Handle keyboard shortcuts
    function handleKeyboardShortcuts(event) {
        // Check if Ctrl key is pressed
        if (event.ctrlKey) {
            switch(event.key) {
                case 's':
                    // Ctrl+S: Start speech recognition
                    event.preventDefault();
                    startSpeechRecognition();
                    break;
                case 'r':
                    // Ctrl+R: Toggle recording
                    event.preventDefault();
                    toggleRecording();
                    break;
                case 'q':
                    // Ctrl+Q: Generate QR code
                    event.preventDefault();
                    generateTextQR();
                    break;
                case 'l':
                    // Ctrl+L: Open language selector
                    event.preventDefault();
                    openModal(languageModal);
                    break;
                case 'b':
                    // Ctrl+B: Open Braille table
                    event.preventDefault();
                    openModal(brailleTableModal);
                    break;
                case 'd':
                    // Ctrl+D: Toggle theme
                    event.preventDefault();
                    toggleTheme();
                    break;
                case 'p':
                    // Ctrl+P: Speak translation
                    event.preventDefault();
                    speakTranslation();
                    break;
            }
        }
    }
    
    // Set status message with auto-clear
    function setStatus(message, duration) {
        statusMessage.textContent = message;
        
        // Clear after duration
        if (duration) {
            setTimeout(() => {
                statusMessage.textContent = '';
            }, duration);
        }
    }
    
    // Show loading overlay
    function showLoading(message = 'Өңдеу...') {
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }
    
    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
    
    // Debounce function to limit how often a function is called
    function debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});