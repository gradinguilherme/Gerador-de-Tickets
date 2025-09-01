document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const formSection = document.getElementById('form-section');
    const ticketSection = document.getElementById('ticket-section');
    const form = document.getElementById('ticket-form');
    
    // Elementos do Upload
    const avatarDropzone = document.getElementById('avatar-dropzone');
    const avatarInput = document.getElementById('avatar-input');
    const uploadPrompt = avatarDropzone.querySelector('.upload-prompt');
    const uploadPreview = avatarDropzone.querySelector('.upload-preview');
    const previewImg = document.getElementById('avatar-preview-img');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const changeImageBtn = document.getElementById('change-image-btn');
    
    // Campos do Formulário
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const githubInput = document.getElementById('github');
    
    // Elementos do Ticket
    const ticketName = document.getElementById('ticket-name');
    const ticketEmail = document.getElementById('ticket-email');
    const ticketAvatar = document.getElementById('ticket-avatar');
    const ticketFullname = document.getElementById('ticket-fullname');
    const ticketGithub = document.getElementById('ticket-github').querySelector('span');
    const ticketNumber = document.getElementById('ticket-number');

    let uploadedFile = null;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    // --- FUNÇÕES AUXILIARES DE VALIDAÇÃO ---
    const showError = (element, message) => {
        element.classList.add('error');
        const errorElement = document.getElementById(`${element.id}-error`) || document.getElementById('avatar-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    };

    const clearError = (element) => {
        element.classList.remove('error');
        const errorElement = document.getElementById(`${element.id}-error`) || document.getElementById('avatar-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    };

    // --- LÓGICA DE UPLOAD DE ARQUIVO ---
    
    // Abrir seletor de arquivo ao clicar
    avatarDropzone.addEventListener('click', (e) => {
        if (e.target !== removeImageBtn && e.target !== changeImageBtn) {
            avatarInput.click();
        }
    });
    
    // Lidar com arquivo selecionado
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Lógica de Drag and Drop
    avatarDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        avatarDropzone.classList.add('dragging');
    });

    avatarDropzone.addEventListener('dragleave', () => {
        avatarDropzone.classList.remove('dragging');
    });

    avatarDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        avatarDropzone.classList.remove('dragging');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });
    
    function handleFile(file) {
        clearError(avatarDropzone);
        // Validar tipo
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showError(avatarDropzone, 'Formato inválido. Use JPG ou PNG.');
            return;
        }
        
        // Validar tamanho
        if (file.size > MAX_FILE_SIZE) {
            showError(avatarDropzone, 'Arquivo muito grande. Máximo de 700KB.');
            return;
        }
        
        uploadedFile = file;
        showPreview(file);
    }
    
    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadPrompt.style.display = 'none';
            uploadPreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
    
    // Lógica dos botões de remover/alterar
    removeImageBtn.addEventListener('click', () => {
        uploadedFile = null;
        avatarInput.value = ''; // Limpa o input
        previewImg.src = '#';
        uploadPreview.style.display = 'none';
        uploadPrompt.style.display = 'flex';
        clearError(avatarDropzone);
    });

    changeImageBtn.addEventListener('click', () => {
        avatarInput.click();
    });
    
    // --- LÓGICA DO FORMULÁRIO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            generateTicket();
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        // Validar Avatar
        if (!uploadedFile) {
            isValid = false;
            showError(avatarDropzone, 'Por favor, envie um avatar.');
        } else {
            clearError(avatarDropzone);
        }
        
        // Validar Nome
        if (fullNameInput.value.trim() === '') {
            isValid = false;
            showError(fullNameInput, 'O nome completo é obrigatório.');
        } else {
            clearError(fullNameInput);
        }
        
        // Validar Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            showError(emailInput, 'Por favor, insira um email válido.');
        } else {
            clearError(emailInput);
        }
        
        // Validar GitHub
        if (githubInput.value.trim() === '') {
            isValid = false;
            showError(githubInput, 'O usuário do GitHub é obrigatório.');
        } else {
            clearError(githubInput);
        }

        return isValid;
    }

    function generateTicket() {
        // Preencher dados do ticket
        ticketName.textContent = fullNameInput.value.split(' ')[0]; // Pega o primeiro nome
        ticketEmail.textContent = emailInput.value;
        ticketAvatar.src = previewImg.src;
        ticketFullname.textContent = fullNameInput.value;
        ticketGithub.textContent = githubInput.value.startsWith('@') ? githubInput.value : `@${githubInput.value}`;
        
        // Gera um número de ticket aleatório
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        ticketNumber.textContent = `#${randomNum}`;

        // Alternar visibilidade das seções com uma transição suave
        formSection.style.transition = 'opacity 0.5s ease-out';
        formSection.style.opacity = '0';
        
        setTimeout(() => {
            formSection.style.display = 'none';
            ticketSection.style.display = 'block';
            ticketSection.style.opacity = '0';
            setTimeout(() => {
                ticketSection.style.transition = 'opacity 0.5s ease-in';
                ticketSection.style.opacity = '1';
            }, 50); 
        }, 500);
    }
});
