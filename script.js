document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Mostrar indicador de carregamento
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i> Entrando...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(
        "https://sag-sag.rak8a3.easypanel.host/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            senha: password, 
          }),
        }
      );
      // Obter o texto da resposta para análise
      const responseText = await response.text();

      // Tentar converter para JSON se possível
      let data;
      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch (e) {
        console.error("Resposta não é um JSON válido:", e);
      }

      if (response.ok) {
        let userType = data.tipo_usuario || "USUARIO";

        const adminTypes = [
          "ADMINISTRADOR"
        ];
        if (adminTypes.includes(userType)) {
          userType = "ADMINISTRADOR";
        } 
        // Criar objeto de usuário para armazenar na sessão
        const userData = {
          id: data.id,
          name: data.nome || "Usuário",
          email: data.email,
          type: userType,
          role: userType, 
          token: data.token || "token-mock",
          apiId: data.id,
        };
        // Armazenar dados do usuário na sessão
        sessionStorage.setItem("currentUser", JSON.stringify(userData));

        // Se a API enviou um token, armazená-lo também
        if (data.token) {
          localStorage.setItem("userToken", data.token);
        }

        // Redirecionar para a página principal após login bem-sucedido
        window.location.href = "dashboard.html";
      } else {
        // Mostrar mensagem de erro específica, se disponível na resposta
        let errorMsg = "Email ou senha incorretos!";
        if (data && data.message) {
          errorMsg = data.message;
        }

        errorMessage.textContent = errorMsg;
        errorMessage.classList.remove("hidden");

        // Restaurar botão
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Esconder mensagem de erro após alguns segundos
        setTimeout(() => {
          errorMessage.classList.add("hidden");
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      errorMessage.textContent =
        "Erro ao conectar com o servidor. Tente novamente.";
      errorMessage.classList.remove("hidden");

      // Restaurar botão
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      // Esconder mensagem de erro após alguns segundos
      setTimeout(() => {
        errorMessage.classList.add("hidden");
      }, 5000);
    }
  });
});
