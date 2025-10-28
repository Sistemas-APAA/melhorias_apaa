/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/url', 'N/record', 'N/runtime', 'N/currentRecord'], function (url, record, runtime, currentRecord) {

    function pageInit(context) {
        // Código de inicialização da página, se necessário.
    }

    function imprimirPDF() {
        try {
            var rec = currentRecord.get(); // Pega o registro atual (ex: Purchase Order)
            var recordId = rec.id; // ID do registro atual

            // Gera a URL da Suitelet que irá renderizar o PDF
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript5478', // Substitua pelo scriptId da Suitelet que renderiza o PDF
                deploymentId: 'customdeploy1', // Substitua pelo deploymentId
                params: { 'recordId': recordId }
            });

            // Abre a URL em uma nova aba/janela, onde o PDF será exibido
            window.open(suiteletUrl);

        } catch (e) {
            console.error('Erro ao abrir o PDF: ' + e.message);
        }
    }

    return {
        pageInit: pageInit,
        imprimirPDF: imprimirPDF
    };
});
