// Integra\u00e7\u00e3o com a API de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Mostrar indicador de carregamento
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Entrando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://sag-sag.rak8a3.easypanel.host/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    senha: password  // Ajustado para "senha" conforme esperado pela API
                })
            });

            console.log('Status da resposta:', response.status);
            const responseText = await response.text();
            console.log('Resposta completa:', responseText);

            let data;
            try {
                if (responseText) {
                    data = JSON.parse(responseText);
                }
            } catch (e) {
                console.error('Resposta n\u00e3o \u00e9 um JSON v\u00e1lido:', e);
            }

            if (response.ok) {
                console.log('Login bem-sucedido:', data);
                console.log('Detalhes do usu\u00e1rio:');
                console.log('ID:', data.id);
                console.log('Nome:', data.nome);
                console.log('Email:', data.email);
                console.log('Tipo de usu\u00e1rio recebido da API:', data.tipo_usuario);

                let userType = data.tipo_usuario || 'USUARIO';
                const adminTypes = ['ADMINISTRADOR', 'ADMIN', 'admin', 'Administrador', 'Administrator'];
                if (adminTypes.includes(userType)) {
                    userType = 'ADMINISTRADOR';
                    console.log('Usu\u00e1rio identificado como ADMINISTRADOR');
                } else {
                    console.log('Tipo de usu\u00e1rio original mantido:', userType);
                }

                if (email === 'sag@gmail.com' && password === 'password') {
                    console.log('Usu\u00e1rio especial detectado - for\u00e7ando tipo ADMINISTRADOR');
                    userType = 'ADMINISTRADOR';
                }

                const userData = {
                    id: data.id,
                    name: data.nome || 'Usu\u00e1rio',
                    email: data.email,
                    type: userType,
                    role: userType,
                    token: data.token || 'token-mock',
                    apiId: data.id
                };

                console.log('Dados do usu\u00e1rio a serem salvos na sess\u00e3o:', userData);

                sessionStorage.setItem('currentUser', JSON.stringify(userData));

                if (data.token) {
                    localStorage.setItem('userToken', data.token);
                }

                window.location.href = '../dashboard.html';
            } else {
                let errorMsg = 'Email ou senha incorretos!';
                if (data && data.message) {
                    errorMsg = data.message;
                }

                errorMessage.textContent = errorMsg;
                errorMessage.classList.remove('hidden');

                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 5000);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            errorMessage.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
            errorMessage.classList.remove('hidden');

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 5000);
        }
    });
});
