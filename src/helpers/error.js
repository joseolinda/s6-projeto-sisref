
export function getErrorMessage(error) {
    console.log(error.message);

    if (error.message === "Network Error") {
        return 'Erro de conexão.';
    }

    if(error.response) {
        switch (error.response.status) {
            case 400:
                return 'Dados incorretos';
            case 404:
                return 'Não encontrado.';
            case 500:
                return 'Erro no servidor remoto.';
            default:
                break;
        }
    }

    return 'Erro inesperado. Tente novamente depois.';
}